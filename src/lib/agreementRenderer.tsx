import React from "react";
import { Document, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import type { AgreementData } from "./types";

const styles = StyleSheet.create({
  page: {
    paddingTop: 32,
    paddingHorizontal: 28,
    paddingBottom: 28,
    fontFamily: "Helvetica",
    fontSize: 10,
    lineHeight: 1.35,
  },
  topRight: {
    textAlign: "right",
    marginBottom: 4,
  },
  helper: {
    textAlign: "right",
    fontSize: 8,
    marginBottom: 12,
  },
  centered: {
    textAlign: "center",
  },
  title: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 4,
  },
  agreementNo: {
    fontSize: 9,
    marginBottom: 12,
  },
  columns: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 10,
  },
  column: {
    width: "50%",
  },
  sectionHeader: {
    fontSize: 9,
    fontWeight: "bold",
    marginBottom: 4,
  },
  line: {
    marginBottom: 2,
  },
  paragraph: {
    marginBottom: 8,
    textAlign: "justify",
  },
  signatures: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 18,
    marginBottom: 10,
  },
  signatureBox: {
    width: "45%",
    alignItems: "center",
  },
  signatureLine: {
    borderTopWidth: 1,
    borderTopColor: "#000",
    width: "100%",
    marginBottom: 4,
  },
  checklistTitle: {
    marginTop: 10,
    marginBottom: 4,
  },
  checklistItem: {
    fontSize: 8,
    marginBottom: 3,
  },
  tiny: {
    fontSize: 8,
  },
  rodoHeader: {
    fontWeight: "bold",
    marginTop: 6,
    marginBottom: 4,
  },
  rodoPoint: {
    marginBottom: 4,
    fontSize: 8,
    textAlign: "justify",
  },
  accountTitle: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 12,
    marginBottom: 8,
  },
  amountLine: {
    marginBottom: 6,
  },
  dotted: {
    marginTop: 6,
    marginBottom: 6,
    fontSize: 9,
  },
  monthHeader: {
    marginTop: 8,
    marginBottom: 4,
    fontWeight: "bold",
  },
  daysRow: {
    fontSize: 8,
    marginBottom: 2,
  },
});

type Props = {
  agreement: AgreementData;
};

function withFallback(value: string, fallback: string): string {
  const normalized = value.trim();
  return normalized.length > 0 ? normalized : fallback;
}

function bruttoWithCurrency(value: string): string {
  const brutto = withFallback(value, "6020,00");
  return brutto.includes("zł") ? brutto : `${brutto} zł`;
}

