import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { r as Slot, s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as TSS_SERVER_FUNCTION, r as getServerFnById, t as createServerFn } from "./ssr.mjs";
import { n as SKILLS, r as SUGGESTIONS, s as redirectToLoginIfRequired, t as CONNECTORS } from "./catalog-BgtA8weR.mjs";
import { S as ArrowUp, _ as FolderOpen, a as Search, b as Download, c as Plus, d as Menu, f as Mail, g as Github, h as Inbox, i as Trash2, l as Paperclip, m as LogIn, n as Waypoints, o as Puzzle, p as LogOut, s as Presentation, t as X, u as MessagesSquare, v as FileText, x as CalendarDays, y as FileSpreadsheet } from "../_libs/lucide-react.mjs";
import { i as APP_SHORT_NAME, n as APP_DESCRIPTION, r as APP_EDITION } from "./router-B_mMzZ2I.mjs";
import { n as clsx, t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { n as create, t as persist } from "../_libs/zustand.mjs";
import { t as require_lib } from "../_libs/jszip+[...].mjs";
import { a as DialogOverlay$1, i as DialogDescription$1, n as DialogClose, o as DialogPortal$1, r as DialogContent$1, s as DialogTitle$1, t as Dialog$1 } from "../_libs/@radix-ui/react-dialog+[...].mjs";
import { i as Trigger, n as List, r as Root2, t as Content } from "../_libs/radix-ui__react-tabs.mjs";
import { i as Viewport, n as Scrollbar, r as Thumb, t as Root } from "../_libs/radix-ui__react-scroll-area.mjs";
import { n as Portal, r as Provider, t as Content2 } from "../_libs/@radix-ui/react-tooltip+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-CMZTFfwQ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var import_lib = /* @__PURE__ */ __toESM(require_lib());
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
function formatBytes(bytes) {
	if (bytes < 1024) return `${bytes} B`;
	if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
	return `${(bytes / 1048576).toFixed(1)} MB`;
}
function relativeTime(ts) {
	const delta = Date.now() - ts;
	const minutes = Math.floor(delta / 6e4);
	if (minutes < 1) return "Just now";
	if (minutes < 60) return `${minutes}m ago`;
	const hours = Math.floor(minutes / 60);
	if (hours < 24) return `${hours}h ago`;
	const days = Math.floor(hours / 24);
	if (days < 7) return `${days}d ago`;
	return new Date(ts).toLocaleDateString();
}
function uid(prefix = "id") {
	return `${prefix}_${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36).slice(-4)}`;
}
function downloadBase64(filename, mimeType, base64) {
	const bytes = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
	const blob = new Blob([bytes], { type: mimeType });
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = filename;
	a.click();
	URL.revokeObjectURL(url);
}
function AppMark({ className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 32 32",
		className: cn("text-foreground", className),
		fill: "none",
		"aria-hidden": "true",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "16",
				cy: "16",
				r: "13",
				stroke: "currentColor",
				strokeWidth: "1.4",
				opacity: "0.35"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "16",
				cy: "16",
				r: "8",
				stroke: "currentColor",
				strokeWidth: "1.4",
				opacity: "0.7"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M12.4 12.4l7.2 7.2M19.6 12.4l-7.2 7.2",
				stroke: "currentColor",
				strokeWidth: "1.7",
				strokeLinecap: "round"
			})
		]
	});
}
function PuterMark({ className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 24 24",
		className: cn("text-current", className),
		fill: "none",
		"aria-hidden": "true",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
			x: "3.25",
			y: "3.25",
			width: "17.5",
			height: "17.5",
			rx: "5",
			stroke: "currentColor",
			strokeWidth: "1.5"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
			d: "M8.5 16V8.6h4.15c2.2 0 3.55 1.2 3.55 3.05 0 1.9-1.4 3.15-3.6 3.15H10.7",
			stroke: "currentColor",
			strokeWidth: "1.55",
			strokeLinecap: "round",
			strokeLinejoin: "round"
		})]
	});
}
var buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-[color,background-color,opacity,transform,box-shadow] duration-[var(--motion-quick)] ease-[var(--ease-out)] disabled:pointer-events-none disabled:opacity-40 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-ring/70 active:enabled:scale-[0.96]", {
	variants: {
		variant: {
			default: "bg-primary text-primary-foreground hover:bg-primary/90",
			secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border",
			ghost: "hover:bg-secondary text-foreground",
			outline: "border border-border bg-transparent hover:bg-secondary",
			destructive: "bg-destructive/15 text-destructive hover:bg-destructive/25"
		},
		size: {
			default: "h-10 px-4 rounded-[var(--radius-md)]",
			sm: "h-8 px-3 text-xs rounded-[var(--radius-sm)]",
			lg: "h-12 px-5 rounded-[var(--radius-lg)]",
			icon: "size-10 rounded-[var(--radius-md)]",
			pill: "h-9 px-4 rounded-full"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
var Button = import_react.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		className: cn(buttonVariants({
			variant,
			size,
			className
		})),
		ref,
		...props
	});
});
Button.displayName = "Button";
var PUTER_SRC = "https://js.puter.com/v2/";
var loadPromise = null;
function waitForAuth(timeoutMs = 12e3) {
	return new Promise((resolve, reject) => {
		const start = Date.now();
		const tick = () => {
			if (window.puter?.auth) {
				resolve(window.puter);
				return;
			}
			if (Date.now() - start > timeoutMs) {
				reject(/* @__PURE__ */ new Error("Puter loaded but authentication is not ready."));
				return;
			}
			window.setTimeout(tick, 40);
		};
		tick();
	});
}
function loadPuter() {
	if (typeof window === "undefined") return Promise.reject(/* @__PURE__ */ new Error("Puter is only available in the browser."));
	if (window.puter?.auth) return Promise.resolve(window.puter);
	if (loadPromise) return loadPromise;
	loadPromise = new Promise((resolve, reject) => {
		const existing = document.querySelector(`script[data-puter-sdk="v2"]`);
		const ready = () => {
			waitForAuth().then(resolve).catch((err) => {
				loadPromise = null;
				reject(err);
			});
		};
		if (existing) {
			ready();
			return;
		}
		const script = document.createElement("script");
		script.src = PUTER_SRC;
		script.async = true;
		script.dataset.puterSdk = "v2";
		script.onload = ready;
		script.onerror = () => {
			loadPromise = null;
			reject(/* @__PURE__ */ new Error("Could not reach Puter. Check your connection, then try again."));
		};
		document.head.appendChild(script);
	});
	return loadPromise;
}
function puterErrorMessage(err) {
	if (err && typeof err === "object") {
		const record = err;
		if (typeof record.msg === "string" && record.msg.trim()) return record.msg;
		if (typeof record.message === "string" && record.message.trim()) return record.message;
		if (typeof record.error === "string" && record.error.trim()) return record.error;
	}
	if (err instanceof Error && err.message.trim()) return err.message;
	return "Sign-in was cancelled or blocked. Allow popups for this site, then try again.";
}
var GUEST_KEY = "slieqwneb-guest";
var PuterAuthContext = (0, import_react.createContext)(null);
function readGuest() {
	try {
		return sessionStorage.getItem(GUEST_KEY) === "1";
	} catch {
		return false;
	}
}
function writeGuest(on) {
	try {
		if (on) sessionStorage.setItem(GUEST_KEY, "1");
		else sessionStorage.removeItem(GUEST_KEY);
	} catch {}
}
function PuterAuthProvider({ children }) {
	const [status, setStatus] = (0, import_react.useState)("loading");
	const [user, setUser] = (0, import_react.useState)(null);
	const [error, setError] = (0, import_react.useState)(null);
	const [pending, setPending] = (0, import_react.useState)(false);
	const hydrate = (0, import_react.useCallback)(async () => {
		setError(null);
		try {
			const puter = await loadPuter();
			if (puter.auth.isSignedIn()) {
				const next = await puter.auth.getUser();
				setUser(next);
				setStatus("signed_in");
				writeGuest(false);
				return;
			}
			setUser(null);
			setStatus(readGuest() ? "guest" : "signed_out");
		} catch (err) {
			setUser(null);
			setStatus(readGuest() ? "guest" : "unavailable");
			setError(puterErrorMessage(err));
		}
	}, []);
	(0, import_react.useEffect)(() => {
		hydrate();
	}, [hydrate]);
	const signIn = (0, import_react.useCallback)(async () => {
		setError(null);
		setPending(true);
		try {
			const puter = await loadPuter();
			await puter.auth.signIn();
			const next = await puter.auth.getUser();
			writeGuest(false);
			setUser(next);
			setStatus("signed_in");
		} catch (err) {
			setError(puterErrorMessage(err));
		} finally {
			setPending(false);
		}
	}, []);
	const signOut = (0, import_react.useCallback)(async () => {
		try {
			await (await loadPuter()).auth.signOut();
		} catch {}
		writeGuest(false);
		setUser(null);
		setStatus("signed_out");
		setError(null);
	}, []);
	const continueAsGuest = (0, import_react.useCallback)(() => {
		writeGuest(true);
		setUser(null);
		setStatus("guest");
		setError(null);
	}, []);
	const value = (0, import_react.useMemo)(() => ({
		status,
		user,
		error,
		pending,
		signIn,
		signOut,
		continueAsGuest,
		retry: hydrate
	}), [
		status,
		user,
		error,
		pending,
		signIn,
		signOut,
		continueAsGuest,
		hydrate
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PuterAuthContext.Provider, {
		value,
		children
	});
}
function usePuterAuth() {
	const ctx = (0, import_react.useContext)(PuterAuthContext);
	if (!ctx) throw new Error("usePuterAuth must be used within PuterAuthProvider");
	return ctx;
}
function PuterGate({ children }) {
	const { status } = usePuterAuth();
	if (status === "signed_in" || status === "guest") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PuterLoginScreen, {});
}
function PuterLoginScreen() {
	const { status, error, pending, signIn, continueAsGuest, retry } = usePuterAuth();
	const loading = status === "loading";
	const unavailable = status === "unavailable";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative flex min-h-[100dvh] items-center justify-center overflow-hidden bg-background px-5 py-10",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			"aria-hidden": "true",
			className: "pointer-events-none absolute inset-0 puter-login-glow"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative w-full max-w-md lumen-stagger",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col items-center text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppMark, { className: "size-16 text-brand" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "mt-6 font-display text-4xl tracking-[-0.03em] sm:text-5xl",
							children: APP_SHORT_NAME
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm uppercase tracking-[0.22em] text-subtle",
							children: APP_EDITION
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground",
							children: APP_DESCRIPTION
						})
					]
				}),
				loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-10 space-y-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex h-12 items-center justify-center rounded-full bg-secondary text-sm text-muted-foreground",
						children: "Connecting to Puter…"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "lg",
						variant: "ghost",
						className: "h-12 w-full rounded-full text-sm",
						onClick: continueAsGuest,
						children: "Continue as guest"
					})]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-10 space-y-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							size: "lg",
							className: "h-12 w-full rounded-full text-sm",
							onClick: () => void signIn(),
							disabled: unavailable || pending,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PuterMark, { className: "size-4" }), pending ? "Waiting for Puter…" : "Continue with Puter"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "lg",
							variant: "ghost",
							className: "h-12 w-full rounded-full text-sm",
							onClick: continueAsGuest,
							disabled: pending,
							children: "Continue as guest"
						}),
						unavailable ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "lg",
							variant: "outline",
							className: "h-12 w-full rounded-full text-sm",
							onClick: () => void retry(),
							children: "Retry Puter"
						}) : null
					]
				}),
				error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: cn("mt-5 text-center text-xs leading-relaxed", unavailable ? "text-destructive" : "text-muted-foreground"),
					children: error
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-5 text-center text-xs leading-relaxed text-subtle",
					children: "Puter opens a sign-in window. Allow popups, then return here."
				})
			]
		})]
	});
}
var sendChat = createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("d274ec0f9124d332f8d9327bbe73dc02de64bd05136443affd1df98f813b845a"));
var probeConnectorFn = createServerFn({ method: "POST" }).validator((input) => input).handler(createSsrRpc("6c6295efd7c3c134f692dd4e9ddbd4f10f1893663df0a28b2112d0ba345decd9"));
function blankConversation() {
	const now = Date.now();
	return {
		id: uid("chat"),
		title: "New chat",
		createdAt: now,
		updatedAt: now,
		messages: []
	};
}
var defaultSkillIds = SKILLS.map((s) => s.id);
var useLumenStore = create()(persist((set) => ({
	hydrated: false,
	conversations: [],
	activeId: null,
	enabledConnectorIds: [],
	enabledSkillIds: defaultSkillIds,
	customSkills: [],
	markHydrated: () => set({ hydrated: true }),
	newConversation: () => {
		const convo = blankConversation();
		set((state) => ({
			conversations: [convo, ...state.conversations],
			activeId: convo.id
		}));
		return convo.id;
	},
	setActive: (id) => set({ activeId: id }),
	deleteConversation: (id) => set((state) => {
		const conversations = state.conversations.filter((c) => c.id !== id);
		return {
			conversations,
			activeId: state.activeId === id ? conversations[0]?.id ?? null : state.activeId
		};
	}),
	appendMessage: (conversationId, message) => set((state) => ({ conversations: state.conversations.map((c) => c.id === conversationId ? {
		...c,
		updatedAt: Date.now(),
		title: c.messages.length === 0 && message.role === "user" ? message.content.slice(0, 48) || c.title : c.title,
		messages: [...c.messages, message]
	} : c) })),
	patchMessage: (conversationId, messageId, patch) => set((state) => ({ conversations: state.conversations.map((c) => c.id === conversationId ? {
		...c,
		updatedAt: Date.now(),
		messages: c.messages.map((m) => m.id === messageId ? {
			...m,
			...patch
		} : m)
	} : c) })),
	renameConversation: (conversationId, title) => set((state) => ({ conversations: state.conversations.map((c) => c.id === conversationId ? {
		...c,
		title,
		updatedAt: Date.now()
	} : c) })),
	toggleConnector: (id) => set((state) => ({ enabledConnectorIds: state.enabledConnectorIds.includes(id) ? state.enabledConnectorIds.filter((x) => x !== id) : [...state.enabledConnectorIds, id] })),
	setConnectorEnabled: (id, enabled) => set((state) => ({ enabledConnectorIds: enabled ? Array.from(/* @__PURE__ */ new Set([...state.enabledConnectorIds, id])) : state.enabledConnectorIds.filter((x) => x !== id) })),
	toggleSkill: (id) => {
		if (SKILLS.find((s) => s.id === id)?.alwaysOn) return;
		set((state) => ({ enabledSkillIds: state.enabledSkillIds.includes(id) ? state.enabledSkillIds.filter((x) => x !== id) : [...state.enabledSkillIds, id] }));
	},
	addCustomSkill: (skill) => {
		const created = {
			...skill,
			id: uid("skill")
		};
		set((state) => ({ customSkills: [created, ...state.customSkills] }));
		return created;
	},
	removeCustomSkill: (id) => set((state) => ({ customSkills: state.customSkills.filter((s) => s.id !== id) }))
}), {
	name: "slieqwneb-workspace",
	partialize: (state) => ({
		conversations: state.conversations.slice(0, 40),
		activeId: state.activeId,
		enabledConnectorIds: state.enabledConnectorIds,
		enabledSkillIds: state.enabledSkillIds,
		customSkills: state.customSkills
	}),
	onRehydrateStorage: () => (state) => {
		state?.markHydrated();
	}
}));
function inlineFormat(text) {
	const parts = [];
	const re = /(`[^`]+`)|(\*\*[^*]+\*\*)|(\[[^\]]+\]\([^)]+\))/g;
	let last = 0;
	let match;
	let i = 0;
	while (match = re.exec(text)) {
		if (match.index > last) parts.push(text.slice(last, match.index));
		const token = match[0];
		if (token.startsWith("`")) parts.push(/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
			className: "rounded-[6px] bg-secondary px-1.5 py-0.5 font-mono text-[0.85em]",
			children: token.slice(1, -1)
		}, i++));
		else if (token.startsWith("**")) parts.push(/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
			className: "font-semibold text-foreground",
			children: token.slice(2, -2)
		}, i++));
		else {
			const m = token.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
			if (m) parts.push(/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
				href: m[2],
				target: "_blank",
				rel: "noreferrer",
				className: "underline underline-offset-2 decoration-border hover:text-foreground",
				children: m[1]
			}, i++));
		}
		last = match.index + token.length;
	}
	if (last < text.length) parts.push(text.slice(last));
	return parts;
}
function Markdown({ content, className }) {
	const blocks = content.split("\n\n");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("space-y-3 text-[15px] leading-relaxed text-foreground/92", className),
		children: blocks.map((block, idx) => {
			const trimmed = block.trim();
			if (!trimmed) return null;
			if (trimmed.startsWith("```")) {
				const inner = trimmed.replace(/^```[a-zA-Z0-9]*\n?/, "").replace(/```$/, "");
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
					className: "overflow-x-auto rounded-[var(--radius-md)] border border-border bg-secondary/50 p-3 font-mono text-[13px] leading-snug",
					children: inner
				}, idx);
			}
			if (trimmed.startsWith("### ")) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "text-base font-semibold",
				children: inlineFormat(trimmed.slice(4))
			}, idx);
			if (trimmed.startsWith("## ")) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-lg font-semibold tracking-tight",
				children: inlineFormat(trimmed.slice(3))
			}, idx);
			if (trimmed.startsWith("# ")) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-2xl tracking-tight",
				children: inlineFormat(trimmed.slice(2))
			}, idx);
			if (trimmed.split("\n").every((l) => /^[-*]\s+/.test(l) || l.trim() === "")) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "list-disc space-y-1 pl-5",
				children: trimmed.split("\n").filter(Boolean).map((l, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: inlineFormat(l.replace(/^[-*]\s+/, "")) }, i))
			}, idx);
			if (trimmed.split("\n").every((l) => /^\d+\.\s+/.test(l) || l.trim() === "")) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
				className: "list-decimal space-y-1 pl-5",
				children: trimmed.split("\n").filter(Boolean).map((l, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: inlineFormat(l.replace(/^\d+\.\s+/, "")) }, i))
			}, idx);
			return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "whitespace-pre-wrap",
				children: inlineFormat(trimmed)
			}, idx);
		})
	});
}
function ChatThread({ messages, pending, onSuggestion }) {
	if (messages.length === 0 && !pending) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center px-4 py-10",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "lumen-stagger flex flex-col items-center text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppMark, { className: "mb-5 size-14 text-brand" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-4xl tracking-[-0.03em] sm:text-5xl",
					children: APP_SHORT_NAME
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-xs uppercase tracking-[0.2em] text-subtle",
					children: APP_EDITION
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 max-w-md text-sm text-muted-foreground",
					children: "An agent workspace for files, connectors, and skills. Attach a document or ask about your calendar."
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "lumen-stagger mt-10 grid w-full gap-2 sm:grid-cols-2",
			children: SUGGESTIONS.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: () => onSuggestion(item.prompt),
				className: "rounded-[20px] border border-border bg-card px-4 py-4 text-left transition-colors duration-[var(--motion-quick)] hover:bg-secondary",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm font-medium",
					children: item.title
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 line-clamp-2 text-xs text-muted-foreground",
					children: item.prompt
				})]
			}, item.id))
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-4 py-6",
		children: [messages.map((message) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageBlock, { message }, message.id)), pending ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-start gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppMark, { className: "mt-0.5 size-7 shrink-0 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "lumen-shimmer pt-1 text-sm",
				children: "Thinking"
			})]
		}) : null]
	});
}
function MessageBlock({ message }) {
	const isUser = message.role === "user";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("flex gap-3", isUser ? "justify-end" : "items-start"),
		children: [!isUser ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppMark, { className: "mt-1 size-7 shrink-0 text-muted-foreground" }) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: cn("min-w-0 max-w-[min(100%,40rem)]", isUser && "flex flex-col items-end"),
			children: [
				message.files && message.files.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mb-2 flex flex-wrap justify-end gap-1.5",
					children: message.files.map((file) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "inline-flex items-center gap-1.5 rounded-full border border-border bg-secondary px-2.5 py-1 text-[11px] text-muted-foreground",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Paperclip, { className: "size-3" }),
							file.name,
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-subtle",
								children: formatBytes(file.size)
							})
						]
					}, file.name))
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: cn(isUser ? "rounded-[22px] rounded-br-[8px] bg-secondary px-4 py-3 text-[15px] leading-relaxed" : "pt-1"),
					children: isUser ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "whitespace-pre-wrap",
						children: message.content
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Markdown, { content: message.content })
				}),
				message.traces && message.traces.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-2 flex flex-wrap gap-1.5",
					children: message.traces.map((trace, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "inline-flex items-center gap-1 rounded-full border border-border px-2 py-0.5 text-[11px] text-muted-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Waypoints, { className: "size-3" }), trace.name]
					}, `${trace.name}-${i}`))
				}) : null,
				message.artifacts && message.artifacts.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-3 grid w-full gap-2",
					children: message.artifacts.map((art) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between gap-3 rounded-[18px] border border-border bg-card px-3 py-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "truncate text-sm font-medium",
								children: art.filename
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs capitalize text-muted-foreground",
								children: art.kind
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							size: "sm",
							variant: "secondary",
							onClick: () => downloadBase64(art.filename, art.mimeType, art.base64),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-3.5" }), "Download"]
						})]
					}, art.id))
				}) : null
			]
		})]
	});
}
var MAX_FILE_BYTES = 2097152;
var MAX_TEXT_CHARS = 14e3;
var MAX_FILES = 6;
function clip(text, max = MAX_TEXT_CHARS) {
	const trimmed = text.replace(/\u0000/g, "").trim();
	if (trimmed.length <= max) return trimmed;
	return `${trimmed.slice(0, max)}\n\n[truncated]`;
}
function decodeXml(xml) {
	return xml.replace(/<w:p[^>]*>/g, "\n").replace(/<a:t[^>]*>/g, "").replace(/<\/a:t>/g, "").replace(/<t[^>]*>/g, "").replace(/<\/t>/g, " ").replace(/<[^>]+>/g, " ").replace(/\u0026amp;/g, "&").replace(/\u0026lt;/g, "<").replace(/\u0026gt;/g, ">").replace(/\u0026quot;/g, "\"").replace(/\u0026#39;/g, "'").replace(/[ \t]+\n/g, "\n").replace(/\n{3,}/g, "\n\n").replace(/[ \t]{2,}/g, " ").trim();
}
async function extractZipText(file, paths) {
	const zip = await import_lib.default.loadAsync(await file.arrayBuffer());
	const chunks = [];
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
function extractPdfText(buffer) {
	const raw = new TextDecoder("latin1").decode(buffer);
	const parts = [];
	const paren = /\((?:\\.|[^\\)]){2,}\)/g;
	let match;
	while (match = paren.exec(raw)) {
		const decoded = match[0].slice(1, -1).replace(/\\n/g, "\n").replace(/\\r/g, "").replace(/\\t/g, "	").replace(/\\\(/g, "(").replace(/\\\)/g, ")").replace(/\\\\/g, "\\");
		if (/[A-Za-z]{3,}/.test(decoded)) parts.push(decoded);
	}
	const streams = raw.match(/BT[\s\S]{0,4000}?ET/g) ?? [];
	for (const stream of streams) {
		const tj = stream.match(/\((?:\\.|[^\\)])+\)\s*Tj/g) ?? [];
		for (const token of tj) parts.push(token.slice(1, token.lastIndexOf(")")));
	}
	return clip(parts.join(" "));
}
async function extractAttachedFile(file) {
	if (file.size > MAX_FILE_BYTES) throw new Error(`${file.name} is larger than 2 MB`);
	const name = file.name;
	const mimeType = file.type || "application/octet-stream";
	const lower = name.toLowerCase();
	if (mimeType.startsWith("text/") || lower.endsWith(".md") || lower.endsWith(".json") || lower.endsWith(".csv") || lower.endsWith(".html")) return {
		name,
		mimeType,
		size: file.size,
		text: clip(await file.text())
	};
	if (lower.endsWith(".docx")) {
		const text = await extractZipText(file, ["word/document.xml"]);
		return {
			name,
			mimeType,
			size: file.size,
			text: clip(text) || "[empty document]"
		};
	}
	if (lower.endsWith(".pptx")) {
		const zip = await import_lib.default.loadAsync(await file.arrayBuffer());
		const slides = Object.keys(zip.files).filter((n) => /ppt\/slides\/slide\d+\.xml$/.test(n)).sort();
		const chunks = [];
		for (const path of slides) {
			const entry = zip.file(path);
			if (entry) chunks.push(decodeXml(await entry.async("string")));
		}
		return {
			name,
			mimeType,
			size: file.size,
			text: clip(chunks.join("\n\n"))
		};
	}
	if (lower.endsWith(".xlsx") || lower.endsWith(".xls")) {
		const text = await extractZipText(file, ["xl/sharedStrings.xml", "xl/worksheets/sheet1.xml"]);
		return {
			name,
			mimeType,
			size: file.size,
			text: clip(text)
		};
	}
	if (lower.endsWith(".pdf") || mimeType === "application/pdf") {
		const text = extractPdfText(await file.arrayBuffer());
		return {
			name,
			mimeType,
			size: file.size,
			text: text || "[PDF parsed, but no extractable text was found]"
		};
	}
	return {
		name,
		mimeType,
		size: file.size,
		text: `[binary file ${name}; ${mimeType}; no text extractor for this type]`
	};
}
async function extractAttachedFiles(files) {
	const slice = files.slice(0, MAX_FILES);
	return Promise.all(slice.map(extractAttachedFile));
}
var FILE_ACCEPT = ".txt,.md,.json,.csv,.html,.pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx";
var Textarea = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
	ref,
	className: cn("flex min-h-20 w-full resize-none bg-transparent px-1 py-1 text-base text-foreground placeholder:text-subtle outline-none disabled:opacity-50 md:text-sm", className),
	...props
}));
Textarea.displayName = "Textarea";
function Composer({ disabled, onSend, onOpenPlugins }) {
	const [value, setValue] = (0, import_react.useState)("");
	const [files, setFiles] = (0, import_react.useState)([]);
	const [parsing, setParsing] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)(null);
	const fileRef = (0, import_react.useRef)(null);
	const areaRef = (0, import_react.useRef)(null);
	const submit = () => {
		const text = value.trim();
		if (disabled || parsing) return;
		if (!text && files.length === 0) return;
		onSend(text || "Analyze the attached files. Summarize, tag themes, and list action items.", files);
		setValue("");
		setFiles([]);
		setError(null);
		if (areaRef.current) areaRef.current.style.height = "auto";
	};
	const onPick = async (list) => {
		if (!list || list.length === 0) return;
		setParsing(true);
		setError(null);
		try {
			const extracted = await extractAttachedFiles(Array.from(list));
			setFiles((prev) => [...prev, ...extracted].slice(0, 6));
		} catch (err) {
			setError(err instanceof Error ? err.message : "Could not read that file.");
		} finally {
			setParsing(false);
			if (fileRef.current) fileRef.current.value = "";
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto w-full max-w-3xl px-4 pb-[max(16px,env(safe-area-inset-bottom))]",
		children: [error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mb-2 text-center text-xs text-destructive",
			children: error
		}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: cn("rounded-[28px] border border-border bg-card p-3 shadow-[var(--shadow-soft)]", "focus-within:ring-1 focus-within:ring-ring/40"),
			children: [
				files.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mb-2 flex flex-wrap gap-2",
					children: files.map((file) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-3 py-1 text-xs",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "max-w-[160px] truncate",
								children: file.name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-subtle",
								children: formatBytes(file.size)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "text-subtle hover:text-foreground",
								onClick: () => setFiles((prev) => prev.filter((f) => f !== file)),
								"aria-label": `Remove ${file.name}`,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-3.5" })
							})
						]
					}, file.name + file.size))
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
					ref: areaRef,
					value,
					disabled,
					placeholder: `Ask ${APP_SHORT_NAME} anything`,
					rows: 1,
					onChange: (e) => {
						setValue(e.target.value);
						const el = e.target;
						el.style.height = "auto";
						el.style.height = `${Math.min(el.scrollHeight, 180)}px`;
					},
					onKeyDown: (e) => {
						if (e.key === "Enter" && !e.shiftKey) {
							e.preventDefault();
							submit();
						}
					},
					className: "max-h-44 min-h-[44px] px-3 py-2"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-1 flex items-center gap-1",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							ref: fileRef,
							type: "file",
							multiple: true,
							accept: FILE_ACCEPT,
							className: "hidden",
							onChange: (e) => void onPick(e.target.files)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "button",
							size: "icon",
							variant: "ghost",
							className: "size-10 rounded-full",
							onClick: () => fileRef.current?.click(),
							disabled: disabled || parsing,
							"aria-label": "Attach files",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Paperclip, { className: "size-4" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "button",
							size: "icon",
							variant: "ghost",
							className: "size-10 rounded-full",
							onClick: onOpenPlugins,
							"aria-label": "Plugins",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Puzzle, { className: "size-4" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "flex-1 text-xs text-subtle",
							children: parsing ? "Reading files…" : files.length ? `${files.length} attached` : ""
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "button",
							size: "icon",
							className: "size-10 rounded-full",
							onClick: submit,
							disabled: disabled || parsing || !value.trim() && files.length === 0,
							"aria-label": "Send",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUp, { className: "size-4" })
						})
					]
				})
			]
		})]
	});
}
var Dialog = Dialog$1;
var DialogPortal = DialogPortal$1;
var DialogOverlay = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay$1, {
	ref,
	className: cn("fixed inset-0 z-50 bg-background/70 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0", className),
	...props
}));
DialogOverlay.displayName = "DialogOverlay";
var DialogContent = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent$1, {
	ref,
	className: cn("fixed left-1/2 top-1/2 z-50 grid w-[min(100%-24px,640px)] max-h-[min(88vh,760px)] translate-x-[-50%] translate-y-[-50%] gap-0 overflow-hidden border border-border bg-card text-card-foreground shadow-[var(--shadow-soft)] rounded-[calc(var(--radius-xl)+4px)] duration-[var(--motion-fast)] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-100", className),
	...props,
	children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogClose, {
		className: "absolute right-4 top-4 rounded-[var(--radius-sm)] p-2 text-muted-foreground hover:bg-secondary hover:text-foreground",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "sr-only",
			children: "Close"
		})]
	})]
})] }));
DialogContent.displayName = "DialogContent";
function DialogHeader({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("flex flex-col gap-1 px-6 pt-6 pb-3", className),
		...props
	});
}
function DialogFooter({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("flex items-center gap-2 border-t border-border px-6 py-4", className),
		...props
	});
}
var DialogTitle = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle$1, {
	ref,
	className: cn("text-lg font-semibold tracking-tight", className),
	...props
}));
DialogTitle.displayName = "DialogTitle";
var DialogDescription = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription$1, {
	ref,
	className: cn("text-sm text-muted-foreground", className),
	...props
}));
DialogDescription.displayName = "DialogDescription";
var Input = import_react.forwardRef(({ className, type, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
	type,
	ref,
	className: cn("flex h-10 w-full rounded-[var(--radius-md)] border border-input bg-secondary/40 px-3 py-2 text-sm text-foreground placeholder:text-subtle outline-none transition-[border-color,box-shadow] duration-[var(--motion-quick)] focus-visible:ring-2 focus-visible:ring-ring/60 disabled:opacity-50", className),
	...props
}));
Input.displayName = "Input";
var Tabs = Root2;
var TabsList = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(List, {
	ref,
	className: cn("inline-flex h-10 items-center gap-1 rounded-full bg-secondary p-1", className),
	...props
}));
TabsList.displayName = "TabsList";
var TabsTrigger = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trigger, {
	ref,
	className: cn("inline-flex h-8 items-center justify-center rounded-full px-4 text-sm font-medium text-muted-foreground transition-colors duration-[var(--motion-quick)] data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-sm", className),
	...props
}));
TabsTrigger.displayName = "TabsTrigger";
var TabsContent = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Content, {
	ref,
	className: cn("mt-4 outline-none", className),
	...props
}));
TabsContent.displayName = "TabsContent";
var MAP = {
	drive: FolderOpen,
	mail: Mail,
	calendar: CalendarDays,
	outlook: Inbox,
	teams: MessagesSquare,
	word: FileText,
	pdf: FileText,
	sheet: FileSpreadsheet,
	slides: Presentation,
	github: Github,
	custom: Puzzle
};
function PluginIcon({ icon, className }) {
	const Icon = MAP[icon] ?? Puzzle;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("flex size-11 shrink-0 items-center justify-center rounded-[14px] border border-border bg-secondary text-foreground", className),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
			className: "size-5",
			strokeWidth: 1.6
		})
	});
}
function PluginsDialog({ open, onOpenChange }) {
	const [tab, setTab] = (0, import_react.useState)("connectors");
	const [query, setQuery] = (0, import_react.useState)("");
	const [creating, setCreating] = (0, import_react.useState)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "flex flex-col p-0",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Plugins" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Connect accounts and enable document skills for SLIeQwneB." })] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "px-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
						value: tab,
						onValueChange: setTab,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
								value: "connectors",
								children: "Connectors"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
								value: "skills",
								children: "Skills"
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative mt-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-subtle" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: query,
									onChange: (e) => setQuery(e.target.value),
									placeholder: "Search",
									className: "pl-9"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "lumen-scroll mt-4 max-h-[46vh] overflow-y-auto pr-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
									value: "connectors",
									className: "mt-0",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PluginList, {
										items: CONNECTORS,
										query,
										mode: "connectors"
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
									value: "skills",
									className: "mt-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PluginList, {
										items: SKILLS,
										query,
										mode: "skills"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CustomSkills, {})]
								})]
							})
						]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogFooter, { children: tab === "skills" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					className: "w-full rounded-full",
					onClick: () => setCreating(true),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), "New skill"]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "w-full text-center text-xs text-muted-foreground",
					children: "Connectors use your Grok grants. Enable one here so SLIeQwneB can call it in chat."
				}) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NewSkillDialog, {
					open: creating,
					onOpenChange: setCreating
				})
			]
		})
	});
}
function PluginList({ items, query, mode }) {
	const q = query.trim().toLowerCase();
	const filtered = (0, import_react.useMemo)(() => items.filter((item) => !q || item.name.toLowerCase().includes(q) || item.description.toLowerCase().includes(q) || item.group.toLowerCase().includes(q)), [items, q]);
	const groups = [...new Set(filtered.map((i) => i.group))];
	if (filtered.length === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "py-10 text-center text-sm text-muted-foreground",
		children: "No matches."
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "space-y-5",
		children: groups.map((group) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mb-2 text-[11px] font-medium uppercase tracking-[0.14em] text-subtle",
			children: group
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "space-y-2",
			children: filtered.filter((i) => i.group === group).map((item) => mode === "connectors" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConnectorRow, { item }, item.id) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SkillRow, { item }, item.id))
		})] }, group))
	});
}
function ConnectorRow({ item }) {
	const enabled = useLumenStore((s) => s.enabledConnectorIds.includes(item.id));
	const setEnabled = useLumenStore((s) => s.setConnectorEnabled);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [note, setNote] = (0, import_react.useState)(null);
	const [loginUrl, setLoginUrl] = (0, import_react.useState)(null);
	const onToggle = async () => {
		if (enabled) {
			setEnabled(item.id, false);
			setNote(null);
			setLoginUrl(null);
			return;
		}
		setBusy(true);
		setNote(null);
		setLoginUrl(null);
		try {
			const result = await probeConnectorFn({ data: { connectorId: item.id } });
			if (result.ok) {
				setEnabled(item.id, true);
				setNote("Ready for chat.");
			} else if (result.loginRequired && result.loginUrl) {
				setLoginUrl(result.loginUrl);
				setNote(result.message);
				setEnabled(item.id, true);
			} else if (result.kind === "not_connected") {
				setNote(result.message);
				setEnabled(item.id, true);
			} else if (result.pending) {
				setNote("Waiting for a connector grant. SLIeQwneB will retry in chat.");
				setEnabled(item.id, true);
			} else {
				setNote(result.message);
				setEnabled(item.id, true);
			}
		} catch {
			setNote("Could not verify this connector. It is still enabled for chat.");
			setEnabled(item.id, true);
		} finally {
			setBusy(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-3 rounded-[20px] border border-border bg-secondary/30 p-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PluginIcon, { icon: item.icon }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0 flex-1",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "truncate text-sm font-medium",
						children: item.name
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "truncate text-xs text-muted-foreground",
						children: item.description
					}),
					note ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-xs text-subtle",
						children: note
					}) : null,
					loginUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "mt-1 text-xs font-medium text-foreground underline underline-offset-2",
						onClick: () => redirectToLoginIfRequired({
							ok: false,
							data: null,
							loginRequired: true,
							loginUrl
						}),
						children: "Continue with Grok"
					}) : null
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				size: "pill",
				variant: enabled ? "secondary" : "default",
				disabled: busy,
				onClick: () => void onToggle(),
				className: cn(enabled && "text-success"),
				children: busy ? "Checking" : enabled ? "Added" : "Add"
			})
		]
	});
}
function SkillRow({ item }) {
	const enabled = useLumenStore((s) => s.enabledSkillIds.includes(item.id));
	const toggle = useLumenStore((s) => s.toggleSkill);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-3 rounded-[20px] border border-border bg-secondary/30 p-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PluginIcon, { icon: item.icon }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0 flex-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "truncate text-sm font-medium",
					children: item.name
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "truncate text-xs text-muted-foreground",
					children: item.description
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				size: "pill",
				variant: enabled ? "secondary" : "outline",
				onClick: () => toggle(item.id),
				disabled: item.alwaysOn,
				children: item.alwaysOn || enabled ? "On" : "Off"
			})
		]
	});
}
function CustomSkills() {
	const skills = useLumenStore((s) => s.customSkills);
	const remove = useLumenStore((s) => s.removeCustomSkill);
	if (skills.length === 0) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mb-2 text-[11px] font-medium uppercase tracking-[0.14em] text-subtle",
			children: "Personal"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "space-y-2",
			children: skills.map((skill) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-3 rounded-[20px] border border-border bg-secondary/30 p-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PluginIcon, { icon: "custom" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0 flex-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "truncate text-sm font-medium",
							children: skill.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "truncate text-xs text-muted-foreground",
							children: skill.description
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "pill",
						variant: "ghost",
						onClick: () => remove(skill.id),
						children: "Remove"
					})
				]
			}, skill.id))
		})]
	});
}
function NewSkillDialog({ open, onOpenChange }) {
	const add = useLumenStore((s) => s.addCustomSkill);
	const [name, setName] = (0, import_react.useState)("");
	const [description, setDescription] = (0, import_react.useState)("");
	const [instructions, setInstructions] = (0, import_react.useState)("");
	const save = () => {
		if (!name.trim() || !instructions.trim()) return;
		add({
			name: name.trim(),
			description: description.trim() || "Custom skill",
			instructions: instructions.trim()
		});
		setName("");
		setDescription("");
		setInstructions("");
		onOpenChange(false);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "p-0",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "New skill" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Skills are instruction recipes SLIeQwneB follows in chat. They never run arbitrary code." })] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-3 px-6 pb-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: name,
							onChange: (e) => setName(e.target.value),
							placeholder: "Name"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: description,
							onChange: (e) => setDescription(e.target.value),
							placeholder: "Short description"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							value: instructions,
							onChange: (e) => setInstructions(e.target.value),
							placeholder: "Instructions for SLIeQwneB",
							className: "min-h-32 w-full rounded-[var(--radius-md)] border border-input bg-secondary/40 px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/60"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogFooter, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					className: "w-full rounded-full",
					onClick: save,
					disabled: !name.trim() || !instructions.trim(),
					children: "Save skill"
				}) })
			]
		})
	});
}
function PuterAccount() {
	const { status, user, pending, signIn, signOut } = usePuterAuth();
	const signedIn = status === "signed_in" && user;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-2 rounded-[16px] border border-border bg-secondary/40 px-2 py-2",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "flex size-9 shrink-0 items-center justify-center rounded-[12px] border border-border bg-card",
				children: signedIn ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-xs font-medium uppercase",
					children: user.username.slice(0, 2)
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PuterMark, { className: "size-4 text-muted-foreground" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "min-w-0 flex-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "block truncate text-sm font-medium",
					children: signedIn ? user.username : "Guest"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "block truncate text-[11px] text-subtle",
					children: signedIn ? "Puter account" : "Sign in with Puter"
				})]
			}),
			signedIn ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				size: "icon",
				variant: "ghost",
				className: "size-10 shrink-0",
				onClick: () => void signOut(),
				"aria-label": "Sign out of Puter",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "size-4" })
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				size: "icon",
				variant: "ghost",
				className: "size-10 shrink-0",
				onClick: () => void signIn(),
				disabled: pending,
				"aria-label": "Sign in with Puter",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogIn, { className: "size-4" })
			})
		]
	});
}
var ScrollArea = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Root, {
	ref,
	className: cn("relative overflow-hidden", className),
	...props,
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Viewport, {
		className: "h-full w-full rounded-[inherit]",
		children
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scrollbar, {
		orientation: "vertical",
		className: "flex w-2.5 touch-none select-none border-l border-l-transparent p-px",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Thumb, { className: "relative flex-1 rounded-full bg-border" })
	})]
}));
ScrollArea.displayName = "ScrollArea";
function SidebarBody({ onOpenPlugins, onNavigate }) {
	const conversations = useLumenStore((s) => s.conversations);
	const activeId = useLumenStore((s) => s.activeId);
	const setActive = useLumenStore((s) => s.setActive);
	const create = useLumenStore((s) => s.newConversation);
	const remove = useLumenStore((s) => s.deleteConversation);
	const connectors = useLumenStore((s) => s.enabledConnectorIds.length);
	const skills = useLumenStore((s) => s.enabledSkillIds.length + s.customSkills.length);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-full flex-col bg-card",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2 px-4 pb-3 pt-[max(16px,env(safe-area-inset-top))]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppMark, { className: "size-7" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "truncate font-display text-lg leading-none",
						children: APP_SHORT_NAME
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[11px] text-subtle",
						children: APP_EDITION
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "px-3",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					className: "w-full justify-start rounded-full",
					variant: "secondary",
					onClick: () => {
						create();
						onNavigate?.();
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), "New chat"]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScrollArea, {
				className: "mt-3 flex-1 px-2",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-0.5 pb-4",
					children: conversations.map((convo) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: cn("group flex items-center gap-1 rounded-[14px] pr-1", convo.id === activeId ? "bg-secondary" : "hover:bg-secondary/60"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							className: "min-w-0 flex-1 px-3 py-2.5 text-left",
							onClick: () => {
								setActive(convo.id);
								onNavigate?.();
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "truncate text-sm",
								children: convo.title || "New chat"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "truncate text-[11px] text-subtle",
								children: relativeTime(convo.updatedAt)
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "rounded-[var(--radius-sm)] p-2 text-subtle opacity-0 hover:bg-background hover:text-foreground group-hover:opacity-100",
							"aria-label": "Delete chat",
							onClick: () => remove(convo.id),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-3.5" })
						})]
					}, convo.id))
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-2 border-t border-border p-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: onOpenPlugins,
					className: "flex w-full items-center gap-3 rounded-[16px] px-2 py-2 text-left hover:bg-secondary",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "flex size-9 items-center justify-center rounded-[12px] border border-border bg-secondary",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Puzzle, { className: "size-4" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block text-sm font-medium",
							children: "Plugins"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "block text-[11px] text-subtle tabular-nums",
							children: [
								connectors,
								" connectors · ",
								skills,
								" skills"
							]
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PuterAccount, {})]
			})
		]
	});
}
function MobileTopBar({ onOpenNav, onOpenPlugins }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center justify-between border-b border-border px-3 py-2 lg:hidden",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				size: "icon",
				variant: "ghost",
				className: "size-11",
				onClick: onOpenNav,
				"aria-label": "Open chats",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "size-5" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex min-w-0 items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppMark, { className: "size-5 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "truncate font-display text-base",
					children: APP_SHORT_NAME
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				size: "icon",
				variant: "ghost",
				className: "size-11",
				onClick: onOpenPlugins,
				"aria-label": "Plugins",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Puzzle, { className: "size-5" })
			})
		]
	});
}
var Sheet = Dialog$1;
var SheetContent = import_react.forwardRef(({ className, children, side = "left", ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogPortal$1, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay$1, { className: "fixed inset-0 z-50 bg-background/70 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent$1, {
	ref,
	className: cn("fixed z-50 flex h-full w-[min(88vw,320px)] flex-col border-border bg-card shadow-[var(--shadow-soft)] data-[state=open]:animate-in data-[state=closed]:animate-out", side === "left" ? "inset-y-0 left-0 border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left" : "inset-y-0 right-0 border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right", className),
	...props,
	children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogClose, {
		className: "absolute right-3 top-3 rounded-[var(--radius-sm)] p-2 text-muted-foreground hover:bg-secondary",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "sr-only",
			children: "Close"
		})]
	})]
})] }));
SheetContent.displayName = "SheetContent";
var TooltipProvider = Provider;
var TooltipContent = import_react.forwardRef(({ className, sideOffset = 6, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Portal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Content2, {
	ref,
	sideOffset,
	className: cn("z-50 overflow-hidden rounded-[var(--radius-sm)] border border-border bg-card px-2.5 py-1.5 text-xs text-foreground shadow-md", className),
	...props
}) }));
TooltipContent.displayName = "TooltipContent";
function Workspace() {
	const hydrated = useLumenStore((s) => s.hydrated);
	const conversations = useLumenStore((s) => s.conversations);
	const activeId = useLumenStore((s) => s.activeId);
	const newConversation = useLumenStore((s) => s.newConversation);
	const appendMessage = useLumenStore((s) => s.appendMessage);
	const enabledConnectorIds = useLumenStore((s) => s.enabledConnectorIds);
	const enabledSkillIds = useLumenStore((s) => s.enabledSkillIds);
	const customSkills = useLumenStore((s) => s.customSkills);
	const [pluginsOpen, setPluginsOpen] = (0, import_react.useState)(false);
	const [navOpen, setNavOpen] = (0, import_react.useState)(false);
	const [pending, setPending] = (0, import_react.useState)(false);
	const [banner, setBanner] = (0, import_react.useState)(null);
	const [loginUrl, setLoginUrl] = (0, import_react.useState)(null);
	const scroller = (0, import_react.useRef)(null);
	const convo = conversations.find((c) => c.id === activeId) ?? conversations[0];
	(0, import_react.useEffect)(() => {
		if (hydrated && conversations.length === 0) newConversation();
	}, [
		hydrated,
		conversations.length,
		newConversation
	]);
	(0, import_react.useEffect)(() => {
		const el = scroller.current;
		if (!el) return;
		el.scrollTo({
			top: el.scrollHeight,
			behavior: "smooth"
		});
	}, [convo?.messages.length, pending]);
	const send = async (text, files) => {
		let id = convo?.id;
		if (!id) id = newConversation();
		const userMsgId = uid("msg");
		appendMessage(id, {
			id: userMsgId,
			role: "user",
			content: text,
			createdAt: Date.now(),
			files: files.length ? files : void 0
		});
		setPending(true);
		setBanner(null);
		setLoginUrl(null);
		try {
			const result = await sendChat({ data: {
				messages: (useLumenStore.getState().conversations.find((c) => c.id === id)?.messages ?? []).filter((m) => m.role === "user" || m.role === "assistant").slice(-16).map((m) => ({
					role: m.role,
					content: m.content
				})),
				files,
				enabledConnectors: enabledConnectorIds,
				enabledSkills: enabledSkillIds,
				customSkills
			} });
			if (!result.ok) {
				if (result.loginRequired && result.loginUrl) setLoginUrl(result.loginUrl);
				appendMessage(id, {
					id: uid("msg"),
					role: "assistant",
					content: result.error,
					createdAt: Date.now()
				});
				setBanner(result.error);
				return;
			}
			appendMessage(id, {
				id: uid("msg"),
				role: "assistant",
				content: result.content,
				createdAt: Date.now(),
				artifacts: result.artifacts.length ? result.artifacts : void 0,
				traces: result.traces.length ? result.traces : void 0
			});
		} catch (err) {
			appendMessage(id, {
				id: uid("msg"),
				role: "assistant",
				content: err instanceof Error ? err.message : "Something went wrong.",
				createdAt: Date.now()
			});
		} finally {
			setPending(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TooltipProvider, {
		delayDuration: 200,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex h-[100dvh] bg-background",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("aside", {
					className: "hidden w-[280px] shrink-0 border-r border-border lg:block",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SidebarBody, { onOpenPlugins: () => setPluginsOpen(true) })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sheet, {
					open: navOpen,
					onOpenChange: setNavOpen,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetContent, {
						side: "left",
						className: "p-0",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SidebarBody, {
							onOpenPlugins: () => {
								setNavOpen(false);
								setPluginsOpen(true);
							},
							onNavigate: () => setNavOpen(false)
						})
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
					className: "flex min-w-0 flex-1 flex-col",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MobileTopBar, {
							onOpenNav: () => setNavOpen(true),
							onOpenPlugins: () => setPluginsOpen(true)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							ref: scroller,
							className: "lumen-scroll flex-1 overflow-y-auto",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChatThread, {
								messages: convo?.messages ?? [],
								pending,
								onSuggestion: (prompt) => void send(prompt, [])
							})
						}),
						banner || loginUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mx-auto w-full max-w-3xl px-4 pb-2 text-center text-xs text-muted-foreground",
							children: [banner, loginUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "ml-2 font-medium text-foreground underline underline-offset-2",
								onClick: () => redirectToLoginIfRequired({
									ok: false,
									data: null,
									loginRequired: true,
									loginUrl
								}),
								children: "Continue with Grok"
							}) : null]
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Composer, {
							disabled: pending,
							onSend: (text, files) => void send(text, files),
							onOpenPlugins: () => setPluginsOpen(true)
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PluginsDialog, {
					open: pluginsOpen,
					onOpenChange: setPluginsOpen
				})
			]
		})
	});
}
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PuterAuthProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PuterGate, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Workspace, {}) }) });
}
//#endregion
export { Home as component };
