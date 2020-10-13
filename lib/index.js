// These implementations are derived from Chromium's base/metrics/histogram.cc
// and base/metrics/histogram_base.cc. See LICENSE.chromium for more details.

// HistogramBase::WriteAsciiBucketGraph
function WriteAsciiBucketGraph(current_size, max_size) {
  let output = '';

  const k_line_length = 72;  // Maximal horizontal width of graph.
  let x_count = Math.round((k_line_length * (current_size / max_size) + 0.5));
  let x_remainder = k_line_length - x_count;

  while (0 < x_count--) {
    output += '-';
  }
  output += 'O';
  while (0 < x_remainder--) {
    output += ' ';
  }

  return output;
}

// HistogramBase::WriteAsciiBucketValue
function WriteAsciiBucketValue(current, scaled_sum) {
  return ' (' + current + ' = ' + (current / scaled_sum).toFixed(1) + '%)';
}

// Histogram::WriteAsciiHeader
function WriteAsciiHeader(histogram) {
  return ('Histogram: ' + histogram.name + ' recorded ' + histogram.count + ' samples, mean = ' + (histogram.sum / histogram.count).toFixed(1));
}

// Histogram::GetPeakBucketSize
function GetPeakBucketSize(histogram) {
  let max = 0;
  for(let i = 0; i < histogram.buckets.length; ++i) {
    const current_size = GetBucketSize(histogram, i);
    if (current_size > max) {
      max = current_size;
    }
  }
  return max;
}

// Histogram::WriteAsciiBucketContext
function WriteAsciiBucketContext(past, current, remaining, i) {
  let output = '';

  const scaled_sum = (past + current + remaining) / 100.0;
  output += WriteAsciiBucketValue(current, scaled_sum);
  if (0 < i) {
    const percentage = past / scaled_sum;
    output += ' {' + percentage.toFixed(1) + '%}';
  }

  return output;
}

// Histogram::GetBucketSize
function GetBucketSize(histogram, i) {
  const kTransitionWidth = 5;
  let denominator = histogram.buckets[i].high - histogram.buckets[i].low;
  if (denominator > kTransitionWidth) {
    denominator = kTransitionWidth;  // Stop trying to normalize.
  }
  return histogram.buckets[i].count / denominator;
}

// Histogram::WriteAsciiBody
function WriteAsciiBody(histogram, graph_it, newline) {
  let output = '';

  const sample_count = histogram.count;

  // Prepare to normalize graphical rendering of bucket contents.
  let max_size = 0;
  if (graph_it) {
    max_size = GetPeakBucketSize(histogram);
  }
 
  // Calculate space needed to print bucket range numbers. Leave room to print
  // nearly the largest bucket range without sliding over the histogram.
  let largest_non_empty_bucket = histogram.buckets.length - 1;
  while (0 === histogram.buckets[largest_non_empty_bucket].count) {
    if (0 === largest_non_empty_bucket) {
      break;  // All buckets are empty.
    }
    --largest_non_empty_bucket;
  }
 
  // Calculate largest print width needed for any of our bucket range displays.
  let print_width = 1;
  for(let i = 0; i < histogram.buckets.length; ++i) {
    if (histogram.buckets[i].count !== 0) {
      const width = ('' + histogram.buckets[i].low).length + 1;
      if (width > print_width) {
        print_width = width;
      }
    }
  }
  
  let remaining = histogram.count;
  let past = 0;
  // Output the actual histogram graph.
  for (let i = 0; i < histogram.buckets.length; ++i) {
    const current = histogram.buckets[i].count;
    if (current === 0) {
      continue;
    }
    remaining -= current;
    let range = '' + histogram.buckets[i].low;
    output += range;
    for (let j = 0; range.length + j < print_width + 1; ++j) {
      output += ' ';
    }
    if (0 === current && i < histogram.buckets.length - 1 &&
        0 === histogram.buckets[i + 1].count) {
      while (i < histogram.buckets.length - 1 && 0 == histogram.buckets[i + 1].count) {
        ++i;
      }
      output += '... ';
      output += newline;
      continue;  // No reason to plot emptiness.
    }
    const current_size = GetBucketSize(histogram, i);
    if (graph_it) {
      output += WriteAsciiBucketGraph(current_size, max_size);
    }
    output += WriteAsciiBucketContext(past, current, remaining, i);
    output += newline;
    past += current;
  }

  return output;
}

// Histogram::WriteAscii
function WriteAscii(histogram) {
  let output = '';

  output += WriteAsciiHeader(histogram);
  output += '\n';
  output += WriteAsciiBody(histogram, true, '\n');

  return output;
}

module.exports = WriteAscii;
