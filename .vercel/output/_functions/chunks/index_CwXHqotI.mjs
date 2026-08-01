import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { _ as addAttribute, d as renderTemplate, h as maybeRenderHead, i as renderComponent } from "./server_KckvLxmH.mjs";
import { t as createComponent } from "./compiler_Bfh0C4ka.mjs";
import { t as renderScript } from "./script_Co1K4xW7.mjs";
import { t as $$Layout } from "./Layout_CKloBz4G.mjs";
/* empty css                 */
//#region src/pages/index.astro
var pages_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Index,
	file: () => $$file,
	url: () => ""
});
var $$Index = createComponent(async ($$result, $$props, $$slots) => {
	const posts = await (await fetch("https://amcd.com.au/amcdwp/wp-json/wp/v2/posts")).json();
	const categories = [...new Set(posts.flatMap((post) => post.category_terms?.map((term) => term.name) ?? []))];
	return renderTemplate`${maybeRenderHead($$result)}<div class="mb-6"></div>${renderComponent($$result, "Layout", $$Layout, { "title": "Dinos!" }, { "default": ($$result) => renderTemplate`<div class="grid grid-cols-1 md:grid-cols-3 gap-6" style="background:red"><div class="bg-blue-100 p-4" style="background:orange"><input id="search-posts" type="text" placeholder="Search posts..." class="w-full max-w-md px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"></div><div class="bg-green-100 p-4 col-span-2"><!-- Filter Buttons --><div class="flex flex-wrap gap-3"><button class="filter-btn px-4 py-2 rounded-lg bg-blue-600 text-white transition" data-category="all">All</button>${categories.map((category) => renderTemplate`<button class="filter-btn px-4 py-2 rounded-lg bg-slate-200 hover:bg-slate-300 transition"${addAttribute(category, "data-category")}>${category}</button>`)}</div></div></div><section><h1>List of Posts</h1><div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">${posts.map((post) => {
		const limitedExcerpt = post.excerpt.rendered.replace(/<\/?[^>]+(>|$)/g, "").split(" ").slice(0, 12).join(" ") + "...";
		const categories = post.category_terms?.map((term) => term.name) ?? [];
		return renderTemplate`<a${addAttribute(`/blog/${post.slug}/`, "href")} class="post-card"${addAttribute(categories.join(","), "data-categories")}${addAttribute(post.title.rendered.toLowerCase(), "data-title")}><div class="p-6 bg-white rounded-xl shadow-sm border border-slate-200"><img${addAttribute(post.featured_image_url, "src")} alt="Beach" class="w-full h-auto object-cover"><h2 class="text-xl font-bold text-slate-900 h-15 mt-4">${post.title.rendered}</h2><p>${categories.join(", ")}</p><!-- Rendered text is now perfectly limited and safe --><p class="mt-2 text-slate-600 text-sm leading-relaxed">${limitedExcerpt}</p></div></a>`;
	})}</div>${renderScript($$result, "C:/Users/user/Documents/GitHub/fresh/src/pages/index.astro?astro&type=script&index=0&lang.ts")}<button class="inline-block cursor-pointer rounded-md bg-gray-800 px-4 py-3 text-center text-sm font-semibold uppercase text-white transition duration-200 ease-in-out hover:bg-gray-900">Button</button></section>` })}`;
}, "C:/Users/user/Documents/GitHub/fresh/src/pages/index.astro", void 0);
var $$file = "C:/Users/user/Documents/GitHub/fresh/src/pages/index.astro";
//#endregion
//#region \0virtual:astro:page:src/pages/index@_@astro
var page = () => pages_exports;
//#endregion
export { page };
