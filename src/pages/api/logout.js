// src/pages/api/logout.js
export const POST = async ({ cookies }) => {
  cookies.delete('wp_jwt_token', { path: '/' });
  return new Response(JSON.stringify({ success: true }), { status: 200 });
};
