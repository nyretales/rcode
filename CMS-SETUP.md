# R•CODE CMS — Integrated Package

## Contents
- `rcode-main/` — static R•CODE website with Code Library and Prompt Library loading from the public Cloudflare Worker endpoints.
- `rcode-main/admin.html` — private admin dashboard entry page (login required).
- `rcode-main/assets/admin-cms.js` and `admin-cms.css` — CMS interface.
- `worker.js` — updated Cloudflare Worker source.

## Important: deploy the Worker update once
The current Prompt Library JSON is larger than 1 MB. The previous `/api/github/read` implementation used GitHub's JSON Contents response, which may not return the full content for large files. This package includes an updated Worker read route using GitHub's raw media type. It also validates catalog JSON and limits CMS writes to:
- `data/code-library.json`
- `data/prompt-library.json`

Replace the complete Cloudflare Worker script with the included `worker.js`, then Deploy. Keep existing secrets and KV binding; do not recreate them.

## Website deployment
Upload the contents of `rcode-main/` to the existing `nyretales/rcode` repository, preserving the existing root structure, then let Vercel deploy.

## Admin
Open `https://YOUR-RCODE-DOMAIN/admin.html`.
Sign in with the existing `ADMIN_PASSWORD` secret. The session token is held in `sessionStorage`, not localStorage. The dashboard can:
- Load both catalogs from the private CMS repository.
- Search and select catalog entries.
- Edit individual records as JSON.
- Add and delete entries.
- Import/export catalog JSON.
- Save the catalog to the private repository through the authenticated Worker API.

## Safety
The admin page is not linked from public navigation and is marked noindex, but the real protection is server-side authentication. Do not share the admin password or Worker secrets. The CMS currently has a single admin password; add rate limiting before treating it as hardened for production.
