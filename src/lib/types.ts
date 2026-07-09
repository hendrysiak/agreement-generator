export type ExcelRecord = Record<string, string>;

export type Mapping = Record<string, string>;

export type AgreementFieldKey =
  | "nrUmowy"
  | "dataZawarcia"
  | "miejsceZawarcia"
  | "zleceniodawca"
  | "zleceniobiorcaImieNazwisko"
  | "zleceniobiorcaAdres"
  | "zleceniobiorcaPesel"
  | "zleceniobiorcaDowod"
  | "terminOd"
  | "terminDo"
  | "numerKonta"
  | "kwotaBrutto";

export type AgreementData = {
  nrUmowy: string;
  dataZawarcia: string;
  miejsceZawarcia: string;
  zleceniodawca: string;
  zleceniobiorcaImieNazwisko: string;
  zleceniobiorcaAdres: string;
  zleceniobiorcaPesel: string;
  zleceniobiorcaDowod: string;
  terminOd: string;
  terminDo: string;
  numerKonta: string;
  kwotaBrutto: string;
  kwotaSlownie: string;
};
