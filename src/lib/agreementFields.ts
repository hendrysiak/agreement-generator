import type { AgreementFieldKey } from "./types";

export const AGREEMENT_FIELDS: { key: AgreementFieldKey; label: string; required?: boolean }[] = [
  { key: "nrUmowy", label: "Numer umowy", required: true },
  { key: "dataZawarcia", label: "Data zawarcia umowy", required: true },
  { key: "miejsceZawarcia", label: "Miejsce zawarcia umowy", required: true },
  { key: "zleceniodawca", label: "Zleceniodawca", required: true },
  { key: "zleceniobiorcaImieNazwisko", label: "Zleceniobiorca - imię i nazwisko", required: true },
  { key: "zleceniobiorcaAdres", label: "Zleceniobiorca - adres", required: true },
  { key: "zleceniobiorcaPesel", label: "Zleceniobiorca - PESEL", required: true },
  { key: "zleceniobiorcaDowod", label: "Zleceniobiorca - dowód osobisty" },
  { key: "terminOd", label: "Termin realizacji od", required: true },
  { key: "terminDo", label: "Termin realizacji do", required: true },
  { key: "numerKonta", label: "Numer konta", required: true },
  { key: "kwotaBrutto", label: "Kwota brutto (PLN)", required: true },
];

