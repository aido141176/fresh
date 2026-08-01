import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { _ as addAttribute, d as renderTemplate, h as maybeRenderHead, i as renderComponent } from "./server_KckvLxmH.mjs";
import { t as createComponent } from "./compiler_Bfh0C4ka.mjs";
import { t as $$Layout } from "./Layout_CKloBz4G.mjs";
/* empty css                 */
//#region src/pages/rooms/index.astro
var rooms_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Index,
	file: () => $$file,
	url: () => $$url
});
var $$Index = createComponent(async ($$result, $$props, $$slots) => {
	const rooms = await (await fetch("https://amcd.com.au/amcdwp/wp-json/wp/v2/rooms")).json();
	return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Rooms" }, { "default": ($$result) => renderTemplate`${maybeRenderHead($$result)}<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">${rooms.map((room) => {
		return renderTemplate`<a${addAttribute(`/rooms/${room.slug}/`, "href")} class="post-card"${addAttribute(room.name, "data-title")}><div class="p-6 bg-white rounded-xl shadow-sm border border-slate-200"><h2 class="text-xl font-bold text-slate-900 h-15 mt-4">hello${room.name}</h2></div></a>`;
	})}</div>` })}`;
}, "C:/Users/user/Documents/GitHub/fresh/src/pages/rooms/index.astro", void 0);
var $$file = "C:/Users/user/Documents/GitHub/fresh/src/pages/rooms/index.astro";
var $$url = "/rooms";
//#endregion
//#region \0virtual:astro:page:src/pages/rooms/index@_@astro
var page = () => rooms_exports;
//#endregion
export { page };
