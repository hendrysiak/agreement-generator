import JSZip from "jszip";
import { pdf } from "@react-pdf/renderer";
import { AgreementDocument } from "./agreementRenderer";
import { toAgreementData } from "./agreementMapper";
import type { ExcelRecord, Mapping } from "./types";

function sanitizeFileName(value: string): string {
  return value.replace(/[\\/:*?"<>|]/g, "_").trim();
}

export async function buildPdfZip(
  records: ExcelRecord[],
  mapping: Mapping,
): Promise<Blob> {
  const zip = new JSZip();

  for (let i = 0; i < records.length; i += 1) {
    const record = records[i];
    const agreement = toAgreementData(record, mapping);
    const blob = await pdf(AgreementDocument({ agreement })).toBlob();
    const pdfBytes = new Uint8Array(await blob.arrayBuffer());
    const candidateName =
      agreement.nrUmowy ||
      agreement.zleceniobiorcaImieNazwisko ||
      `umowa_${i + 1}`;

    const fileName = `${sanitizeFileName(candidateName)}.pdf`;
    zip.file(fileName, pdfBytes);
  }

  return zip.generateAsync({ type: "blob" });
}
