# Piyush H. Kadethankar · personal website

Three files make up the site, plus a folder for photos:

| File | What it holds |
| --- | --- |
| `index.html` | All the text. Each section is marked with a comment such as `<!-- ===== JOURNEY ===== -->`. |
| `styles.css` | Colours, fonts and layout. Colours are set once at the top in `:root` and repeated for dark mode just below. |
| `script.js` | The moving network in the hero, the zoomable map, timeline filters, theme switch and copy buttons. You rarely need to touch it. |
| `photos/` | Put your pictures here. |

## Preview while editing

Open `index.html` in a browser, or in VS Code install the **Live Server** extension, right-click `index.html` and choose **Open with Live Server**. The page reloads every time you save.

## Common edits

**Portrait.** Save a portrait as `photos/portrait.jpg` (roughly 4:5, at least 800 px wide). Until it exists, a "PHK" monogram shows instead.

**Photos under "Outside research".** Inside `<div class="gallery" id="gallery"></div>`, add one line per photo, in any number:

```html
<figure class="snap"><img src="photos/riding.jpg" alt="Riding in Manchester" loading="lazy"><figcaption>Optional caption</figcaption></figure>
```

Leave the gallery empty and only the text block shows.

**A new timeline entry.** Copy any `<li class="stop">` in the timeline and edit it. Keep the newest at the top.
- `data-type`: `research`, `education`, `leadership` or `recognition`. This sets the colour and the filter.
- `data-place`: `paithan`, `aurangabad`, `nanded`, `bangkok` or `manchester`. Leave it out if the place is not on the map.
- Add a `<li class="yr" aria-hidden="true"><span>2027</span></li>` line above the first entry of a new year.

**A newly accepted paper.** In the Publications section, copy one `<li class="ref">` block, paste the APA 7 reference into `<p class="cite">`, and set the year in `<span class="yr-n">`.

**Map notes.** The note shown when hovering a place is in that place's `data-note="..."` on its `<g class="pin">` inside the map. Do not edit the one very long `<path class="land" d="...">` line; it is the coastline.

## Publishing

Upload all files, keeping the `photos` folder, to the GitHub repository described in the hosting guide. `index.html` must stay at the top level.
