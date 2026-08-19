const COOKIE_NAME = "vntold_access";

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    /*
      LOGIN REQUEST
    */
    if (url.pathname === "/api/login" && request.method === "POST") {
      return handleLogin(request, env);
    }

    /*
      LOGOUT
    */
    if (url.pathname === "/logout") {
      return new Response(null, {
        status: 302,
        headers: {
          Location: "/",
          "Set-Cookie": `${COOKIE_NAME}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`,
        },
      });
    }

    /*
      PROTECT THE PRIVATE WEBSITE
    */
    if (url.pathname === "/studio" || url.pathname.startsWith("/studio/")) {
      const authenticated = await isAuthenticated(request, env);

      if (!authenticated) {
        return Response.redirect(new URL("/", request.url), 302);
      }
    }

    /*
      SERVE NORMAL STATIC FILES
    */
    return env.ASSETS.fetch(request);
  },
};

async function handleLogin(request, env) {
  let body;

  try {
    body = await request.json();
  } catch {
    return Response.json({ success: false }, { status: 400 });
  }

  const submittedPassword = body.password || "";

  if (!env.SITE_PASSWORD || !env.AUTH_SECRET) {
    return Response.json(
      {
        success: false,
        message: "Server authentication is not configured.",
      },
      { status: 500 },
    );
  }

  if (!timingSafeEqual(submittedPassword, env.SITE_PASSWORD)) {
    return Response.json(
      {
        success: false,
        message: "Incorrect password.",
      },
      { status: 401 },
    );
  }

  const token = await createToken(env.AUTH_SECRET);

  return new Response(
    JSON.stringify({
      success: true,
    }),
    {
      status: 200,

      headers: {
        "Content-Type": "application/json",

        "Set-Cookie":
          `${COOKIE_NAME}=${token}; ` +
          `Path=/; ` +
          `HttpOnly; ` +
          `Secure; ` +
          `SameSite=Lax; ` +
          `Max-Age=604800`,
      },
    },
  );
}

async function isAuthenticated(request, env) {
  if (!env.AUTH_SECRET) return false;

  const cookieHeader = request.headers.get("Cookie") || "";

  const cookies = Object.fromEntries(
    cookieHeader
      .split(";")
      .map((cookie) => cookie.trim())
      .filter(Boolean)
      .map((cookie) => {
        const index = cookie.indexOf("=");

        return [cookie.slice(0, index), cookie.slice(index + 1)];
      }),
  );

  const token = cookies[COOKIE_NAME];

  if (!token) return false;

  const expected = await createToken(env.AUTH_SECRET);

  return timingSafeEqual(token, expected);
}

async function createToken(secret) {
  const encoder = new TextEncoder();

  const data = encoder.encode("vntold-private-access");

  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    {
      name: "HMAC",
      hash: "SHA-256",
    },
    false,
    ["sign"],
  );

  const signature = await crypto.subtle.sign("HMAC", key, data);

  return [...new Uint8Array(signature)]
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

function timingSafeEqual(a, b) {
  if (typeof a !== "string" || typeof b !== "string" || a.length !== b.length) {
    return false;
  }

  let result = 0;

  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }

  return result === 0;
}
