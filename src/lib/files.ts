import JSZip from "jszip";
import type { AttachedFile } from "@/lib/agent/types";

export const MAX_FILE_BYTES = 50 * 1024 * 1024;
const MAX_TEXT_CHARS = 14_000;
const MAX_FILES = 10;

function clip(text: string, max = MAX_TEXT_CHARS): string {
  const trimmed = text.replace(/\u0000/g, "").trim();
  if (trimmed.length <= max) return trimmed;
  return `${trimmed.slice(0, max)}\n\n[truncated]`;
}

function decodeXml(xml: string): string {
  return xml
    .replace(/<w:p[^>]*>/g, "\n")
    .replace(/<a:t[^>]*>/g, "")
    .replace(/<\/a:t>/g, "")
    .replace(/<t[^>]*>/g, "")
    .replace(/<\/t>/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\u0026amp;/g, "&")
    .replace(/\u0026lt;/g, "<")
    .replace(/\u0026gt;/g, ">")
    .replace(/\u0026quot;/g, '"')
    .replace(/\u0026#39;/g, "'")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[ \t]{2,}/g, " ")
    .trim();
}

async function extractZipText(file: File, paths: string[]): Promise<string> {
  const zip = await JSZip.loadAsync(await file.arrayBuffer());
  const chunks: string[] = [];
  for (const path of paths) {
    const entry = zip.file(path);
    if (entry) chunks.push(await entry.async("string"));
  }
  if (chunks.length === 0) {
    const xmlFiles = Object.keys(zip.files).filter((n) => n.endsWith(".xml"));
    for (const name of xmlFiles.slice(0, 12)) {
      const entry = zip.file(name);
      if (entry) chunks.push(await entry.async("string"));
    }
  }
  return decodeXml(chunks.join("\n"));
}

function extractPdfText(buffer: ArrayBuffer): string {
  const raw = new TextDecoder("latin1").decode(buffer);
  const parts: string[] = [];
  const paren = /\((?:\\.|[^\\)]){2,}\)/g;
  let match: RegExpExecArray | null;
  while ((match = paren.exec(raw))) {
    const inner = match[0].slice(1, -1);
    const decoded = inner
      .replace(/\\n/g, "\n")
      .replace(/\\r/g, "")
      .replace(/\\t/g, "\t")
      .replace(/\\\(/g, "(")
      .replace(/\\\)/g, ")")
      .replace(/\\\\/g, "\\");
    if (/[A-Za-z]{3,}/.test(decoded)) parts.push(decoded);
  }
  const streams = raw.match(/BT[\s\S]{0,4000}?ET/g) ?? [];
  for (const stream of streams) {
    const tj = stream.match(/\((?:\\.|[^\\)])+\)\s*Tj/g) ?? [];
    for (const token of tj) parts.push(token.slice(1, token.lastIndexOf(")")));
  }
  return clip(parts.join(" "));
}

export async function extractAttachedFile(file: File): Promise<AttachedFile> {
  if (file.size > MAX_FILE_BYTES) {
    throw new Error(`${file.name} is larger than 50 MB`);
  }
  const name = file.name;
  const mimeType = file.type || "application/octet-stream";
  const lower = name.toLowerCase();

  if (
    mimeType.startsWith("text/") ||
    lower.endsWith(".md") ||
    lower.endsWith(".json") ||
    lower.endsWith(".csv") ||
    lower.endsWith(".html") ||
    lower.endsWith(".xml") ||
    lower.endsWith(".js") ||
    lower.endsWith(".ts") ||
    lower.endsWith(".tsx") ||
    lower.endsWith(".jsx") ||
    lower.endsWith(".css") ||
    lower.endsWith(".sql") ||
    lower.endsWith(".py") ||
    lower.endsWith(".java") ||
    lower.endsWith(".go") ||
    lower.endsWith(".rs") ||
    lower.endsWith(".sh") ||
    lower.endsWith(".yaml") ||
    lower.endsWith(".yml")
  ) {
    return { name, mimeType, size: file.size, text: clip(await file.text()) };
  }

  if (lower.endsWith(".docx")) {
    const text = await extractZipText(file, ["word/document.xml"]);
    return { name, mimeType, size: file.size, text: clip(text) || "[empty document]" };
  }
  if (lower.endsWith(".pptx")) {
    const zip = await JSZip.loadAsync(await file.arrayBuffer());
    const slides = Object.keys(zip.files)
      .filter((n) => /ppt\/slides\/slide\d+\.xml$/.test(n))
      .sort();
    const chunks: string[] = [];
    for (const path of slides) {
      const entry = zip.file(path);
      if (entry) chunks.push(decodeXml(await entry.async("string")));
    }
    return { name, mimeType, size: file.size, text: clip(chunks.join("\n\n")) };
  }
  if (lower.endsWith(".xlsx") || lower.endsWith(".xls")) {
    const text = await extractZipText(file, ["xl/sharedStrings.xml", "xl/worksheets/sheet1.xml"]);
    return { name, mimeType, size: file.size, text: clip(text) };
  }
  if (lower.endsWith(".pdf") || mimeType === "application/pdf") {
    const text = extractPdfText(await file.arrayBuffer());
    return { name, mimeType, size: file.size, text: text || "[PDF uploaded; no local text extractor found]" };
  }

  return {
    name,
    mimeType,
    size: file.size,
    text: `[binary file ${name}; ${mimeType}; uploaded to Puter for model access]`,
  };
}

export async function extractAttachedFiles(files: File[]): Promise<AttachedFile[]> {
  return Promise.all(files.slice(0, MAX_FILES).map(extractAttachedFile));
}

export const FILE_ACCEPT = "*/*";
