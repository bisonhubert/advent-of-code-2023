// in: lines of text
// out: line[first_digit] + line[last_digit]

// example:
// 1abc2 => 12
// pqr3stu8vwx => 39
// a1b2c3d4e5f => 15
// treb7uchet => 77 (repeat if 1 digit)
// sum = 12 + 39 + 15 + 77 == 142

const fs = require("fs");
const input = fs.readFileSync("./01-input.txt").toString().split("\n");

const numStrMap = {
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
};

function getDigitIndex(line) {
  // Get index of numbers spelled out with letters.
  // In: xtwone3fourthreefour
  // Out: { '1': 'two', '3': 'one', '6': '3', 'three': '11', '16': 'four' }
  const numLetterIndex = Object.keys(numStrMap).reduce((accum, numStr) => {
    const numStrIndexFirst = line.indexOf(numStr);
    const numStrIndexLast = line.lastIndexOf(numStr);
    if (numStrIndexFirst !== -1) {
      accum[numStrIndexFirst] = numStr;
    }
    if (numStrIndexLast !== -1) {
      accum[numStrIndexLast] = numStr;
    }
    return accum;
  }, {});
  // Get index of numerical characters.
  const chars = line.split("");
  const digitIndex = chars.reduce((accum, char, index) => {
    if (!isNaN(char)) {
      accum[index] = char;
    }
    return accum;
  }, {});
  return { ...numLetterIndex, ...digitIndex };
}

function getDigitAsNumber(digitIndex, digitIndexKeys) {
  // Parse digitIndex or numStrMap, concatenate, then convert it to a number.
  if (digitIndexKeys.length === 1) {
    const [i1] = digitIndexKeys;
    const digit = isNaN(digitIndex[i1])
      ? numStrMap[digitIndex[i1]]
      : digitIndex[i1];
    return Number(`${digit}${digit}`);
  } else {
    const i1 = Math.min(...digitIndexKeys);
    const i2 = Math.max(...digitIndexKeys);
    const d1 = isNaN(digitIndex[i1])
      ? numStrMap[digitIndex[i1]]
      : digitIndex[i1];
    const d2 = isNaN(digitIndex[i2])
      ? numStrMap[digitIndex[i2]]
      : digitIndex[i2];
    return Number(`${d1}${d2}`);
  }
}

function getCalibrationValues(line) {
  // Calibration value is derived from a line in a text file. It is a number made from a string.
  // The first digit is the first number in the line, the second digit is the last number in the line.
  // In: zoneight234
  // Out: 14
  const digitIndex = getDigitIndex(line);
  const digitIndexKeys = Object.keys(digitIndex);
  return getDigitAsNumber(digitIndex, digitIndexKeys);
}

function getCalibrationValue(text) {
  if (!text) {
    return;
  }
  return text.reduce((accum, line) => {
    const cVals = getCalibrationValues(line);
    return accum + cVals;
  }, 0);
}

// driver
const solution = getCalibrationValue(input);
console.log("solution", solution);

// test 1
const test_1 = getCalibrationValue([
  "1abc2", // 12
  "pqr3stu8vwx", // 38
  "a1b2c3d4e5f", // 15
  "treb7uchet", // 77
]);

// test 2
const test_2 = getCalibrationValue([
  "two1nine", // 29
  "eightwothree", // 83
  "abcone2threexyz", // 13
  "xtwone3four", // 24
  "4nineeightseven2", // 42
  "zoneight234", // 14
  "7pqrstsixteen", // 76
]);

// test 3
const test_3 = getCalibrationValue([
  "two1nine", // 29
  "eightwothree", // 83
  "abcone2threexyz", // 13
  "xtwone3four", // 24
  "4nineeightseven2", // 42
  "zoneight234", // 14
  "7pqrstsixteen", // 76
  "5fivefour34five", // 55
]);

// test 3
const test_4 = getCalibrationValue([
  "two1nine", // 29
  "eightwothree", // 83
  "abcone2threexyz", // 13
  "xtwone3four", // 24
  "4nineeightseven2", // 42
  "zoneight234", // 14
  "7pqrstsixteen", // 76
  "5fivefour34five", // 55
  "oneight", // 18
  "eighthree", // 83
]);

console.log("test_1", test_1);
console.log("test_1", test_1 === 142 ? "✅" : "❌");
console.log("test_2", test_2);
console.log("test_2", test_2 === 281 ? "✅" : "❌");
console.log("test_3", test_3);
console.log("test_3", test_3 === 336 ? "✅" : "❌");
console.log("test_4", test_4);
console.log("test_4", test_4 === 437 ? "✅" : "❌");
console.log("solution", solution);
console.log("test_solution", solution === 54885 ? "✅" : "❌");
// 54715 was too low, I needed to make sure indexOf and lastIndexOf were both added to the index
