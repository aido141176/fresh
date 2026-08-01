import { E as createAstro, _ as addAttribute, c as renderSlot, d as renderTemplate, g as renderHead } from "./server_KckvLxmH.mjs";
import { t as createComponent } from "./compiler_Bfh0C4ka.mjs";
//#region src/layouts/Layout.astro
createAstro("https://astro.build");
var $$Layout = createComponent(($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Layout;
	return renderTemplate`<html lang="en" data-astro-cid-ju4pidww><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><link rel="icon" type="image/svg+xml" href="/favicon.svg"><link rel="icon" href="/favicon.ico"><meta name="generator"${addAttribute(Astro.generator, "content")}><title>Astro Basics</title>${renderHead($$result)}</head><body class="bg-slate-50 text-slate-900 antialiased min-h-screen" data-astro-cid-ju4pidww><!-- Standard Responsive Wrapper Container --><div id="main-wrapper" class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8" data-astro-cid-ju4pidww><!-- This is where your page content will be injected -->${renderSlot($$result, $$slots["default"])}</div>  <!-- Clos Wrapper Container --></body></html>`;
}, "C:/Users/user/Documents/GitHub/fresh/src/layouts/Layout.astro", void 0);
//#endregion
export { $$Layout as t };
