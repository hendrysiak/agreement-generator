import { AGREEMENT_FIELDS } from "./agreementFields";
import { kwotaSlownie } from "./amountWords";
import type { AgreementData, AgreementFieldKey, ExcelRecord, Mapping } from "./types";

function normalize(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function tokens(value: string): string[] {
  return normalize(value)
    .split(" ")
    .filter((token) => token.length > 1);
}

export function suggestAgreementMapping(columns: string[]): Mapping {
  const result: Mapping = {};
  AGREEMENT_FIELDS.forEach((field) => {
    result[field.key] = suggestColumn(field.key, field.label, columns);
  });
  return result;
}

function suggestColumn(fieldKey: AgreementFieldKey, fieldLabel: string, columns: string[]): string {
  const aliases: Record<AgreementFieldKey, string[]> = {
    nrUmowy: ["nr umowy", "numer umowy", "umowa"],
    dataZawarcia: ["data umowy", "data zawarcia"],
    miejsceZawarcia: ["miejsce", "miasto"],
    zleceniodawca: ["zleceniodawca", "firma"],
    zleceniobiorcaImieNazwisko: ["imie nazwisko", "zleceniobiorca", "nazwisko"],
    zleceniobiorcaAdres: ["adres", "ulica", "miasto kod"],
    zleceniobiorcaPesel: ["pesel"],
    zleceniobiorcaDowod: ["dowod", "id"],
    terminOd: ["od", "data od", "termin od"],
    terminDo: ["do", "data do", "termin do"],
    numerKonta: ["konto", "nr konta", "iban"],
    kwotaBrutto: ["kwota", "brutto", "wynagrodzenie"],
  };

  const target = [...tokens(fieldLabel), ...aliases[fieldKey].flatMap(tokens)];
  const targetSet = new Set(target);
  let best = "";
  let bestScore = -1;

  for (const column of columns) {
    const c = normalize(column);
    const colTokens = tokens(column);
    let score = 0;
    for (const token of colTokens) {
      if (targetSet.has(token)) {
        score += 2;
      }
    }
    for (const token of targetSet) {
      if (c.includes(token)) {
        score += 1;
      }
    }
    if (score > bestScore) {
      bestScore = score;
      best = column;
    }
  }

  return bestScore > 0 ? best : "";
}

function getMappedValue(record: ExcelRecord, mapping: Mapping, key: AgreementFieldKey): string {
  const column = mapping[key];
  if (!column) {
    return "";
  }
  return record[column] ?? "";
}

export function toAgreementData(record: ExcelRecord, mapping: Mapping): AgreementData {
  const kwotaBrutto = getMappedValue(record, mapping, "kwotaBrutto");
  return {
    nrUmowy: getMappedValue(record, mapping, "nrUmowy"),
    dataZawarcia: getMappedValue(record, mapping, "dataZawarcia"),
    miejsceZawarcia: getMappedValue(record, mapping, "miejsceZawarcia"),
    zleceniodawca: getMappedValue(record, mapping, "zleceniodawca"),
    zleceniobiorcaImieNazwisko: getMappedValue(record, mapping, "zleceniobiorcaImieNazwisko"),
    zleceniobiorcaAdres: getMappedValue(record, mapping, "zleceniobiorcaAdres"),
    zleceniobiorcaPesel: getMappedValue(record, mapping, "zleceniobiorcaPesel"),
    zleceniobiorcaDowod: getMappedValue(record, mapping, "zleceniobiorcaDowod"),
    terminOd: getMappedValue(record, mapping, "terminOd"),
    terminDo: getMappedValue(record, mapping, "terminDo"),
    numerKonta: getMappedValue(record, mapping, "numerKonta"),
    kwotaBrutto,
    kwotaSlownie: kwotaSlownie(kwotaBrutto),
  };
}

