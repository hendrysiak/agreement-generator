import { PDFDocument, PDFForm, PDFTextField } from "pdf-lib";
import type { ExcelRecord, Mapping } from "./types";

export const HARDCODED_TEMPLATE_PATH = "/template.pdf";

export async function loadTemplateBytes(): Promise<Uint8Array> {
  const response = await fetch(HARDCODED_TEMPLATE_PATH, { cache: "no-store" });
  if (!response.ok) {
    throw new Error("Nie udało się wczytać stałego szablonu PDF.");
  }

  const buffer = await response.arrayBuffer();
  return new Uint8Array(buffer);
}

export async function getTemplateFieldNames(
  templateBytes: Uint8Array,
): Promise<string[]> {
  const pdfDoc = await PDFDocument.load(templateBytes);
  const form = pdfDoc.getForm();
  return form.getFields().map((field) => field.getName()).sort((a, b) => a.localeCompare(b));
}

function setFieldValue(form: PDFForm, fieldName: string, value: string): void {
  const field = form.getFieldMaybe(fieldName);
  if (!field) {
    return;
  }

  // Na ten moment obsługujemy wyłącznie pola tekstowe.
  if (field instanceof PDFTextField) {
    field.setText(value);
  }
}

export async function fillTemplateForRecord(
  templateBytes: Uint8Array,
  mapping: Mapping,
  record: ExcelRecord,
): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.load(templateBytes);
  const form = pdfDoc.getForm();

  Object.entries(mapping).forEach(([pdfFieldName, excelColumn]) => {
    if (!excelColumn) {
      return;
    }

    const value = record[excelColumn] ?? "";
    setFieldValue(form, pdfFieldName, value);
  });

  return pdfDoc.save();
}
