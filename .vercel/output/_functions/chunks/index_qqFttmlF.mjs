import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { _ as addAttribute, d as renderTemplate, h as maybeRenderHead, i as renderComponent } from "./server_KckvLxmH.mjs";
import { t as createComponent } from "./compiler_Bfh0C4ka.mjs";
import { t as $$Layout } from "./Layout_CKloBz4G.mjs";
/* empty css                 */
//#region src/pages/people/index.astro
var people_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Index,
	file: () => $$file,
	url: () => $$url
});
var $$Index = createComponent(async ($$result, $$props, $$slots) => {
	const users = await (await fetch("https://amcd.com.au/amcdwp/wp-json/wp/v2/users")).json();
	return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Users" }, { "default": ($$result) => renderTemplate`${maybeRenderHead($$result)}<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">${users.map((user) => {
		return renderTemplate`<a${addAttribute(`/people/${user.slug}/`, "href")} class="post-card"${addAttribute(user.name.toLowerCase(), "data-title")}><div class="p-6 bg-white rounded-xl shadow-sm border border-slate-200"><h2 class="text-xl font-bold text-slate-900 h-15 mt-4">hello${user.name}</h2><img${addAttribute(user.acf.profile_image.sizes.profile_thumbnail, "src")} alt="Descriptive alt text"></div></a>`;
	})}</div>` })}`;
}, "C:/Users/user/Documents/GitHub/fresh/src/pages/people/index.astro", void 0);
var $$file = "C:/Users/user/Documents/GitHub/fresh/src/pages/people/index.astro";
var $$url = "/people";
//#endregion
//#region \0virtual:astro:page:src/pages/people/index@_@astro
var page = () => people_exports;
//#endregion
export { page };
