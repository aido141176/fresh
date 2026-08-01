// src/pages/api/login.js
export const POST = async ({ request, cookies }) => {
  try {
    const body = await request.json().catch(() => null);
    if (!body || !body.username || !body.password) {
      return new Response(JSON.stringify({ error: 'Payload configuration invalid' }), { status: 400 });
    }

    const { username, password } = body;
    const wpTargetEndpoint = 'https://amcd.com.au';

    const wpResponse = await fetch(wpTargetEndpoint, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ username, password }),
    });

    // Extract the response as raw text first to prevent JSON parsing crashes
    const rawTextResponse = await wpResponse.text();
    console.log("RAW WORDPRESS BACKEND RESPONSE STRING:", rawTextResponse);

    // Attempt to safely parse the string into a JSON object
    let data = null;
    try {
      data = JSON.parse(rawTextResponse);
    } catch (e) {
      return new Response(JSON.stringify({ 
        error: 'WordPress sent back non-JSON text output.', 
        details: rawTextResponse.substring(0, 200) 
      }), { status: 502 });
    }

    // Check if the response contains the token
    if (wpResponse.ok && data && data.token) {
      cookies.set('wp_jwt_token', data.token, {
        path: '/',
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 7
      });
      return new Response(JSON.stringify({ success: true, user: data.user_display_name }), { status: 200 });
    }

    // If it hit 200 but lacks a token key, display the payload keys
    return new Response(JSON.stringify({ 
      error: `WordPress responded with 200 OK but missed token key. Keys present: ${data ? Object.keys(data).join(', ') : 'none'}` 
    }), { status: 200 });

  } catch (err) {
    return new Response(JSON.stringify({ 
      error: 'Serverless Runtime Exception', 
      details: err.message 
    }), { status: 500 });
  }
};
