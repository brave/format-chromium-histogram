const fs = require('fs');
const WriteAscii = require('.');

const filename = process.argv[2];
if (filename === undefined) {
  console.error('Usage: node print-histogram.js HISTOGRAMFILE');
  console.error('HISTOGRAMFILE should be a path to a JSON file containing a `Browser.Histogram` object,');
  console.error('as returned by the `Browser.getHistogram` method of the Chrome DevTools Protocol.');
  console.error('More information: https://chromedevtools.github.io/devtools-protocol/tot/Browser/#method-getHistogram');
  process.exit(-1);
}

const histogramdata = JSON.parse(fs.readFileSync(filename, 'utf8')).histogram;

console.log(WriteAscii(histogramdata));
