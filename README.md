# World2Motion project page

**World2Motion: Turning Video World Models into 3D Human Motion Generators**

Paper: https://arxiv.org/abs/2609.37004

A static research homepage for GitHub Pages. It includes the project overview film, method diagram, eight paired examples, quantitative results, citation, and the complete experimental video supplement. All 122 video files are stored locally. The page has no external script, font, or stylesheet dependencies.

The cover adds a single looping 4×4 montage of 16 selected cases. Each tile uses a continuously sliding boundary to reveal RGB video on the left and 3D motion on the right, at matching source timestamps. Desktop and mobile encodes share the same content. Selection details are in `assets/cover-cases.json`. The cover autoplays silently, pauses offscreen, and has a pause/resume button. Reduced-motion preferences disable automatic playback.

## Publish

The intended repository is `fyantu/World2Motion-Web`. Put this folder's contents at the root of its `main` branch. In **Settings → Pages**, select **Deploy from a branch**, then **main** and **/(root)**. The `.nojekyll` file disables Jekyll processing. No build step or package installation is needed.

Project URL after deployment: `https://fyantu.github.io/World2Motion-Web/`

GitHub's guide: https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site

## Edit

- `index.html`: paper information, authors, result table and citation.
- `style.css`: desktop and mobile presentation.
- `app.js`: cover playback, example categories and citation copying.
- `assets/gallery.js`: selected video–motion pairs.
- `assets/playback.js`: synchronized play, pause, resume and seeking.
- `supplementary/index.html`: full gallery with ablation, comparisons and failure cases.
- `supplementary/media/`: experiment MP4 files.

The displayed external resource links currently point only to arXiv. Code and model release links have not been added.

For local viewing, open `index.html`, or serve this directory with a static HTTP server. Keep the complete directory structure intact. The supplementary page also works offline.

## Sources

Paper content and figures: World2Motion, arXiv:2609.37004, with the author's latest local source files. Videos: the author's existing experimental supplement. Homepage layout was inspired by SolarWM (https://junchao-cs.github.io/SolarWM-Web/); this implementation uses World2Motion's own media and new HTML/CSS/JavaScript.

## Scroll opening

The homepage opens on the 16-case video wall with a black panel on the right and a small centered title. Native scrolling moves the panel edge right, reveals a large video-filled wordmark, then brings in the solid white title, paper title, authors and resource buttons. Scroll upward to reverse the sequence. No wheel or touch events are intercepted.

`intro.css` handles the full-screen sticky stage; `intro.js` maps scroll position to an SVG text mask and the credits. The same video plays continuously behind every stage. Reduced-motion users see the final cover without the scrolling transition or video autoplay. A JavaScript-free fallback shows the poster and paper details.
