// The Columbian — branded login gate
// Replaces the plain browser Basic-Auth popup with a styled page that matches
// the building's own cream / rust / ink palette, while still doing a real
// server-side password check before anything else is served.

const PASSWORD = "Columbian1941!";
const COOKIE_NAME = "tc_auth";
const COOKIE_VALUE = "f3c1b7-columbian-owner-9a7e2d";
const MAX_AGE = 60 * 60 * 24 * 30; // 30 days

export default async (request, context) => {
  const url = new URL(request.url);

  const hasValidCookie = () => {
    const cookie = request.headers.get("cookie") || "";
    return cookie
      .split(";")
      .map((c) => c.trim())
      .includes(`${COOKIE_NAME}=${COOKIE_VALUE}`);
  };

  if (request.method === "POST") {
    let password = "";
    try {
      const form = await request.formData();
      password = (form.get("password") || "").toString();
    } catch (e) {
      password = "";
    }

    if (password === PASSWORD) {
      const headers = new Headers();
      headers.set("location", url.pathname + url.search || "/");
      headers.append(
        "set-cookie",
        `${COOKIE_NAME}=${COOKIE_VALUE}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${MAX_AGE}`
      );
      return new Response(null, { status: 302, headers });
    }
    return new Response(loginPage(true), {
      status: 401,
      headers: { "content-type": "text/html; charset=utf-8" },
    });
  }

  if (hasValidCookie()) {
    return context.next();
  }

  return new Response(loginPage(false), {
    status: 401,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
};

function loginPage(error) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>The Columbian — Owner Portal</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,380..560;1,9..144,380..560&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet">
<style>
  :root{
    --bg:#F7F2E9; --bg-card:#FFFDF8; --bg-raised:#EFE7D8;
    --ink:#211D1A; --ink-soft:#5B5349; --ink-faint:#948C7E;
    --rust:#B2542E; --rust-dark:#8C3F20;
    --line:rgba(33,29,26,0.14);
    --shadow:0 20px 44px -24px rgba(33,20,10,0.35);
  }
  *{ box-sizing:border-box; }
  html,body{ height:100%; margin:0; }
  body{
    background:var(--bg); color:var(--ink);
    font-family:'IBM Plex Mono', monospace;
    display:flex; align-items:center; justify-content:center;
    padding:24px;
  }
  .card{
    background:var(--bg-card); border:1px solid var(--line); border-radius:16px;
    box-shadow:var(--shadow); padding:44px 40px 36px; width:100%; max-width:380px;
    text-align:center;
  }
  .mark{
    width:52px; height:52px; border-radius:13px; background:var(--ink);
    display:flex; align-items:center; justify-content:center; margin:0 auto 22px;
  }
  .mark svg{ display:block; }
  .wordmark{
    font-family:'Fraunces', serif; font-style:italic; font-weight:380;
    display:flex; align-items:baseline; justify-content:center; line-height:1;
  }
  .wordmark .big{ font-size:38px; font-weight:560; color:var(--rust); letter-spacing:-0.5px; }
  .wordmark .small{ font-size:19px; margin:0 1px; }
  .sub{
    margin:10px 0 30px; font-size:10.5px; letter-spacing:1.8px; text-transform:uppercase;
    color:var(--ink-faint);
  }
  form{ display:flex; flex-direction:column; gap:12px; }
  label{ text-align:left; font-size:10px; letter-spacing:1.5px; text-transform:uppercase; color:var(--ink-faint); }
  input[type="password"]{
    font-family:'IBM Plex Mono', monospace; font-size:15px; padding:13px 14px;
    border-radius:8px; border:1px solid var(--line); background:var(--bg);
    color:var(--ink); width:100%;
  }
  input[type="password"]:focus{ outline:2px solid var(--rust); outline-offset:1px; border-color:transparent; }
  button{
    margin-top:6px; font-family:'IBM Plex Mono', monospace; font-weight:500; font-size:13px;
    letter-spacing:1px; text-transform:uppercase; padding:14px 16px; border-radius:30px;
    border:0; background:var(--rust); color:#FFF7EE; cursor:pointer; transition:background .15s ease;
  }
  button:hover{ background:var(--rust-dark); }
  .error{
    font-family:'IBM Plex Mono', monospace; font-size:11.5px; color:var(--rust-dark);
    background:#F5E2DE; border-radius:8px; padding:9px 12px; margin:-2px 0 2px;
  }
  .foot{ margin-top:26px; font-size:10px; color:var(--ink-faint); letter-spacing:0.5px; }
</style>
</head>
<body>
  <div class="card">
    <div class="mark">
      <svg viewBox="0 0 34 34" width="34" height="34" role="img" aria-hidden="true">
        <text x="5" y="24" font-family="Fraunces, serif" font-style="italic" font-weight="560" font-size="18" fill="#E3A47B">T</text>
        <text x="16" y="24" font-family="Fraunces, serif" font-style="italic" font-weight="560" font-size="15.5" fill="#FFF9F0">C</text>
      </svg>
    </div>
    <div class="wordmark"><span class="big">T</span><span class="small">he</span>&nbsp;<span class="big">C</span><span class="small">olumbian</span></div>
    <div class="sub">Owner Portal</div>
    <form method="POST">
      ${error ? '<div class="error">Wrong password — try again.</div>' : ""}
      <label for="pw">Password</label>
      <input id="pw" name="password" type="password" autocomplete="current-password" autofocus required>
      <button type="submit">Enter →</button>
    </form>
    <div class="foot">1941 Columbia St. &middot; Financials &amp; Capital Ledger</div>
  </div>
</body>
</html>`;
}
