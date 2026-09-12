import type { Artifact } from "./types.ts";

function b64(bytes: Uint8Array): string {
  return Buffer.from(bytes).toString("base64");
}

function slug(title: string): string {
  return (
    title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 48) || "slieqwneb-file"
  );
}

function escapeHtml(s: string): string {
  const map: Record<string, string> = {
    "&": "&" + "amp;",
    "<": "&" + "lt;",
    ">": "&" + "gt;",
    '"': "&" + "quot;",
  };
  return s.replace(/[&<>"]/g, (ch) => map[ch] ?? ch);
}

function htmlFromMarkdownLite(title: string, body: string): string {
  const blocks = body.split(/\n{2,}/).map((block) => {
    const trimmed = block.trim();
    if (!trimmed) return "";
    if (trimmed.startsWith("# ")) return `<h1>${escapeHtml(trimmed.slice(2))}</h1>`;
    if (trimmed.startsWith("## ")) return `<h2>${escapeHtml(trimmed.slice(3))}</h2>`;
    if (trimmed.startsWith("### ")) return `<h3>${escapeHtml(trimmed.slice(4))}</h3>`;
    if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      const items = trimmed
        .split("\n")
        .map((l) => l.replace(/^[-*]\s+/, ""))
        .map((l) => `<li>${escapeHtml(l)}</li>`)
        .join("");
      return `<ul>${items}</ul>`;
    }
    return `<p>${escapeHtml(trimmed).replace(/\n/g, "<br/>")}</p>`;
  });
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8"/>
<title>${escapeHtml(title)}</title>
<style>
  body { font-family: Georgia, "Times New Roman", serif; max-width: 720px; margin: 48px auto; padding: 0 24px; color: #111; line-height: 1.55; }
  h1 { font-size: 28px; font-weight: 600; }
  h2 { font-size: 20px; margin-top: 28px; }
  h3 { font-size: 16px; }
  p { margin: 0 0 14px; }
</style>
</head>
<body>
<h1>${escapeHtml(title)}</h1>
${blocks.join("\n")}
</body>
</html>`;
}

function wrapLines(text: string, width: number): string[] {
  const out: string[] = [];
  for (const raw of text.split("\n")) {
    const line = raw.replace(/\t/g, "  ");
    if (line.length <= width) {
      out.push(line);
      continue;
    }
    const words = line.split(/\s+/);
    let current = "";
    for (const word of words) {
      const next = current ? `${current} ${word}` : word;
      if (next.length > width && current) {
        out.push(current);
        current = word;
      } else {
        current = next;
      }
    }
    if (current) out.push(current);
  }
  return out;
}

function escapePdf(text: string): string {
  return text.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
}

function encodePdfObjects(objs: string[]): Uint8Array {
  const encoder = new TextEncoder();
  const chunks: Uint8Array[] = [];
  const offsets: number[] = [0];
  let cursor = 0;
  const header = "%PDF-1.4\n";
  chunks.push(encoder.encode(header));
  cursor += header.length;

  objs.forEach((body, i) => {
    const obj = `${i + 1} 0 obj\n${body}\nendobj\n`;
    offsets.push(cursor);
    const bytes = encoder.encode(obj);
    chunks.push(bytes);
    cursor += bytes.length;
  });

  const xrefStart = cursor;
  let xref = `xref\n0 ${objs.length + 1}\n0000000000 65535 f \n`;
  for (let i = 1; i <= objs.length; i++) {
    xref += `${String(offsets[i]).padStart(10, "0")} 00000 n \n`;
  }
  const trailer = `trailer\n<< /Size ${objs.length + 1} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF`;
  chunks.push(encoder.encode(xref + trailer));
  const total = chunks.reduce((n, c) => n + c.length, 0);
  const out = new Uint8Array(total);
  let o = 0;
  for (const c of chunks) {
    out.set(c, o);
    o += c.length;
  }
  return out;
}

function buildPdf(title: string, body: string): Uint8Array {
  const lines = [title, "", ...wrapLines(body, 88)];
  const perPage = 46;
  const pages: string[][] = [];
  for (let i = 0; i < lines.length; i += perPage) pages.push(lines.slice(i, i + perPage));
  if (pages.length === 0) pages.push([title]);

  const contentStreams = pages.map((pageLines) => {
    let stream = "BT\n/F1 16 Tf\n72 740 Td\n18 TL\n";
    pageLines.forEach((line, idx) => {
      if (idx === 1) stream += "/F1 11 Tf\n14 TL\n";
      stream += `(${escapePdf(line)}) Tj T*\n`;
    });
    stream += "ET";
    return stream;
  });

  const objs: string[] = [];
  objs.push("<< /Type /Catalog /Pages 2 0 R >>");
  const pageCount = pages.length;
  const fontId = 3;
  const firstPageId = 4;
  const kids = pages.map((_, i) => `${firstPageId + i * 2} 0 R`).join(" ");
  objs.push(`<< /Type /Pages /Kids [${kids}] /Count ${pageCount} >>`);
  objs.push("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>");

  contentStreams.forEach((stream, i) => {
    const pageId = firstPageId + i * 2;
    const contentId = pageId + 1;
    objs.push(
      `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 ${fontId} 0 R >> >> /Contents ${contentId} 0 R >>`,
    );
    objs.push(`<< /Length ${Buffer.byteLength(stream, "utf8")} >>\nstream\n${stream}\nendstream`);
  });

  return encodePdfObjects(objs);
}

function csvFromContent(content: string): string {
  if (content.includes(",") && content.includes("\n")) return content;
  return content
    .split("\n")
    .map((line) => {
      if (line.includes("\t")) {
        return line
          .split("\t")
          .map((cell) => `"${cell.replace(/"/g, '""')}"`)
          .join(",");
      }
      return `"${line.replace(/"/g, '""')}"`;
    })
    .join("\n");
}

