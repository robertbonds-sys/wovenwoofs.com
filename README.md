# wovenwoofs.com

Static site for Woven Woofs. GitHub Pages + Cloudflare. No build step — push and it deploys.

## What's here

- `index.html` — hero (ambient video slot), drop grid, about, footer
- `styles.css` — heritage-calm theme, patch-lift hovers, scroll reveals, hero sheen
- `app.js` — drop data + rendering. **To add a drop:** copy an entry in `DROPS`, bump the number, point `image` at the new file. Newest first.
- `images/` — drop artwork. `drop-001.jpg`, `drop-002.png` seeded.
- `images/hero-001.mp4` — **not yet added.** Drop the Midjourney ambient loop here (muted, looping). The hero `<video>` falls back to the `drop-001.jpg` poster when the file is absent.
- `CNAME` — custom domain for GitHub Pages (`wovenwoofs.com`).

## Deploy

1. **GitHub:** create a repo (e.g. `wovenwoofs/wovenwoofs.com`), push this folder's contents to `main`, then Settings → Pages → Deploy from branch → `main` / root.
2. **Cloudflare:** add `wovenwoofs.com` (free plan), set the nameservers at the registrar to Cloudflare's pair. In Cloudflare DNS add:
   - `A` `@` → `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153` (GitHub Pages)
   - `CNAME` `www` → `wovenwoofs.com`
   - SSL/TLS mode: Full (strict works once Pages serves the cert; start with Full)
3. Wait for DNS + GitHub's certificate (usually minutes, sometimes an hour). `https://wovenwoofs.com` should serve this page.

## Animation notes

- Hero video: keep it ambient (a blink, mane shifting, light on stitching). Muted + `playsinline` so it autoplays on iOS.
- Card hovers and scroll reveals are pure CSS/IntersectionObserver; `prefers-reduced-motion` disables them.
