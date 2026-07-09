import * as XLSX from "xlsx";
import type { ExcelRecord } from "./types";

export type ParsedWorkbook = {
  sheetNames: string[];
  workbook: XLSX.WorkBook;
};

export function parseWorkbook(file: File): Promise<ParsedWorkbook> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      try {
        const data = new Uint8Array(reader.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });

        resolve({
          workbook,
          sheetNames: workbook.SheetNames,
        });
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = () => reject(reader.error);
    reader.readAsArrayBuffer(file);
  });
}

export function parseSheetRows(
  workbook: XLSX.WorkBook,
  sheetName: string,
  headerRow: number,
): ExcelRecord[] {
  const worksheet = workbook.Sheets[sheetName];

  if (!worksheet) {
    throw new Error(`Nie znaleziono arkusza "${sheetName}".`);
  }

  const rows = XLSX.utils.sheet_to_json<(string | number | null)[]>(worksheet, {
    header: 1,
    blankrows: false,
    defval: "",
  });

  if (rows.length < headerRow) {
    throw new Error("Wiersz nagłówka jest poza zakresem danych.");
  }

  const headerCells = rows[headerRow - 1] ?? [];
  const headers = headerCells.map((value, index) => {
    const raw = String(value ?? "").trim();
    return raw || `column_${index + 1}`;
  });

  const dataRows = rows.slice(headerRow);
  const records: ExcelRecord[] = [];

  for (const row of dataRows) {
    const record: ExcelRecord = {};
    let hasValue = false;

    for (let i = 0; i < headers.length; i += 1) {
      const value = row[i];
      const valueString = value == null ? "" : String(value);
      record[headers[i]] = valueString;
      if (valueString.trim().length > 0) {
        hasValue = true;
      }
    }

    if (hasValue) {
      records.push(record);
    }
  }

  return records;
}

export function getColumnNames(records: ExcelRecord[]): string[] {
  if (records.length === 0) {
    return [];
  }

  return Object.keys(records[0]);
}
