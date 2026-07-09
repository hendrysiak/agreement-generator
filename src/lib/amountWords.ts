export function kwotaSlownie(value: string): string {
  const normalized = value.replace(",", ".").replace(/\s+/g, "");
  const amount = Number(normalized);
  if (Number.isNaN(amount) || amount < 0) {
    return "";
  }

  const zl = Math.floor(amount);
  const gr = Math.round((amount - zl) * 100);
  return `${numberToWords(zl)} zlotych ${String(gr).padStart(2, "0")}/100`;
}

function numberToWords(value: number): string {
  if (value === 0) {
    return "zero";
  }

  const ones = [
    "",
    "jeden",
    "dwa",
    "trzy",
    "cztery",
    "piec",
    "szesc",
    "siedem",
    "osiem",
    "dziewiec",
  ];
  const teens = [
    "dziesiec",
    "jedenascie",
    "dwanascie",
    "trzynascie",
    "czternascie",
    "pietnascie",
    "szesnascie",
    "siedemnascie",
    "osiemnascie",
    "dziewietnascie",
  ];
  const tens = [
    "",
    "",
    "dwadziescia",
    "trzydziesci",
    "czterdziesci",
    "piecdziesiat",
    "szescdziesiat",
    "siedemdziesiat",
    "osiemdziesiat",
    "dziewiecdziesiat",
  ];
  const hundreds = [
    "",
    "sto",
    "dwiescie",
    "trzysta",
    "czterysta",
    "piecset",
    "szescset",
    "siedemset",
    "osiemset",
    "dziewiecset",
  ];

  const groups: { one: string; few: string; many: string }[] = [
    { one: "", few: "", many: "" },
    { one: "tysiac", few: "tysiace", many: "tysiecy" },
    { one: "milion", few: "miliony", many: "milionow" },
    { one: "miliard", few: "miliardy", many: "miliardow" },
  ];

  let n = value;
  let groupIndex = 0;
  const words: string[] = [];

  while (n > 0) {
    const group = n % 1000;
    if (group > 0) {
      const h = Math.floor(group / 100);
      const t = Math.floor((group % 100) / 10);
      const o = group % 10;
      const part: string[] = [];
      if (h > 0) {
        part.push(hundreds[h]);
      }
      if (t === 1) {
        part.push(teens[o]);
      } else {
        if (t > 1) {
          part.push(tens[t]);
        }
        if (o > 0) {
          part.push(ones[o]);
        }
      }

      if (groupIndex > 0) {
        part.push(selectForm(group, groups[groupIndex]));
      }
      words.unshift(part.join(" "));
    }
    n = Math.floor(n / 1000);
    groupIndex += 1;
  }

  return words.join(" ").trim();
}

function selectForm(
  value: number,
  forms: { one: string; few: string; many: string },
): string {
  const lastTwo = value % 100;
  const last = value % 10;
  if (lastTwo >= 12 && lastTwo <= 14) {
    return forms.many;
  }
  if (last === 1) {
    return forms.one;
  }
  if (last >= 2 && last <= 4) {
    return forms.few;
  }
  return forms.many;
}
