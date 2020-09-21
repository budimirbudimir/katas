// NOTE Using command line param, instead of dynamic require() for simplicity

const get_lines_as_array = require('./loc').get_lines_as_array;

const numbersMap = [
  ' _ | ||_|   ',
  '     |  |   ',
  ' _  _||_    ',
  ' _  _| _|   ',
  '   |_|  |   ',
  ' _ |_  _|   ',
  ' _ |_ |_|   ',
  ' _   |  |   ',
  ' _ |_||_|   ',
  ' _ |_| _|   '
]


// Main OCR recognition function (for single character)
const getOCR = (asciiNumber) => {
  const lines = asciiNumber.split('\n')
  const chars = lines.map(line => line.match(/.{3}/g)).filter(line => line != null)
  const transposed = transpose(chars)
  const charArray = transposed.map(chars => numbersMap.indexOf(chars.join('')))
  return charArray[0]
}

// Transpose single character
function transpose(rows) {
  const temp = [];

  for (let r = 0; r < rows.length; ++r) {
    for (let c = 0; c < rows[r].length; ++c) {
      if (!temp[c]) temp[c] = [];

      temp[c][r] = rows[r][c];
    }
  }

  return temp;
}

// Make sure we got a filename passed from the command line
if (process.argv.length < 3) {
  console.log('Usage: node ' + process.argv[1] + ' FILENAME');
  process.exit(1);
}

// Read the file
var fs = require('fs');
var filename = process.argv[2];
fs.readFile(filename, 'utf8', function(err, data) {
  if (err) throw err;
  console.log('Loaded source file: ' + filename);

  // Clean invalid lines
  const lines = get_lines_as_array(data)
  const clean_lines = lines.filter(l => l !== '')

  // Define aggregators for loops
  let temp_rows = []
  let temp_lines = []

  // Split into rows
  for (let i = 0; i < clean_lines.length; i++) {
    temp_lines.push(clean_lines[i])

    // On every third row
    if ((i + 1) % 3 === 0) {
      temp_rows.push([...temp_lines])
      temp_lines = []
    }
  }

  // Split into rows
  let mapped_rows = []
  for(let x = 0; x < temp_rows.length; x++) {
    mapped_rows[x] = ''

    // Split into characters
    for(let y = 0; y < temp_rows[x][0].length / 3; y++) {
      // TODO Using dirty hack with whitespace, should be removed
      const digit = `
${temp_rows[x][0].slice(y * 3, y * 3 + 3) }
${temp_rows[x][1].slice(y * 3, y * 3 + 3) } 
${temp_rows[x][2].slice(y * 3, y * 3 + 3) } 
      `

      // Generate rows from individual OCR recognitions
      mapped_rows[x] += getOCR(digit)
    }
  }

  // Log rows in console, then return for further use
  mapped_rows.forEach(row => console.log(row))
  return mapped_rows
});
