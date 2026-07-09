import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { AGREEMENT_FIELDS } from "./lib/agreementFields";
import { suggestAgreementMapping, toAgreementData } from "./lib/agreementMapper";
import { getColumnNames, parseSheetRows, parseWorkbook } from "./lib/excel";
import { buildPdfZip } from "./lib/generate";
import { downloadBlob, registerSessionCleanup } from "./lib/session";
import type { ParsedWorkbook } from "./lib/excel";
import type { ExcelRecord, Mapping } from "./lib/types";

function App() {
  const [workbookData, setWorkbookData] = useState<ParsedWorkbook | null>(null);
  const [selectedSheet, setSelectedSheet] = useState<string>("");
  const [headerRow, setHeaderRow] = useState<number>(1);
  const [records, setRecords] = useState<ExcelRecord[]>([]);
  const [columnNames, setColumnNames] = useState<string[]>([]);
  const [mapping, setMapping] = useState<Mapping>({});
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [status, setStatus] = useState<string>("");

  const mappedCount = useMemo(() => {
    return AGREEMENT_FIELDS.filter((field) => Boolean(mapping[field.key])).length;
  }, [mapping]);

  const missingRequired = useMemo(() => {
    return AGREEMENT_FIELDS.filter((field) => field.required && !mapping[field.key]);
  }, [mapping]);

  useEffect(() => {
    const unregister = registerSessionCleanup(() => {
      setWorkbookData(null);
      setRecords([]);
      setColumnNames([]);
      setMapping({});
      setStatus("");
      setError("");
    });
    return unregister;
  }, []);

  const extractRows = (workbook: ParsedWorkbook, sheetName: string, row: number): void => {
    try {
      const parsedRows = parseSheetRows(workbook.workbook, sheetName, row);
      const columns = getColumnNames(parsedRows);
      setRecords(parsedRows);
      setColumnNames(columns);
      setStatus(`Wczytano ${parsedRows.length} wierszy z arkusza "${sheetName}".`);
      setError("");
      setMapping((previous) => ({ ...suggestAgreementMapping(columns), ...previous }));
    } catch (parseError) {
      const message = parseError instanceof Error ? parseError.message : "Nie udalo sie odczytac wierszy.";
      setError(message);
      setStatus("");
      setRecords([]);
      setColumnNames([]);
    }
  };

  const onExcelUpload = async (event: ChangeEvent<HTMLInputElement>): Promise<void> => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    setError("");
    setStatus("Wczytywanie skoroszytu...");

    try {
      const parsedWorkbook = await parseWorkbook(file);
      const defaultSheet = parsedWorkbook.sheetNames[0] ?? "";
      setWorkbookData(parsedWorkbook);
      setSelectedSheet(defaultSheet);
      setHeaderRow(1);

      if (defaultSheet) {
        extractRows(parsedWorkbook, defaultSheet, 1);
      }
    } catch (uploadError) {
      const message =
        uploadError instanceof Error ? uploadError.message : "Nie udalo sie odczytac pliku Excel.";
      setError(message);
      setStatus("");
    } finally {
      event.target.value = "";
    }
  };

  const onSheetChange = (event: ChangeEvent<HTMLSelectElement>): void => {
    const value = event.target.value;
    setSelectedSheet(value);
    if (workbookData && value) {
      extractRows(workbookData, value, headerRow);
    }
  };

  const onHeaderRowChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const value = Math.max(1, Number(event.target.value || "1"));
    setHeaderRow(value);
    if (workbookData && selectedSheet) {
      extractRows(workbookData, selectedSheet, value);
    }
  };

  const onMappingChange = (fieldName: string, excelColumn: string): void => {
    setMapping((previous) => ({ ...previous, [fieldName]: excelColumn }));
  };

  const onAutoMap = (): void => {
    if (columnNames.length === 0) {
      return;
    }
    const suggestions = suggestAgreementMapping(columnNames);
    setMapping((previous) => ({ ...suggestions, ...previous }));
    setStatus("Uzupelniono sugestie mapowania. Sprawdz pola wymagane przed generowaniem.");
  };

  const onGenerate = async (): Promise<void> => {
    if (records.length === 0) {
      setError("Najpierw wczytaj plik Excel z danymi.");
      return;
    }
    if (missingRequired.length > 0) {
      setError(
        `Uzupelnij wymagane mapowania: ${missingRequired.map((field) => field.label).join(", ")}.`,
      );
      return;
    }

    setIsGenerating(true);
    setError("");
    setStatus("Generowanie PDF-ow...");

    try {
      const zipBlob = await buildPdfZip(records, mapping);
      downloadBlob(zipBlob, "umowy.zip");
      setStatus(`Wygenerowano ${records.length} plikow PDF i pobrano archiwum umowy.zip.`);
    } catch (generationError) {
      const message =
        generationError instanceof Error ? generationError.message : "Generowanie nie powiodlo sie.";
      setError(message);
      setStatus("");
    } finally {
      setIsGenerating(false);
    }
  };

  const onResetSession = (): void => {
    setWorkbookData(null);
    setSelectedSheet("");
    setHeaderRow(1);
    setRecords([]);
    setColumnNames([]);
    setMapping({});
    setError("");
    setStatus("Dane sesji zostaly usuniete z pamieci.");
  };

  const firstAgreementPreview = records[0] ? toAgreementData(records[0], mapping) : null;

  return (
    <div className="container">
      <h1>Generator umow (react-pdf)</h1>
      <p className="description">
        Dokumenty sa renderowane przez <code>@react-pdf/renderer</code> na podstawie szablonu ukladu
        umowy.
      </p>

      <section className="panel">
        <h2>Zakres wypelniania</h2>
        <ul className="instructionList">
          <li>Dane zleceniobiorcy: imie i nazwisko, adres, PESEL, dowod.</li>
          <li>Kwota brutto i kwota slownie (liczona automatycznie).</li>
          <li>Termin: data od i data do.</li>
          <li>Numer konta do wyplaty wynagrodzenia.</li>
        </ul>
      </section>

      <section className="panel">
        <h2>1) Wczytaj Excel</h2>
        <label>
          Plik Excel (.xlsx, .xls):
          <input type="file" accept=".xlsx,.xls" onChange={onExcelUpload} />
        </label>

        {workbookData && (
          <div className="grid">
            <label>
              Arkusz:
              <select value={selectedSheet} onChange={onSheetChange}>
                {workbookData.sheetNames.map((sheet) => (
                  <option key={sheet} value={sheet}>
                    {sheet}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Wiersz naglowkow:
              <input
                type="number"
                min={1}
                value={headerRow}
                onChange={onHeaderRowChange}
              />
            </label>
          </div>
        )}

        <p>Wiersze gotowe do generowania: {records.length}</p>
      </section>

      <section className="panel">
        <h2>2) Mapowanie kolumn na pola umowy</h2>
        <button type="button" onClick={onAutoMap} disabled={columnNames.length === 0}>
          Podpowiedz mapowanie automatycznie
        </button>

        <div className="mappingTable">
          <div className="mappingHeader">
            <span>Pole umowy</span>
            <span>Kolumna Excel</span>
          </div>
          {AGREEMENT_FIELDS.map((field) => (
            <div className="mappingRow" key={field.key}>
              <label className="fieldName">
                {field.label}
                {field.required ? " *" : ""}
              </label>
              <select
                value={mapping[field.key] ?? ""}
                onChange={(event) => onMappingChange(field.key, event.target.value)}
              >
                <option value="">-- wybierz --</option>
                {columnNames.map((column) => (
                  <option key={column} value={column}>
                    {column}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>

        <p>
          Zmapowane pola: {mappedCount} / {AGREEMENT_FIELDS.length}
        </p>
        {missingRequired.length > 0 ? (
          <p className="error">
            Brakuje pol wymaganych: {missingRequired.map((field) => field.label).join(", ")}.
          </p>
        ) : null}
      </section>

      {firstAgreementPreview ? (
        <section className="panel">
          <h2>3) Podglad (pierwszy rekord)</h2>
          <p>
            Kwota slownie: <strong>{firstAgreementPreview.kwotaSlownie || "(brak poprawnej kwoty)"}</strong>
          </p>
        </section>
      ) : null}

      <section className="actions">
        <button type="button" onClick={onGenerate} disabled={isGenerating}>
          {isGenerating ? "Generowanie..." : "Generuj ZIP z PDF-ami"}
        </button>
        <button type="button" onClick={onResetSession}>
          Wyczysc dane sesji
        </button>
      </section>

      {status ? <p className="status">{status}</p> : null}
      {error ? <p className="error">{error}</p> : null}
    </div>
  );
}

export default App;
