const os = require('os');

// Input sample, skipping file loading here
var SOURCE_TEXT = `jkdhs
das

    
das
das

das

// some other stuff

/*    */

/*  
  sdsdasdas
  */
das
dassad
`

// Pure functions
const get_lines_as_array = text => text ? text.split(/\r\n|\r|\n/) : [];
const count_all_lines = text => text ? get_lines_as_array(text).length : 0;
const count_empty_lines = text => text ? (text.match(/^[\t]*$/gm) || []).length : 0;
const get_comment_lines = text => text ? text.match(/\*[\s\S]*?\*\/|([^\\:]|^)\/\/.*$/gm) : [];
const recalculation_reducer = (acc, curr) => (curr.indexOf('\n') === 0) ? acc + 1 : acc + curr.split('\n').length;
const recalculate_lines = lines => lines.reduce(recalculation_reducer, 0)
const count_comment_lines = text => text ? recalculate_lines(get_comment_lines(text)) : 0;

const loc = (text = SOURCE_TEXT) => {
  const total = count_all_lines(text)
  const empty = count_empty_lines(text)
  const comments = count_comment_lines(text)
  const result = { total, empty, comments, executable: total - empty - comments }

  console.log('LoC result:', result)
  return result
}

// (() => loc())()

module.exports = {
  get_lines_as_array,
  count_all_lines,
  count_empty_lines,
  get_comment_lines,
  recalculation_reducer,
  recalculate_lines,
  count_comment_lines,
  loc,
}
