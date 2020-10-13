# format-chromium-histogram

Chromium-based browsers expose ASCII histogram visualizations through `about://histograms`, rendered by internal C++ code.

These histograms can also be [accessed](https://chromedevtools.github.io/devtools-protocol/tot/Browser/#method-getHistogram) through the Chrome DevTools Protocol, but only as a raw JSON structure.
It's difficult to visualize these, especially when compared to the graphs available on `about://histograms`.

This repository contains a simple NodeJS re-implementation of Chromium's C++ histogram rendering so that collected histogram data can be used for analysis outside of the browser.

## Usage

See [`print-histogram.js`](/print-histogram.js) for sample usage.
