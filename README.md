# wovenwoofs.com

Static site for Woven Woofs. GitHub Pages + Cloudflare. No build step — push and it deploys.

## What's here

- `index.html` — hero (today's drop reveal + countdown), stitched ticker, trust strip, thread-draw divider, the Vault (drop archive), about, footer
- `styles.css` — stitch-first design system: Baloo 2 display + Work Sans body, one dashed-stitch motif, one fabric grain (inline SVG, low opacity), collector cards with patch-lift hover, `prefers-reduced-motion` support
- `app.js` — drop data + rendering. **To add a drop:** copy an entry in `DROPS`, bump the number, point `image` at the new file. Newest first. The hero, ticker, Vault, and countdown all read from this list automatically.
- `images/` — drop artwork. `drop-001.jpg`, `drop-002.jpg` seeded.
- `images/hero-NNN.mp4` — **not yet added.** Drop the Midjourney ambient loop here (muted, looping), named for the current drop number, e.g. `images/hero-002.mp4`. The hero `<video>` falls back to the drop's still poster when the file is absent.
- `CNAME` — custom domain for GitHub Pages (`wovenwoofs.com`). Do not remove.

## Collecting

Each card (and the hero) has a Collect button, saved per device in `localStorage` (`wovenwoofs.collection.v1`) — no accounts. The buttons are label-driven on purpose: to sell later, swap the label to "Buy" and point at checkout; no redesign needed.

## Deploy

1. **GitHub:** repo `robertbonds-sys/wovenwoofs.com`, push to `main`, Settings → Pages → Deploy from branch → `main` / root.
2. **Cloudflare:** `wovenwoofs.com` (free plan), nameservers at registrar → Cloudflare's pair. DNS:
   - `A` `@` → `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153` (GitHub Pages)
   - `CNAME` `www` → `wovenwoofs.com`
   - SSL/TLS mode: Full (strict works once Pages serves the cert; start with Full)
3. Wait for DNS + GitHub's certificate (usually minutes, sometimes an hour). `https://wovenwoofs.com` should serve this page.

## Animation notes

- Hero video: keep it ambient (a blink, mane shifting, light on stitching). Muted + `playsinline` so it autoplays on iOS.
- Signature motions: stitched marquee ticker + thread-draw divider on scroll. Sparse on purpose — no motion salad.
- Card hovers and scroll reveals are pure CSS/IntersectionObserver; `prefers-reduced-motion` disables them.
