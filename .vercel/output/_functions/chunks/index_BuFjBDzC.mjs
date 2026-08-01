import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { E as createAstro, d as renderTemplate, h as maybeRenderHead, i as renderComponent } from "./server_KckvLxmH.mjs";
import { t as createComponent } from "./compiler_Bfh0C4ka.mjs";
import { t as renderScript } from "./script_Co1K4xW7.mjs";
import { t as $$Layout } from "./Layout_CKloBz4G.mjs";
//#region src/pages/users/index.astro
var users_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Index,
	file: () => $$file,
	url: () => $$url
});
createAstro("https://astro.build");
var $$Index = createComponent(async ($$result, $$props, $$slots) => {
	const Astro = $$result.createAstro($$props, $$slots);
	Astro.self = $$Index;
	const token = Astro.cookies.get("wp_jwt_token")?.value;
	let userProfile = null;
	if (token) {
		const response = await fetch("https://amcd.com.au/amcdwp/", { headers: { "Authorization": `Bearer ${token}` } });
		if (response.ok) userProfile = await response.json();
		else Astro.cookies.delete("wp_jwt_token", { path: "/" });
	}
	return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Users" }, { "default": async ($$result) => renderTemplate`${maybeRenderHead($$result)}<h1>Log in page that will redirect to the users dashboard if token detected</h1><div class="max-w-md mx-auto bg-white rounded-xl shadow-md border border-slate-100 p-6 mt-12">${userProfile ? renderTemplate`<div><h2 class="text-xl font-bold text-slate-800">Welcome Back, ${userProfile.name}!</h2><p class="text-slate-500 text-sm mt-1">Logged in securely via headless WordPress.</p><div class="mt-6 p-4 bg-slate-50 rounded-lg border border-slate-100 font-mono text-xs text-slate-600 space-y-2"><p><strong>Username:</strong> ${userProfile.slug}</p><p><strong>User ID:</strong> ${userProfile.id}</p></div><button id="logout-btn" class="w-full mt-6 h-11 bg-slate-200 hover:bg-slate-300 text-slate-700 font-medium rounded-lg transition-all">Sign Out Safely</button></div>` : renderTemplate`<div><h2 class="text-xl font-bold text-slate-800">Sign In to Your Account</h2><p class="text-slate-500 text-sm mt-1">Access your flatmate dashboard and profile settings.</p><div id="error-alert" class="hidden mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-xs font-medium text-red-600"></div><form id="login-form" class="space-y-4 mt-6"><div><label class="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Email or Username</label><input type="text" id="username" required class="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"></div><div><label class="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Password</label><input type="password" id="password" required class="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"></div><button type="submit" class="w-full h-11 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-sm transition-all mt-2">Authenticate Session</button></form></div>`}</div>${renderScript($$result, "C:/Users/user/Documents/GitHub/fresh/src/pages/users/index.astro?astro&type=script&index=0&lang.ts")}` })}`;
}, "C:/Users/user/Documents/GitHub/fresh/src/pages/users/index.astro", void 0);
var $$file = "C:/Users/user/Documents/GitHub/fresh/src/pages/users/index.astro";
var $$url = "/users";
//#endregion
//#region \0virtual:astro:page:src/pages/users/index@_@astro
var page = () => users_exports;
//#endregion
export { page };
