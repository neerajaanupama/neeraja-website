# Anupama — anupama.cc

The personal brand site of **Neeraja Anupama** and her Bharatanatyam practice, **Anupama Nrithyalaya** (nṛtya "dance" + ālaya "home": a home for dance). To rename it, search for "Nrithyalaya" in `index.html`, `dance/index.html` and `assets/js/dance.js`.

Static HTML, CSS and JS. There's no build step and no framework, and it runs on GitHub Pages as it is.

```
index.html              ← Anupama: hero, About, Work, Writing, Contact
dance/index.html        ← Anupama Nrithyalaya: classes, on stage, vision, registration
assets/
├── css/style.css       ← the whole design system (colours, type, spacing, motion in :root)
├── js/script.js        ← shared: intro reveal, name interaction, nav, lightbox
├── js/dance-data.js    ← ✏️ cohorts + form settings — the file you edit
├── js/dance.js         ← renders cohorts, validates + submits the enquiry form
├── img/                ← design covers, film posters, favicon
└── docs/               ← writing PDFs + résumé
```

## Preview locally

```bash
python3 -m http.server 8080   # then open http://localhost:8080
```

## Managing cohorts

Everything lives in `assets/js/dance-data.js`.

1. Copy the template object inside `cohorts: [ … ]`, once for each cohort.
2. Give it a unique `id` and a `title`, and set `published: true`.
3. Fill in only what's confirmed. Any field left as `""` is simply not shown, so the page never displays an empty "Fee" or a made-up start date.
4. Set `status` to `"open"`, `"soon"` or `"full"`. Each one gets its own label and button wording.

When no cohort is published, the page shows an honest **"Opening soon — register your interest"** state. Each cohort automatically appears in the form's "Preferred class" dropdown, and its Enquire button pre-selects it. You can also link straight to a cohort with `/dance/?cohort=<id>#register`.

## Making registration live (needs one setting)

GitHub Pages can't receive form submissions on its own, so the form posts to a form service. **Until one is connected**, the form validates as usual and then opens the visitor's email app with the enquiry already filled in. It says clearly that nothing is sent until they press send, and it never shows a false "received" message.

To go live, choose **one** of these:

- **Formspree** (simplest): create a free form at formspree.io and verify `neerajaanupama8@gmail.com`. Then set
  `formEndpoint: "https://formspree.io/f/xxxxxxx"` in `dance-data.js`.
- **Web3Forms**: get an access key at web3forms.com, then set
  `formEndpoint: "https://api.web3forms.com/submit"` and `formExtraFields: { access_key: "YOUR_KEY" }`.

Once that's done, the button reads **Send enquiry**. The "Thank you — we've got it" message appears **only** after the service confirms receipt. On a failure the visitor sees an error with the email address as a fallback. Each submission includes a readable `summary` field, and a honeypot field (`_gotcha`) filters out basic spam bots.

No payments are taken and no seats are confirmed. The form is for enquiries only.

## Domain: anupama.cc

1. At the domain registrar, point `anupama.cc` at GitHub Pages: A records `185.199.108.153`, `.109.153`, `.110.153`, `.111.153`, plus a `www` CNAME to `neerajaanupama.github.io`.
2. In the repo, go to **Settings → Pages → Custom domain**, enter `anupama.cc` and enable **Enforce HTTPS**. GitHub adds the `CNAME` file itself.

All links are relative, so the site works both at `/neeraja-website/` and at the root of the domain.

## Still to confirm or supply

- **Pronunciation and meaning.** The hero shows `/ uh·noo·puh·maa /` and *Sanskrit अनुपमा, an- "without" + upamā "comparison"* → *incomparable*. This is the standard etymology, but Neeraja should confirm the pronunciation she uses (`index.html`, hero `.def-pron`).
- **Portrait.** Add `assets/img/portrait.jpg` and uncomment the `<img class="portrait">` in the About section.
- **Dance photography.** There are no dance photos yet, so the dance page is built from typography alone, on purpose. Authentic photos can go in the hero or the On stage section later. Please don't use stock images presented as the school.
- **Class details.** Style, ages, schedule, venue, fee and start date for the first cohorts (see `dance-data.js`).
- **Film links.** Each film currently links to the Makkala Jagriti YouTube channel. Swap in each video's own URL.

## Design system, briefly

- **Colour:** aged-newsprint `--paper` (with a fine CSS grain, no image files), printer's-ink `--ink`, and a single vermilion `--accent`, used sparingly.
- **Type:** Instrument Serif (display) with Inter (text), from Google Fonts.
- **Layout:** a 12-column grid. Every section is a small numbered label on the left with content on the right, separated by thin rules.
- **Motion:** one easing curve and three durations. Content is fully visible without JavaScript, and everything is static under `prefers-reduced-motion`.

To grow the site (more styles, instructors, workshops, timetables), add sections that follow the same `section → grid → sec-label + sec-body` pattern. New cohorts only need a data entry.
