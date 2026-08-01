import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { E as createAstro, _ as addAttribute, d as renderTemplate, h as maybeRenderHead, i as renderComponent } from "./server_KckvLxmH.mjs";
import { t as createComponent } from "./compiler_Bfh0C4ka.mjs";
import { t as $$Layout } from "./Layout_CKloBz4G.mjs";
//#region src/pages/people/[slug].astro
var _slug__exports = /* @__PURE__ */ __exportAll({
	default: () => $$Slug,
	file: () => $$file,
	getStaticPaths: () => getStaticPaths,
	url: () => $$url
});
createAstro("https://astro.build");
async function getStaticPaths() {
	return (await (await fetch("https://amcd.com.au/amcdwp/wp-json/wp/v2/users")).json()).map((user) => ({
		params: { slug: user.slug },
		props: { user }
	}));
}
var $$Slug = createComponent(async ($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Slug;
	const { slug } = Astro.params;
	let [user] = await (await fetch(`https://amcd.com.au/amcdwp/wp-json/wp/v2/users?slug=${slug}`)).json();
	return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": user.name }, { "default": ($$result) => renderTemplate`${maybeRenderHead($$result)}<div class="p-6 bg-white rounded-xl shadow-sm border border-slate-200"><h2 class="text-xl font-bold text-slate-900 h-15 mt-4">${user.name}</h2><img${addAttribute(user.acf.profile_image.sizes.profile_thumbnail, "src")} alt="Descriptive alt text"></div>` })}`;
}, "C:/Users/user/Documents/GitHub/fresh/src/pages/people/[slug].astro", void 0);
var $$file = "C:/Users/user/Documents/GitHub/fresh/src/pages/people/[slug].astro";
var $$url = "/people/[slug]";
//#endregion
//#region \0virtual:astro:page:src/pages/people/[slug]@_@astro
var page = () => _slug__exports;
//#endregion
export { page };
