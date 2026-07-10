# Neeraja Anupama — Portfolio

A warm, playful, single-page portfolio site. Static HTML/CSS/JS — no build step, no framework. Ready for GitHub Pages, and easy to grow into a flat-file CMS later.

## Structure

```
site/
├── index.html            ← all the content lives here
├── assets/
│   ├── css/style.css     ← all styling (colours, type, layout)
│   ├── js/script.js      ← nav, scroll animations, image lightbox
│   ├── img/
│   │   ├── design/       ← report & manual cover thumbnails (JPG)
│   │   └── films/        ← film poster thumbnails (JPG)
│   └── docs/             ← the writing PDFs + résumé that the site links to
└── README.md
```

Everything is self-contained. The only external request is Google Fonts (Fraunces + Inter).

## Preview locally

Open `index.html` directly in a browser, **or** run a tiny server (nicer, avoids any file:// quirks):

```bash
cd site
python3 -m http.server 8080
# then visit http://localhost:8080
```

## Deploy to GitHub Pages

1. Create a repo (e.g. `neeraja-portfolio`) and push **the contents of this `site/` folder** to the repo root.
2. In the repo: **Settings → Pages → Build and deployment → Source: Deploy from a branch**, pick `main` and `/ (root)`, Save.
3. Your site goes live at `https://<username>.github.io/<repo>/` in a minute or two.
4. (Optional) Add a custom domain in the same Pages settings.

> Tip: the writing PDFs total ~5 MB and are fine to commit. The **film videos are not included** — they're large, so the film cards link out to the Makkala Jagriti YouTube channel for now (see below).

## Editing — the common changes

Everything is plain HTML with clear comments (`<!-- ===== SECTION ===== -->`). Search `index.html` for the text you want to change.

- **Swap a film link:** each film card is an `<a class="cell" href="...">`. Replace the YouTube channel URL with the specific video URL.
- **Add / edit a writing piece:** copy one `<a class="wrow">…</a>` block in the Writing section; point `href` at a PDF in `assets/docs/` or a Medium URL.
- **Add a portfolio image to the bento:** drop a JPG in `assets/img/…`, copy a `<div class="cell" data-full="…">…</div>` block, update the `src`, `data-full`, and caption.
- **Change a stat / number:** edit the `.side-tile` and `.cell.note` blocks (About + Work).
- **Add a portrait photo:** there isn't one yet — a good spot is the About section. Happy to wire it in.
- **Colours & fonts:** all defined once at the top of `style.css` under `:root` (`--sun`, `--tomato`, `--blue`, `--green`, `--pink`, `--plum`, etc.).

## Regenerating thumbnails (macOS)

Covers/posters were generated from the source PDFs and films with Quick Look:

```bash
qlmanage -t -s 1400 -o /tmp "cover.pdf"
sips -s format jpeg /tmp/cover.pdf.png --out assets/img/design/name.jpg
```

## Later: flat-file CMS

The markup is intentionally repetitive and content-first, so moving to something like **Kirby**, **Publii**, or a simple JSON/Markdown-driven build is straightforward when you're ready — the sections map cleanly to “collections” (writing, films, design, events).
