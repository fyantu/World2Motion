# World2Motion project page

**World2Motion: Turning Video World Models into 3D Human Motion Generators**

Paper: https://arxiv.org/abs/2609.37004

A static research homepage for GitHub Pages, with a black background and white typography. Its four main sections are Overview, Method, Comparison and Results. It includes the overview film, method diagram and three contributions, the complete Table 2, three comparison metrics, eight comparison methods, ten result examples, and a centered Citation section. The existing experimental supplement remains in its own folder. All 128 video files, including the two cover encodes, are stored locally. The page has no external script, font, or stylesheet dependencies.

The qualitative comparison switches among box, chair and sofa interactions and uses two rows of four methods on desktop. The five motion-only methods show one player each; MiniMax-H3 + CameraHMR, CoMoVi and World2Motion each combine synchronized motion and RGB in one viewport. A draggable divider reveals either full frame, supports keyboard arrows/Home/End, and moves slowly during playback until manually adjusted. Each method has playback controls, and the whole comparison can be played, paused or resumed together. Switching cases pauses and releases the previous players. Results shows ten examples with the same divider and pair controls. Table 2 and the three contributions follow the arXiv v2 submission source. Ablation studies and failure cases are not shown or linked on the homepage.

The cover adds a single looping 4×4 montage of 16 selected cases. The tiles meet edge to edge without borders, gutters or label rows. Each tile uses a continuously sliding boundary to reveal RGB video on the left and 3D motion on the right, at matching source timestamps. The divider takes 15.125 seconds for one cycle, three times longer than the earlier cover; source actions keep their original speed. Desktop and mobile encodes share the same content. Selection details are in `assets/cover-cases.json`. The cover autoplays silently and pauses offscreen. Reduced-motion preferences disable automatic playback. The author block has the only Paper link, styled as a rounded button. The settled title uses a responsive font size matching the reference, with a 144px cap. Chapter headings are centered with whitespace between sections; Citation uses a rounded BibTeX panel. The footer credits SolarWM as the template inspiration.

The September 30 selection replaces row 1, column 3 with a red-plaid-shirt character turning and sitting, row 3, column 1 with a burgundy-dress character lifting a plastic box, and row 4, column 2 with a linen-shirt character approaching a chair and sitting. Row 3, column 3 retains the original stepping-over-a-box case. The two new pairs come from existing generated interaction test results. Their colored SMPL-X renderings use the method's smoothed pose parameters and keep dashed objects fixed at the first frame.

## Publish

The intended repository is `fyantu/World2Motion-Web`. Put this folder's contents at the root of its `main` branch. In **Settings → Pages**, select **Deploy from a branch**, then **main** and **/(root)**. The `.nojekyll` file disables Jekyll processing. No build step or package installation is needed.

Project URL after deployment: `https://fyantu.github.io/World2Motion-Web/`

GitHub's guide: https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site

## Edit

- `index.html`: paper information, authors, result table and citation.
- `style.css`: black-and-white desktop and mobile presentation.
- `app.js`: cover playback, section navigation and citation copying.
- `comparison-viewer.js`: case selection and individual/all-method playback controls.
- `wipe-player.js`: shared synchronized RGB/motion viewport and draggable divider.
- `results-viewer.js`, `assets/results.js`: ten selected result pairs.
- `assets/comparison.js`: three cases and their eight methods, referencing existing supplement media.
- `assets/playback.js`: synchronized play, pause, resume and seeking.
- `supplementary/index.html`: full gallery with ablation, comparisons and failure cases.
- `supplementary/media/`: experiment MP4 files.

The displayed external resource links currently point only to arXiv. Code and model release links have not been added.

For local viewing, open `index.html`, or serve this directory with a static HTTP server. Keep the complete directory structure intact. The supplementary page also works offline.

## Sources

Paper content and figures: World2Motion, arXiv:2609.37004, with the author's latest local source files. Videos: the author's existing experimental supplement. Homepage layout was inspired by SolarWM (https://junchao-cs.github.io/SolarWM-Web/); this implementation uses World2Motion's own media and new HTML/CSS/JavaScript.

## Scroll opening

The homepage opens with a black region on the left, video on the right, and a small centered title. The black region is the magnified gap between the 2 and M in World2Motion. Native scrolling zooms out the same vector wordmark: its edge moves right and the surrounding letters become visible, filled with the video wall. The wordmark then becomes white as the paper title, authors and resource buttons appear. Scroll upward to reverse the sequence. No wheel or touch events are intercepted.

`intro.css` handles the full-screen sticky stage; `intro.js` maps scroll position to an SVG outline mask and the credits. One vector path, outlined from Arial Bold, is shared by the cutout and solid wordmark so their geometry stays aligned across browsers. The same video plays continuously behind every stage. Reduced-motion users see the final cover without the scrolling transition or video autoplay. A JavaScript-free fallback shows the poster and paper details.