function slidesHtml(title: string, body: string): string {
  const slides = body
    .split(/\n(?=#{1,2}\s)/)
    .map((s) => s.trim())
    .filter(Boolean);
  const parts = slides.length > 1 ? slides : body.split(/\n{2,}/).filter(Boolean);
  const frames = parts.map((part, i) => {
    const lines = part.split("\n");
    const heading = lines[0]?.replace(/^#+\s*/, "") ?? title;
    const rest = lines
      .slice(1)
      .map((l) => `<p>${escapeHtml(l.replace(/^[-*]\s+/, "• "))}</p>`)
      .join("");
    return `<section class="slide" data-i="${i}"><h1>${escapeHtml(heading)}</h1>${rest}</section>`;
  });
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8"/>
<title>${escapeHtml(title)}</title>
<style>
  html,body { margin:0; background:#09090b; color:#f4f4f5; font-family: Georgia, serif; }
  .slide { min-height:100vh; padding:12vh 10vw; display:none; }
  .slide.active { display:flex; flex-direction:column; justify-content:center; }
  h1 { font-size: clamp(28px, 5vw, 56px); font-weight: 500; margin: 0 0 24px; }
  p { font-size: 22px; color:#a1a1aa; margin: 8px 0; }
  .hint { position:fixed; bottom:24px; right:24px; color:#71717a; font-family: system-ui; font-size:12px; }
</style>
</head>
<body>
${frames.join("\n")}
<div class="hint">Arrow keys to change slides</div>
<script>
  const slides = [...document.querySelectorAll(".slide")];
  let i = 0;
  function show(n){ i = (n+slides.length)%slides.length; slides.forEach((s,idx)=>s.classList.toggle("active", idx===i)); }
  show(0);
  addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight" || e.key === " ") show(i+1);
    if (e.key === "ArrowLeft") show(i-1);
  });
</script>
</body>
</html>`;
}

export function createArtifact(
  kind: Artifact["kind"],
  title: string,
  content: string,
): Artifact {
  const id = `art_${Math.random().toString(36).slice(2, 9)}`;
  if (kind === "pdf") {
    const bytes = buildPdf(title, content);
    return {
      id,
      filename: `${slug(title)}.pdf`,
      mimeType: "application/pdf",
      base64: b64(bytes),
      kind,
    };
  }
  if (kind === "word") {
    const html = htmlFromMarkdownLite(title, content);
    return {
      id,
      filename: `${slug(title)}.doc`,
      mimeType: "application/msword",
      base64: Buffer.from(html, "utf8").toString("base64"),
      kind,
    };
  }
  if (kind === "spreadsheet") {
    const csv = csvFromContent(content);
    return {
      id,
      filename: `${slug(title)}.csv`,
      mimeType: "text/csv",
      base64: Buffer.from(csv, "utf8").toString("base64"),
      kind,
    };
  }
  if (kind === "presentation") {
    const html = slidesHtml(title, content);
    return {
      id,
      filename: `${slug(title)}.html`,
      mimeType: "text/html",
      base64: Buffer.from(html, "utf8").toString("base64"),
      kind,
    };
  }
  return {
    id,
    filename: `${slug(title)}.txt`,
    mimeType: "text/plain",
    base64: Buffer.from(content, "utf8").toString("base64"),
    kind: "text",
  };
}
