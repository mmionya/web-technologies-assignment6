# Assignment 6

Zhumazhan Miras, IT-2512.

A simple HTML, CSS, and jQuery project. No package installation is required.

## Running the Project

Open `index.html` in a browser to run Task 2 with effects. The Task 1 link opens the basic version with selectors.

If needed, start a local server:

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000.

## Files

- `data.js` — rooms and the 21 guests from the reference image.
- `cases.js` — 20 jQuery chains for finding DOM elements.
- `app.js` — page rendering, highlighting, the guest dialog, moving guests, and sorting.
- `style.css` — simple styling without CSS animations or transitions.
- `task1/index.html` — the basic version, which reuses the shared files.
- `vendor/` and `avatars/` — local copies of jQuery and the avatars, so the project runs without an internet connection.
- `output/pdf/` — the submission report, kept locally and excluded from this repository.
- `report/` — screenshots, jQuery chains, and the report generation script (requires Python and ReportLab), kept locally and excluded from this repository.

The page is rebuilt before each case. Guest moves are stored in the array until Reset party is clicked. Changes made by cases 18 and 19 remain visible only until the next case. Clear restores brightness, and Reset party restores the original party layout.

## Browser Checks

Checked all 20 cases; Clear after case 3; closing the dialog with Esc; switching between guests; moving Arman to the balcony and searching after the move; sorting the living room in both directions; and clicking the sort button five more times.

The result of case 20 is Zarina: first floor, 21:10, crumbs without a cup, next to Daniel (AITU).

## Sources

- jQuery 3.7.1, MIT: https://jquery.com/
- DiceBear Adventurer, Lisa Wischofsky, CC BY 4.0: https://www.dicebear.com/styles/adventurer/
  License: https://creativecommons.org/licenses/by/4.0/

Repository: https://github.com/mmionya/web-technologies-assignment6

The repository link is included in the report. The PDF report and screenshots are kept locally and are not uploaded to GitHub. Before submitting, review the report wording and make sure you understand the jQuery chains for the assignment presentation.
