import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { d as renderTemplate, h as maybeRenderHead, i as renderComponent } from "./server_KckvLxmH.mjs";
import { t as createComponent } from "./compiler_Bfh0C4ka.mjs";
import { t as $$Layout } from "./Layout_CKloBz4G.mjs";
//#region src/pages/users/dashboard/index.astro
var dashboard_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Index,
	file: () => $$file,
	url: () => $$url
});
var $$Index = createComponent(($$result, $$props, $$slots) => {
	return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Users Dashboard" }, { "default": ($$result) => renderTemplate`${maybeRenderHead($$result)}<h1>Users Dashboard</h1>` })}`;
}, "C:/Users/user/Documents/GitHub/fresh/src/pages/users/dashboard/index.astro", void 0);
var $$file = "C:/Users/user/Documents/GitHub/fresh/src/pages/users/dashboard/index.astro";
var $$url = "/users/dashboard";
//#endregion
//#region \0virtual:astro:page:src/pages/users/dashboard/index@_@astro
var page = () => dashboard_exports;
//#endregion
export { page };
