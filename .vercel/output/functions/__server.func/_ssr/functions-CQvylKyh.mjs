import { t as createServerFn } from "./ssr.mjs";
import { t as createServerRpc } from "./createServerRpc-A6pJPYTF.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/functions-CQvylKyh.js
var sendChat_createServerFn_handler = createServerRpc({
	id: "d274ec0f9124d332f8d9327bbe73dc02de64bd05136443affd1df98f813b845a",
	name: "sendChat",
	filename: "src/lib/agent/functions.ts"
}, (opts) => sendChat.__executeServer(opts));
var sendChat = createServerFn({ method: "POST" }).validator((input) => input).handler(sendChat_createServerFn_handler, async ({ data }) => {
	const { runChat } = await import("./runtime.server-BrmrTJ8k.mjs");
	return runChat(data);
});
var probeConnectorFn_createServerFn_handler = createServerRpc({
	id: "6c6295efd7c3c134f692dd4e9ddbd4f10f1893663df0a28b2112d0ba345decd9",
	name: "probeConnectorFn",
	filename: "src/lib/agent/functions.ts"
}, (opts) => probeConnectorFn.__executeServer(opts));
var probeConnectorFn = createServerFn({ method: "POST" }).validator((input) => input).handler(probeConnectorFn_createServerFn_handler, async ({ data }) => {
	const { probeConnector } = await import("./runtime.server-BrmrTJ8k.mjs");
	return probeConnector(data.connectorId);
});
//#endregion
export { probeConnectorFn_createServerFn_handler, sendChat_createServerFn_handler };