export function AgreementDocument({ agreement }: Props): React.JSX.Element {
  const cityDate = `${withFallback(agreement.miejsceZawarcia, "Kuźnica")}, ${withFallback(
    agreement.dataZawarcia,
    "27.06.2026",
  )}`;

  return (
    <Document
      title={`Umowa zlecenie ${agreement.nrUmowy || ""}`}
      author="agreement-generator"
      subject="Umowa zlecenie"
    >
      <Page size="A4" style={styles.page}>
        <Text style={styles.topRight}>{cityDate}</Text>
        <Text style={styles.helper}>(miejscowość), (data)</Text>

        <Text style={[styles.centered, styles.title]}>UMOWA ZLECENIE</Text>
        <Text style={[styles.centered, styles.agreementNo]}>
          nr {withFallback(agreement.nrUmowy, "UZ/000/2026")}
        </Text>

        <View style={styles.columns}>
          <View style={styles.column}>
            <Text style={styles.sectionHeader}>ZLECENIODAWCA</Text>
            <Text style={styles.line}>
              {withFallback(agreement.zleceniodawca, "Komenda Choragwi Slaskiej ZHP")}
            </Text>
            <Text style={styles.line}>im. Harcerzy Wrzesnia 1939</Text>
            <Text style={styles.line}>al. Harcerska 3b, 41-500 Chorzow</Text>
            <Text style={styles.line}>reprezentowana przez:</Text>
            <Text style={styles.line}>a) Marcina Rozyckiego - komendanta</Text>
            <Text style={styles.line}>b) Krystiana Laszewskiego - skarbnika</Text>
          </View>

          <View style={styles.column}>
            <Text style={styles.sectionHeader}>ZLECENIOBIORCA</Text>
            <Text style={styles.line}>
              {withFallback(agreement.zleceniobiorcaImieNazwisko, "Jan Kowalski")}
            </Text>
            <Text style={styles.tiny}>(nazwisko i imie)</Text>
            <Text style={styles.line}>
              {withFallback(agreement.zleceniobiorcaAdres, "ul. Przykladowa 1, 00-000 Miasto")}
            </Text>
            <Text style={styles.tiny}>(adres)</Text>
            <Text style={styles.line}>
              PESEL {withFallback(agreement.zleceniobiorcaPesel, "00000000000")}
            </Text>
            <Text style={styles.line}>
              Dowod: {withFallback(agreement.zleceniobiorcaDowod, "brak")}
            </Text>
          </View>
        </View>

        <Text style={styles.paragraph}>
          Zleceniodawca zleca, a Zleceniobiorca zobowiazuje sie do wykonania nastepujacych czynnosci:
          koordynowanie programu calego zgrupowania, sprawowanie nadzoru nad przestrzeganiem zasad BHP
          i PPOZ przez kadre i uczestnikow, opieka i nadzor nad uczestnikami obozu.
        </Text>

        <Text style={styles.paragraph}>
          Zlecenie wykonane bedzie w terminie od {withFallback(agreement.terminOd, "26.06.2026 r.")} do{" "}
          {withFallback(agreement.terminDo, "11.07.2026 r.")}.
        </Text>

        <Text style={styles.paragraph}>
          Za wykonanie zlecenia zleceniobiorca otrzyma wynagrodzenie umowne w kwocie brutto{" "}
          {bruttoWithCurrency(agreement.kwotaBrutto)} (slownie:{" "}
          {withFallback(agreement.kwotaSlownie, "szesc tysiecy dwadziescia zlotych")}).
        </Text>

        <Text style={styles.paragraph}>
          Wynagrodzenie wyplacone zostanie w formie przelewu po przyjeciu wykonanych czynnosci.
          W sprawach nieuregulowanych umowa stosuje sie przepisy Kodeksu cywilnego i innych
          obowiazujacych aktow prawnych.
        </Text>

        <Text style={styles.paragraph}>
          Umowa zostala spisana w dwoch jednobrzmiacych egzemplarzach, po jednym dla kazdej ze stron.
        </Text>

        <View style={styles.signatures}>
          <View style={styles.signatureBox}>
            <View style={styles.signatureLine} />
            <Text style={styles.tiny}>Zleceniobiorca</Text>
          </View>
          <View style={styles.signatureBox}>
            <View style={styles.signatureLine} />
            <Text style={styles.tiny}>Zleceniodawca</Text>
          </View>
        </View>

        <Text style={styles.checklistTitle}>Oswiadczam ze:</Text>
        <Text style={styles.checklistItem}>
          □ jestem zatrudniony/a na podstawie umowy o prace z wynagrodzeniem:
        </Text>
        <Text style={styles.checklistItem}>
          □ przekraczajacym lub rownym 4806,00 zl brutto miesiecznie
        </Text>
        <Text style={styles.checklistItem}>□ nieprzekraczajacym 4806,00 zl brutto miesiecznie</Text>
        <Text style={styles.checklistItem}>
          □ wykonuje w innych zakladach pracy umowe cywilnoprawna (zlecenie, o dzielo)
        </Text>
        <Text style={styles.checklistItem}>
          □ jestem uczniem/studentem, ktory nie ukonczyl 26 r.z.
        </Text>
        <Text style={styles.checklistItem}>
          □ nie jestem objety ubezpieczeniem spolecznym z innego tytulu
        </Text>
        <Text style={styles.checklistItem}>□ chce/nie chce otrzymac PIT-11 droga mailowa.</Text>
      </Page>

      <Page size="A4" style={styles.page}>
        <Text style={styles.line}>
          Imie i nazwisko wspolpracownika:{" "}
          {withFallback(agreement.zleceniobiorcaImieNazwisko, "Jan Kowalski")}
        </Text>
        <Text style={styles.rodoHeader}>
          Obowiazek informacyjny w zwiazku z przetwarzaniem danych osobowych - wspolpracownik
          (Kodeks Cywilny)
        </Text>
        <Text style={styles.rodoHeader}>I. Czesc ogolna</Text>
        <Text style={styles.rodoPoint}>
          1. Administratorem danych osobowych jest Choragiew Slaska ZHP z siedziba w Chorzowie.
          Kontakt: aleja Harcerska 3B, 41-500 Chorzow, biuro@slaska.zhp.pl.
        </Text>
        <Text style={styles.rodoPoint}>
          2. Administrator wyznaczyl Inspektora Ochrony Danych. Kontakt: rodo@zhp.pl.
        </Text>
        <Text style={styles.rodoPoint}>
          3. Dane osobowe sa przetwarzane na podstawie rozporzadzenia Parlamentu Europejskiego i Rady
          (UE) 2016/679 (RODO).
        </Text>
        <Text style={styles.rodoPoint}>4. Dane osobowe nie pochodza od stron trzecich.</Text>
        <Text style={styles.rodoPoint}>
          5. Administrator moze przekazywac dane do panstwa trzeciego lub organizacji
          miedzynarodowej w zwiazku z publikacja wizerunku na portalach spolecznosciowych.
        </Text>
        <Text style={styles.rodoPoint}>
          6. Przysluguje prawo dostepu do danych, sprostowania, usuniecia, ograniczenia
          przetwarzania, wniesienia sprzeciwu, przenoszenia danych, cofniecia zgody oraz wniesienia
          skargi do Prezesa UODO.
        </Text>
        <Text style={styles.rodoPoint}>7. Administrator nie przewiduje zautomatyzowanego podejmowania decyzji.</Text>

        <Text style={styles.rodoHeader}>II. Dotyczy zawarcia umowy cywilnoprawnej</Text>
        <Text style={styles.rodoPoint}>
          1. Dane osobowe sa przetwarzane na podstawie ustawy o rachunkowosci oraz Kodeksu cywilnego.
        </Text>
        <Text style={styles.rodoPoint}>
          2. Dane sa przetwarzane w celu zawarcia i realizacji umowy, wyplaty wynagrodzenia,
          wypelnienia obowiazkow prawnych, publikacji wizerunku (za zgoda) oraz dochodzenia roszczen.
        </Text>
        <Text style={styles.rodoPoint}>
          3. Dane moga byc przekazywane m.in. do ZUS, Urzedu Skarbowego, banku oraz podmiotow
          przetwarzajacych na podstawie umow powierzenia.
        </Text>
        <Text style={styles.rodoPoint}>
          4. Podanie danych wymaganych przepisami jest konieczne do realizacji umowy.
        </Text>

        <Text style={[styles.rodoPoint, { marginTop: 10 }]}>
          ☐ wyrazam zgode na utrwalanie i publikacje mojego wizerunku na stronach internetowych oraz
          portalach spolecznosciowych Administratora.
        </Text>
        <Text style={[styles.centered, { marginTop: 24 }]}>
          ....................................                         ....................................
        </Text>
        <Text style={[styles.centered, styles.tiny]}>/data/                                         /podpis/</Text>
      </Page>

      <Page size="A4" style={styles.page}>
        <View style={styles.columns}>
          <View style={styles.column}>
            <Text style={styles.sectionHeader}>ZLECENIODAWCA</Text>
            <Text style={styles.line}>
              {withFallback(agreement.zleceniodawca, "Komenda Choragwi Slaskiej ZHP")}
            </Text>
            <Text style={styles.line}>im. Harcerzy Wrzesnia 1939</Text>
            <Text style={styles.line}>al. Harcerska 3b, 41-500 Chorzow</Text>
          </View>
          <View style={styles.column}>
            <Text style={styles.sectionHeader}>ZLECENIOBIORCA</Text>
            <Text style={styles.line}>
              {withFallback(agreement.zleceniobiorcaImieNazwisko, "Jan Kowalski")}
            </Text>
            <Text style={styles.tiny}>(nazwisko i imie)</Text>
            <Text style={styles.line}>
              {withFallback(agreement.zleceniobiorcaAdres, "ul. Przykladowa 1, 00-000 Miasto")}
            </Text>
            <Text style={styles.tiny}>(adres)</Text>
            <Text style={styles.line}>
              PESEL {withFallback(agreement.zleceniobiorcaPesel, "00000000000")}
            </Text>
          </View>
        </View>

        <Text style={styles.topRight}>{withFallback(agreement.dataZawarcia, "11.07.2026 r.")}</Text>
        <Text style={styles.helper}>(miejscowosc), (data)</Text>
        <Text style={styles.accountTitle}>RACHUNEK DO UMOWY CYWILNOPRAWNEJ</Text>
        <Text style={styles.amountLine}>Rachunek dla Komendy Hufca ZHP Ruda Slaska</Text>
        <Text style={styles.amountLine}>
          Wykonane prace: koordynowanie programu calego zgrupowania, sprawowanie nadzoru nad
          przestrzeganiem zasad BHP i PPOZ przez kadre i uczestnikow, opieka i nadzor nad
          uczestnikami obozu.
        </Text>
        <Text style={styles.amountLine}>KWOTA BRUTTO: {bruttoWithCurrency(agreement.kwotaBrutto)}</Text>
        <Text style={styles.amountLine}>SKLADKI ZUS UBEZPIECZONEGO EMERYTALNO-RENTOWA: 0,00 zl</Text>
        <Text style={styles.amountLine}>SKLADKA NA UBEZP. ZDROWOTNE: 541,80 zl</Text>
        <Text style={styles.amountLine}>KOSZTY UZYSKANIA PRZYCHODU: 1204,00 zl</Text>
        <Text style={styles.amountLine}>PODATEK DO ZAPLATY: 578,00 zl</Text>
        <Text style={styles.amountLine}>DO WYPLATY: 4900,20 zl</Text>
        <Text style={styles.amountLine}>
          * Przelew prosze wykonac na nr konta: {withFallback(agreement.numerKonta, "00 0000 0000 0000 0000 0000 0000")}
        </Text>
        <Text style={styles.dotted}>................................................ (podpis zleceniobiorcy)</Text>
        <Text style={styles.tiny}>
          Rachunek sprawdzono pod wzgledem merytorycznym / formalnym i rachunkowym / zatwierdzono do
          wyplaty
        </Text>
      </Page>

      <Page size="A4" style={styles.page}>
        <Text>
          {withFallback(agreement.zleceniobiorcaImieNazwisko, "Jan Kowalski")} (imie i nazwisko
          zleceniobiorcy)
        </Text>
        <Text style={[styles.centered, { marginTop: 10, marginBottom: 8, fontWeight: "bold" }]}>
          Ewidencja czasu wykonywania zlecenia
        </Text>
        <Text style={styles.monthHeader}>Miesiac: czerwiec rok: 2026</Text>
        <Text style={styles.daysRow}>1 2 3 4 5 6 7 8 9 10 11 12 13 14 15</Text>
        <Text style={styles.daysRow}>.................................................</Text>
        <Text style={styles.daysRow}>16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31</Text>
        <Text style={styles.daysRow}>.................................................</Text>
        <Text style={styles.monthHeader}>Miesiac: lipiec rok: 2026</Text>
        <Text style={styles.daysRow}>1 2 3 4 5 6 7 8 9 10 11 12 13 14 15</Text>
        <Text style={styles.daysRow}>.................................................</Text>
        <Text style={styles.daysRow}>16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31</Text>
        <Text style={styles.daysRow}>.................................................</Text>
        <Text style={{ marginTop: 24 }}>Lacznie: ............................</Text>
        <Text style={{ marginTop: 24 }}>................................................</Text>
        <Text style={styles.tiny}>(podpis zleceniobiorcy)</Text>
      </Page>
    </Document>
  );
}
