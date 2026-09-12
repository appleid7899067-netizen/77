const PUTER_SRC = "https://js.puter.com/v2/";
const AUTH_TIMEOUT_MS = 12_000;

export type PuterUser = {
  uuid: string;
  username: string;
  email_confirmed?: boolean;
  is_temp?: boolean;
};

type PuterAuthApi = {
  signIn: (options?: { attempt_temp_user_creation?: boolean; request_auth?: boolean }) => Promise<unknown>;
  signOut: () => void | Promise<void>;
  isSignedIn: () => boolean;
  getUser: () => Promise<PuterUser>;
};

type PuterKvApi = {
  set: (key: string, value: unknown) => Promise<boolean | unknown>;
  get: (key: string) => Promise<unknown>;
  del: (key: string) => Promise<boolean | unknown>;
};

type PuterAIChat = (
  prompt: string | Array<{ role: string; content: string }>,
  options?: Record<string, unknown>,
) => Promise<unknown>;

type PuterAI = {
  chat: PuterAIChat;
  listModels: (provider?: string | null) => Promise<unknown[]>;
  listModelProviders?: () => Promise<string[]>;
};

export type PuterSDK = {
  auth: PuterAuthApi;
  kv?: PuterKvApi;
  ai: PuterAI;
};

declare global {
  interface Window {
    puter?: PuterSDK;
  }
}

let loadPromise: Promise<PuterSDK> | null = null;

function waitForAuth(timeoutMs = AUTH_TIMEOUT_MS): Promise<PuterSDK> {
  return new Promise((resolve, reject) => {
    const start = Date.now();
    const tick = () => {
      if (window.puter?.auth) {
        resolve(window.puter);
        return;
      }
      if (Date.now() - start > timeoutMs) {
        reject(new Error("Puter loaded but authentication is not ready."));
        return;
      }
      window.setTimeout(tick, 40);
    };
    tick();
  });
}

export function loadPuter(): Promise<PuterSDK> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Puter is only available in the browser."));
  }
  if (window.puter?.auth) return Promise.resolve(window.puter);
  if (loadPromise) return loadPromise;

  loadPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(`script[data-puter-sdk="v2"]`);
    const ready = () => {
      waitForAuth()
        .then(resolve)
        .catch((err) => {
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
      reject(new Error("Could not reach Puter. Check your connection, then try again."));
    };
    document.head.appendChild(script);
  });

  return loadPromise;
}

export function getPuter(): PuterSDK | null {
  return typeof window === "undefined" ? null : (window.puter ?? null);
}

export async function getPuterKv(puter: PuterSDK, timeoutMs = 4_000): Promise<PuterKvApi> {
  if (puter.kv) return puter.kv;
  const start = Date.now();
  return new Promise((resolve, reject) => {
    const tick = () => {
      if (window.puter?.kv) {
        resolve(window.puter.kv);
        return;
      }
      if (Date.now() - start > timeoutMs) {
        reject(new Error("Puter storage is not available yet."));
        return;
      }
      window.setTimeout(tick, 40);
    };
    tick();
  });
}

export function puterErrorMessage(err: unknown): string {
  if (err && typeof err === "object") {
    const record = err as { msg?: unknown; message?: unknown; error?: unknown };
    if (typeof record.msg === "string" && record.msg.trim()) return record.msg;
    if (typeof record.message === "string" && record.message.trim()) return record.message;
    if (typeof record.error === "string" && record.error.trim()) return record.error;
  }
  if (err instanceof Error && err.message.trim()) return err.message;
  return "Sign-in was cancelled or blocked. Allow popups for this site, then try again.";
}
