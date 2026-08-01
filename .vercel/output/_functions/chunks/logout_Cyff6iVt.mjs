import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
//#region src/pages/api/logout.js
var logout_exports = /* @__PURE__ */ __exportAll({ POST: () => POST });
var POST = async ({ cookies }) => {
	cookies.delete("wp_jwt_token", { path: "/" });
	return new Response(JSON.stringify({ success: true }), { status: 200 });
};
//#endregion
//#region \0virtual:astro:page:src/pages/api/logout@_@js
var page = () => logout_exports;
//#endregion
export { page };
