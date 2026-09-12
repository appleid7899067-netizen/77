import { a as isConnectorPending, i as catalogById, o as isLoginRequired, t as CONNECTORS } from "./catalog-BgtA8weR.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/runtime.server-BrmrTJ8k.js
var MESSAGE_RULES = [
	{
		needles: ["not_connected", "failed_precondition"],
		kind: "not_connected",
		message: "Connect this connector in Grok to load your data."
	},
	{
		needles: ["scope_denied"],
		kind: "scope_denied",
		message: "This view isn't available — the app requested a tool outside its grant."
	},
	{
		needles: ["access_denied"],
		kind: "access_denied",
		message: "You don't have access to this data."
	}
];
function matchMessageRule(raw) {
	return MESSAGE_RULES.find((rule) => rule.needles.some((needle) => raw.includes(needle)));
}
function classifyCallToolError(result) {
	if (result.ok) return null;
	const detail = result.errorMessage || void 0;
	const raw = (result.errorMessage ?? "").toLowerCase();
	if (isConnectorPending(result)) return {
		kind: "pending",
		message: "Connecting to your data…",
		detail
	};
	if (raw.includes("missing_connector_token")) return {
		kind: "error",
		message: "Open this app from Grok to load your data.",
		detail
	};
	if (isLoginRequired(result)) return {
		kind: "login",
		message: "Continue with Grok to load your data.",
		detail
	};
	const rule = matchMessageRule(raw);
	if (rule) return {
		kind: rule.kind,
		message: rule.message,
		detail
	};
	return {
		kind: "error",
		message: detail ?? "Something went wrong. Try again.",
		detail
	};
}
function b64(bytes) {
	return Buffer.from(bytes).toString("base64");
}
function slug(title) {
	return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 48) || "lumen-file";
}
function escapeHtml(s) {
	const map = {
		"&": "&amp;",
		"<": "&lt;",
		">": "&gt;",
		"\"": "&quot;"
	};
	return s.replace(/[&<>"]/g, (ch) => map[ch] ?? ch);
}
function htmlFromMarkdownLite(title, body) {
	const blocks = body.split(/\n{2,}/).map((block) => {
		const trimmed = block.trim();
		if (!trimmed) return "";
		if (trimmed.startsWith("# ")) return `<h1>${escapeHtml(trimmed.slice(2))}</h1>`;
		if (trimmed.startsWith("## ")) return `<h2>${escapeHtml(trimmed.slice(3))}</h2>`;
		if (trimmed.startsWith("### ")) return `<h3>${escapeHtml(trimmed.slice(4))}</h3>`;
		if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) return `<ul>${trimmed.split("\n").map((l) => l.replace(/^[-*]\s+/, "")).map((l) => `<li>${escapeHtml(l)}</li>`).join("")}</ul>`;
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
function wrapLines(text, width) {
	const out = [];
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
			} else current = next;
		}
		if (current) out.push(current);
	}
	return out;
}
function escapePdf(text) {
	return text.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
}
function encodePdfObjects(objs) {
	const encoder = new TextEncoder();
	const chunks = [];
	const offsets = [0];
	let cursor = 0;
	chunks.push(encoder.encode("%PDF-1.4\n"));
	cursor += 9;
	objs.forEach((body, i) => {
		const obj = `${i + 1} 0 obj\n${body}\nendobj\n`;
		offsets.push(cursor);
		const bytes = encoder.encode(obj);
		chunks.push(bytes);
		cursor += bytes.length;
	});
	const xrefStart = cursor;
	let xref = `xref\n0 ${objs.length + 1}\n0000000000 65535 f \n`;
	for (let i = 1; i <= objs.length; i++) xref += `${String(offsets[i]).padStart(10, "0")} 00000 n \n`;
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
function buildPdf(title, body) {
	const lines = [
		title,
		"",
		...wrapLines(body, 88)
	];
	const perPage = 46;
	const pages = [];
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
	const objs = [];
	objs.push("<< /Type /Catalog /Pages 2 0 R >>");
	const pageCount = pages.length;
	const fontId = 3;
	const firstPageId = 4;
	const kids = pages.map((_, i) => `${firstPageId + i * 2} 0 R`).join(" ");
	objs.push(`<< /Type /Pages /Kids [${kids}] /Count ${pageCount} >>`);
	objs.push("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>");
	contentStreams.forEach((stream, i) => {
		const contentId = firstPageId + i * 2 + 1;
		objs.push(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 ${fontId} 0 R >> >> /Contents ${contentId} 0 R >>`);
		objs.push(`<< /Length ${Buffer.byteLength(stream, "utf8")} >>\nstream\n${stream}\nendstream`);
	});
	return encodePdfObjects(objs);
}
function csvFromContent(content) {
	if (content.includes(",") && content.includes("\n")) return content;
	return content.split("\n").map((line) => {
		if (line.includes("	")) return line.split("	").map((cell) => `"${cell.replace(/"/g, "\"\"")}"`).join(",");
		return `"${line.replace(/"/g, "\"\"")}"`;
	}).join("\n");
}
function slidesHtml(title, body) {
	const slides = body.split(/\n(?=#{1,2}\s)/).map((s) => s.trim()).filter(Boolean);
	const frames = (slides.length > 1 ? slides : body.split(/\n{2,}/).filter(Boolean)).map((part, i) => {
		const lines = part.split("\n");
		const heading = lines[0]?.replace(/^#+\s*/, "") ?? title;
		const rest = lines.slice(1).map((l) => `<p>${escapeHtml(l.replace(/^[-*]\s+/, "• "))}</p>`).join("");
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
<\/script>
</body>
</html>`;
}
function createArtifact(kind, title, content) {
	const id = `art_${Math.random().toString(36).slice(2, 9)}`;
	if (kind === "pdf") {
		const bytes = buildPdf(title, content);
		return {
			id,
			filename: `${slug(title)}.pdf`,
			mimeType: "application/pdf",
			base64: b64(bytes),
			kind
		};
	}
	if (kind === "word") {
		const html = htmlFromMarkdownLite(title, content);
		return {
			id,
			filename: `${slug(title)}.doc`,
			mimeType: "application/msword",
			base64: Buffer.from(html, "utf8").toString("base64"),
			kind
		};
	}
	if (kind === "spreadsheet") {
		const csv = csvFromContent(content);
		return {
			id,
			filename: `${slug(title)}.csv`,
			mimeType: "text/csv",
			base64: Buffer.from(csv, "utf8").toString("base64"),
			kind
		};
	}
	if (kind === "presentation") {
		const html = slidesHtml(title, content);
		return {
			id,
			filename: `${slug(title)}.html`,
			mimeType: "text/html",
			base64: Buffer.from(html, "utf8").toString("base64"),
			kind
		};
	}
	return {
		id,
		filename: `${slug(title)}.txt`,
		mimeType: "text/plain",
		base64: Buffer.from(content, "utf8").toString("base64"),
		kind: "text"
	};
}
var MODEL = "grok-4.5";
var MAX_TOKENS = 1600;
var MAX_ROUNDS = 4;
function jsonArgs(raw) {
	try {
		const parsed = JSON.parse(raw);
		if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) return parsed;
	} catch {}
	return {};
}
function str(v, fallback = "") {
	return typeof v === "string" && v.trim() ? v : fallback;
}
function connectorFor(id) {
	return CONNECTORS.find((c) => c.id === id);
}
async function githubSearch(query) {
	const url = new URL("https://api.github.com/search/repositories");
	url.searchParams.set("q", query.slice(0, 200));
	url.searchParams.set("per_page", "5");
	const res = await fetch(url, { headers: {
		Accept: "application/vnd.github+json",
		"User-Agent": "SLIeQwneB-Agent"
	} });
	if (!res.ok) return { error: `GitHub search failed (${res.status})` };
	return ((await res.json()).items ?? []).map((r) => ({
		repo: r.full_name,
		description: r.description,
		url: r.html_url,
		stars: r.stargazers_count
	}));
}
function buildTools(req) {
	const tools = [];
	if (req.enabledConnectors.includes("google-drive")) tools.push({
		type: "function",
		function: {
			name: "search_google_drive",
			description: "Search the user's Google Drive by keyword or title.",
			parameters: {
				type: "object",
				properties: { query: { type: "string" } },
				required: ["query"]
			}
		}
	}, {
		type: "function",
		function: {
			name: "read_google_drive_file",
			description: "Read a Google Drive file by id.",
			parameters: {
				type: "object",
				properties: { fileId: { type: "string" } },
				required: ["fileId"]
			}
		}
	});
	if (req.enabledConnectors.includes("gmail")) tools.push({
		type: "function",
		function: {
			name: "search_gmail",
			description: "Search the user's Gmail with a Gmail query string.",
			parameters: {
				type: "object",
				properties: { query: { type: "string" } },
				required: ["query"]
			}
		}
	});
	if (req.enabledConnectors.includes("google-calendar")) tools.push({
		type: "function",
		function: {
			name: "search_google_calendar",
			description: "Search upcoming Google Calendar events.",
			parameters: {
				type: "object",
				properties: {
					query: { type: "string" },
					timeMin: {
						type: "string",
						description: "ISO datetime lower bound"
					},
					timeMax: {
						type: "string",
						description: "ISO datetime upper bound"
					}
				}
			}
		}
	});
	if (req.enabledConnectors.includes("outlook")) tools.push({
		type: "function",
		function: {
			name: "search_outlook",
			description: "Search Outlook mail.",
			parameters: {
				type: "object",
				properties: { query: { type: "string" } },
				required: ["query"]
			}
		}
	});
	if (req.enabledConnectors.includes("outlook-calendar")) tools.push({
		type: "function",
		function: {
			name: "search_outlook_calendar",
			description: "Search Outlook calendar events.",
			parameters: {
				type: "object",
				properties: { query: { type: "string" } }
			}
		}
	});
	if (req.enabledConnectors.includes("teams")) tools.push({
		type: "function",
		function: {
			name: "search_teams",
			description: "Search Microsoft Teams messages.",
			parameters: {
				type: "object",
				properties: { query: { type: "string" } },
				required: ["query"]
			}
		}
	});
	if (req.enabledSkills.includes("github")) tools.push({
		type: "function",
		function: {
			name: "search_github",
			description: "Search public GitHub repositories.",
			parameters: {
				type: "object",
				properties: { query: { type: "string" } },
				required: ["query"]
			}
		}
	});
	const docSkills = [
		"word",
		"pdf",
		"spreadsheet",
		"presentation"
	].filter((id) => req.enabledSkills.includes(id));
	if (docSkills.length > 0) tools.push({
		type: "function",
		function: {
			name: "create_file",
			description: "Create a downloadable file for the user. Use word, pdf, spreadsheet, or presentation.",
			parameters: {
				type: "object",
				properties: {
					kind: {
						type: "string",
						enum: docSkills
					},
					title: { type: "string" },
					content: {
						type: "string",
						description: "Full file body. For slides, use markdown headings per slide."
					}
				},
				required: [
					"kind",
					"title",
					"content"
				]
			}
		}
	});
	return tools;
}
function systemPrompt(req) {
	const connectors = req.enabledConnectors.map((id) => catalogById(id)?.name ?? id).join(", ");
	const skills = [...req.enabledSkills.map((id) => catalogById(id)?.name ?? id), ...req.customSkills.map((s) => s.name)].join(", ");
	const custom = req.customSkills.length === 0 ? "" : `\nCustom skills:\n${req.customSkills.map((s) => `- ${s.name}: ${s.description}. Instructions: ${s.instructions}`).join("\n")}`;
	const files = req.files.length === 0 ? "No files attached." : req.files.map((f) => `FILE ${f.name} (${f.mimeType}, ${f.size} bytes)\n${f.text.slice(0, 12e3)}`).join("\n\n---\n\n");
	return `You are SLIeQwneB oss 7×, a precise workspace agent. You help with documents, connected accounts, and file skills.
Write in clear prose. Prefer short sections over filler. Never use emoji.
When a connector is needed, call the matching tool instead of pretending you fetched data.
If a tool returns login_required, not_connected, or pending, explain that the user must connect the service in Grok — do not invent emails, files, or events.
When asked to create a document, spreadsheet, PDF, or deck, call create_file with the full content.
Enabled connectors: ${connectors || "none"}.
Enabled skills: ${skills || "none"}.${custom}

Attached files:
${files}`;
}
async function grokChat(apiKey, messages, tools) {
	const res = await fetch("https://api.x.ai/v1/chat/completions", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${apiKey}`
		},
		body: JSON.stringify({
			model: MODEL,
			messages,
			tools: tools.length ? tools : void 0,
			max_tokens: MAX_TOKENS,
			temperature: .4
		})
	});
	if (!res.ok) return {
		message: {
			role: "assistant",
			content: ""
		},
		error: `xAI API error ${res.status}`
	};
	return { message: (await res.json()).choices?.[0]?.message ?? {
		role: "assistant",
		content: ""
	} };
}
async function runConnectorTool(name, args) {
	const { callTool, GoogleDriveTools, GoogleCalendarTools } = await import("./client.server-BLMacK0L.mjs");
	const spec = {
		search_google_drive: {
			tool: GoogleDriveTools.search,
			connectorId: "google-drive",
			args: { query: str(args.query) }
		},
		read_google_drive_file: {
			tool: GoogleDriveTools.readFile,
			connectorId: "google-drive",
			args: { file_id: str(args.fileId || args.file_id) }
		},
		search_gmail: {
			tool: "gmail_search",
			connectorId: "gmail",
			args: { query: str(args.query) }
		},
		search_google_calendar: {
			tool: GoogleCalendarTools.search,
			connectorId: "google-calendar",
			args: {
				query: str(args.query),
				time_min: str(args.timeMin || args.time_min) || void 0,
				time_max: str(args.timeMax || args.time_max) || void 0
			}
		},
		search_outlook: {
			tool: "outlook_search",
			connectorId: "outlook",
			args: { query: str(args.query) }
		},
		search_outlook_calendar: {
			tool: "outlook_calendar_search",
			connectorId: "outlook-calendar",
			args: { query: str(args.query) }
		},
		search_teams: {
			tool: "microsoft_teams_search",
			connectorId: "teams",
			args: { query: str(args.query) }
		}
	}[name];
	if (!spec) return { payload: { error: `Unknown tool ${name}` } };
	const item = connectorFor(spec.connectorId);
	if (!item?.connectorType) return { payload: { error: "Connector not configured" } };
	const result = await callTool(spec.tool, spec.args, { connectorType: item.connectorType });
	const classified = classifyCallToolError(result);
	if (!result.ok) return {
		payload: {
			ok: false,
			kind: classified?.kind,
			message: classified?.message ?? result.errorMessage
		},
		loginRequired: result.loginRequired,
		loginUrl: result.loginUrl
	};
	return { payload: result.data };
}
async function runChat(req) {
	const apiKey = process.env.XAI_API_KEY;
	if (!apiKey) return {
		ok: false,
		error: "AI is not available in this environment."
	};
	const tools = buildTools(req);
	const history = req.messages.slice(-16).map((m) => ({
		role: m.role,
		content: m.content.slice(0, 8e3)
	}));
	const messages = [{
		role: "system",
		content: systemPrompt(req)
	}, ...history];
	const artifacts = [];
	const traces = [];
	let loginRequired = false;
	let loginUrl;
	for (let round = 0; round < MAX_ROUNDS; round++) {
		const { message, error } = await grokChat(apiKey, messages, tools);
		if (error) return {
			ok: false,
			error,
			loginRequired,
			loginUrl
		};
		const calls = message.tool_calls ?? [];
		if (calls.length === 0) {
			const content = (message.content ?? "").trim();
			if (!content && artifacts.length === 0) return {
				ok: false,
				error: "The agent returned an empty response."
			};
			return {
				ok: true,
				content: content || "Created the file. Download it from the card below.",
				artifacts,
				traces
			};
		}
		messages.push(message);
		for (const call of calls) {
			const args = jsonArgs(call.function.arguments);
			let payload = { error: "unhandled tool" };
			if (call.function.name === "search_github") {
				payload = await githubSearch(str(args.query));
				traces.push({
					name: "GitHub",
					summary: str(args.query, "search"),
					ok: true
				});
			} else if (call.function.name === "create_file") {
				const kind = str(args.kind);
				const title = str(args.title, "Untitled");
				const content = str(args.content);
				const artifact = createArtifact([
					"word",
					"pdf",
					"spreadsheet",
					"presentation",
					"text"
				].includes(kind) ? kind : "text", title, content);
				artifacts.push(artifact);
				payload = {
					ok: true,
					filename: artifact.filename,
					kind: artifact.kind
				};
				traces.push({
					name: "Create file",
					summary: artifact.filename,
					ok: true
				});
			} else {
				const result = await runConnectorTool(call.function.name, args);
				payload = result.payload;
				if (result.loginRequired) {
					loginRequired = true;
					loginUrl = result.loginUrl;
				}
				const ok = !(payload && typeof payload === "object" && "ok" in payload && payload.ok === false);
				traces.push({
					name: call.function.name.replaceAll("_", " "),
					summary: str(args.query) || str(args.fileId) || "lookup",
					ok
				});
			}
			messages.push({
				role: "tool",
				tool_call_id: call.id,
				content: JSON.stringify(payload).slice(0, 12e3)
			});
		}
	}
	return {
		ok: true,
		content: "I reached the tool-call limit. Ask me to continue from the last result.",
		artifacts,
		traces
	};
}
async function probeConnector(connectorId) {
	const item = connectorFor(connectorId);
	if (!item?.connectorType || !item.probeTool) return {
		ok: false,
		message: "This connector is not available here.",
		kind: "error"
	};
	const { callTool } = await import("./client.server-BLMacK0L.mjs");
	const result = await callTool(item.probeTool, item.probeArgs ?? {}, { connectorType: item.connectorType });
	const classified = classifyCallToolError(result);
	if (result.ok) return {
		ok: true,
		message: `Connected to ${item.name}.`
	};
	return {
		ok: false,
		pending: result.pending,
		loginRequired: result.loginRequired,
		loginUrl: result.loginUrl,
		message: classified?.message ?? result.errorMessage ?? "Could not reach this connector.",
		kind: classified?.kind
	};
}
//#endregion
export { probeConnector, runChat };
