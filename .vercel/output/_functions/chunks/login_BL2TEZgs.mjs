import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
//#region src/pages/api/login.js
var login_exports = /* @__PURE__ */ __exportAll({ POST: () => POST });
var POST = async ({ request, cookies }) => {
	try {
		const body = await request.json().catch(() => null);
		if (!body || !body.username || !body.password) return new Response(JSON.stringify({ error: "Payload configuration invalid" }), { status: 400 });
		const { username, password } = body;
		const wpResponse = await fetch("https://amcd.com.au/amcdwp", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"Accept": "application/json",
				"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"
			},
			body: JSON.stringify({
				username,
				password
			})
		});
		const rawText = await wpResponse.text();
		console.log("RAW WORDPRESS BACKEND RESPONSE:", rawText);
		let data = null;
		try {
			data = JSON.parse(rawText);
		} catch (e) {
			return new Response(JSON.stringify({
				error: "WordPress sent back non-JSON text output.",
				details: rawText.substring(0, 150)
			}), { status: 502 });
		}
		if (!wpResponse.ok || data.data?.status === 403) return new Response(JSON.stringify({ error: data.message || "Invalid username or password credentials." }), { status: 401 });
		if (data && data.token) {
			cookies.set("wp_jwt_token", data.token, {
				path: "/",
				httpOnly: true,
				secure: true,
				sameSite: "strict",
				maxAge: 604800
			});
			return new Response(JSON.stringify({
				success: true,
				user: data.user_display_name
			}), { status: 200 });
		}
		return new Response(JSON.stringify({ error: "Authentication payload missing token key parameter." }), { status: 500 });
	} catch (err) {
		return new Response(JSON.stringify({
			error: "Vercel Serverless Function Crash Exception",
			details: err.message
		}), { status: 500 });
	}
};
//#endregion
//#region \0virtual:astro:page:src/pages/api/login@_@js
var page = () => login_exports;
//#endregion
export { page };
