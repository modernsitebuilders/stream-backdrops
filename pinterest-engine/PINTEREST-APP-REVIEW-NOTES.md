# Pinterest App Review — why the demo video keeps getting rejected

**Read this before scripting or filming another app-review video.** The demo
video has been rejected multiple times (here and in RemodelCalculators) for the
SAME flaw. `DEMO-VIDEO-SCRIPT.md` in this folder is the flawed script — do not
re-shoot it as-is.

## Pinterest's actual requirement (verbatim)

> "denied due to an incomplete demo video. The demo video must show the complete
> Pinterest user authentication flow and demonstrate API usage (**not just UI
> widgets**)."

Two parts, both mandatory:

1. **OAuth flow, visibly** — Pinterest **login** page → the **"Give access"**
   consent screen → redirect back to the redirect_uri with **`?code=` visible in
   the URL bar** → the code being **exchanged for an access token**.
2. **Integration + results** — create a pin via the API, then **display the newly
   created pin ON the Pinterest platform**: open `https://www.pinterest.com/pin/<id>/`
   and show it live.

## The flaw we kept making

The video "created" a pin, then for proof showed **the source image PNG hosted on
our own domain** and/or a terminal `✅ PIN CREATED` log. **Neither is
Pinterest-side proof** — it reads as exactly the "just UI widgets" they reject.
This folder's own `DEMO-VIDEO-SCRIPT.md` even quotes an earlier rejection saying
"**also display the newly created Pin**" — and we still didn't show it on
Pinterest.

Compounding mistakes: pin created in `--sandbox` (**sandbox pins never appear on
pinterest.com**); ~20s of our own website UI before any API call; the custom
`oauth-server.js` hid the `?code=` / token exchange.

## Do this instead

- **End the pin shot on the real pin at `https://www.pinterest.com/pin/<id>/`** —
  never a local PNG or terminal checkmark.
- **Publish to production, not sandbox.** An OAuth-obtained token carries
  `pins:write` even under Trial / "Production Limited" access, so a real pin can go
  to the owner's own account and be shown live. Verify write works before filming.
- Show the raw redirect URL with `?code=` and the token exchange, not just a
  masked success page.
- Keep own-site UI footage minimal.

## Also required (non-video)

Privacy policy must state: (1) uses the Pinterest API, **not endorsed by/affiliated
with Pinterest**; (2) what happens to Pinterest-derived data on disconnect (deleted);
(3) no reselling/redistributing Pinterest content or data; (4) a **contact email**
in the policy text.
