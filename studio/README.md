# Nova Studio website

The public website for Nova Studio by Code The Web: screens of the app, what it does, and a **Book a demo** form.
Plain HTML, CSS and JavaScript — no build step. Open `index.html` in a browser to see it.

## Files

| File | What it is |
|---|---|
| `index.html` | All the text and sections of the page |
| `css/style.css` | Colours, fonts, layout, animations (colours are at the top, in `:root`) |
| `js/main.js` | The hero T-bar animation, the screens gallery, the demo form |
| `img/` | Screenshots (`.webp`), favicon, `og.jpg` (picture shown when the link is shared) |
| `fonts/` | Archivo font (free licence, `OFL-Archivo.txt`) |

## Common changes

- **Text**: edit `index.html`.
- **Phone / WhatsApp number or email for bookings**: top of `js/main.js` (`WHATSAPP`, `EMAIL`), and the contact lines in `index.html`.
- **Screens in the gallery**: the `SCREENS` list in `js/main.js` — file name (in `img/`, without `.webp`), short name, caption.
- **New screenshot**: save it as `.webp` (or `.png` and change the extension in the code) in `img/`.
- **Colours**: `:root` at the top of `css/style.css` (`--orange`, `--room` …).

## How the demo form works

The form needs no server. **Book on WhatsApp** opens WhatsApp with all the details typed in, to 0551918658;
**Send by email** opens the email app addressed to officialcodetheweb@gmail.com. The visitor presses Send.

## Publishing

The site is published with GitHub Pages: push changes to the `main` branch and the site updates in a minute or two.
