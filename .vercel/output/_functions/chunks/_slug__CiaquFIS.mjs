import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { E as createAstro, _ as addAttribute, a as Fragment, d as renderTemplate, h as maybeRenderHead, i as renderComponent, w as unescapeHTML } from "./server_KckvLxmH.mjs";
import { t as createComponent } from "./compiler_Bfh0C4ka.mjs";
import { t as $$Layout } from "./Layout_CKloBz4G.mjs";
//#region src/pages/blog/[slug].astro
var _slug__exports = /* @__PURE__ */ __exportAll({
	default: () => $$Slug,
	file: () => $$file,
	getStaticPaths: () => getStaticPaths,
	url: () => $$url
});
createAstro("https://astro.build");
async function getStaticPaths() {
	return (await (await fetch("https://amcd.com.au/amcdwp/wp-json/wp/v2/posts")).json()).map((post) => ({
		params: { slug: post.slug },
		props: { post }
	}));
}
var $$Slug = createComponent(async ($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Slug;
	const { slug } = Astro.params;
	let [post] = await (await fetch(`https://amcd.com.au/amcdwp/wp-json/wp/v2/posts?slug=${slug}`)).json();
	return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": post.title.rendered }, { "default": ($$result) => renderTemplate`${maybeRenderHead($$result)}<article><img${addAttribute(post.featured_image_url_full, "src")} alt="A descriptive alt text"><h1>${unescapeHTML(post.title.rendered)}</h1>${renderComponent($$result, "Fragment", Fragment, {}, { "default": async ($$result) => renderTemplate`${unescapeHTML(post.content.rendered)}` })}</article>` })}`;
}, "C:/Users/user/Documents/GitHub/fresh/src/pages/blog/[slug].astro", void 0);
var $$file = "C:/Users/user/Documents/GitHub/fresh/src/pages/blog/[slug].astro";
var $$url = "/blog/[slug]";
//#endregion
//#region \0virtual:astro:page:src/pages/blog/[slug]@_@astro
var page = () => _slug__exports;
//#endregion
export { page };
