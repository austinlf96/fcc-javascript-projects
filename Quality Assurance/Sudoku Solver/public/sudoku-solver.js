import { puzzlesAndSolutions } from "./puzzle-strings.js";
const textArea = document.getElementById("text-input");
const tableIds = document.getElementsByClassName("sudoku-input");
const letters = ["A", "B", "C", "D", "E", "F", "G", "H", "I"];
const numbers = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];
const keycodes = [8,46,49,50,51,52,53,54,55,56,57,97,98,99,100,101,102,103,104,105,110,190];
const error = document.createElement("p");
const errorDiv = document.getElementById("error-msg");
const lengthError = document.createTextNode("Error: Expected puzzle to be 81 characters long.");
const cluesError = document.createTextNode("Error: Not enough clues have been provided to generate a unique solution. (Requires a minimum of 17 for a unique puzzle solution)");
const puzzleError = document.createTextNode("Error: Puzzle is invalid. Please try again. ");
let gridIds = [];
let row = [];
let rows = [];
let col = [];
let cols = [];
let box = [];
let boxes = [];
let boxStartNums = [0, 3, 6, 27, 30, 33, 54, 57, 60];
let text;

// Create rows
for (let i = 0; i < 81; i++) {
  row.push(i);
  if (row.length === 9) {
    rows.push(row);
    row = [];
  }
}

// Create columns
for (let i = 0; i < 9; i++) {
  for (let j = 0; j < 9; j++) {
    col.push(i + j * 9);
  }
  cols.push(col);
  col = [];
}

// Create boxes --> Adds groups of three at a time by column
boxStartNums.forEach(cellNum => {
  for (let j = 0; j < 3; j++) {
    box.push(cellNum + j);
    box.push(cellNum + j + 9);
    box.push(cellNum + j + 18);
  }
  boxes.push(box);
  box = [];
});

letters.forEach((letter, index) => {
  numbers.forEach((number, index) => {
    //Letter & Number combos for IDs (A1, A2, A3, etc.)
    gridIds.push("" + letter + number);
  });
});
 
document.addEventListener("DOMContentLoaded", () => {
  // Load a simple puzzle into the text area & set the cells accordingly
  textArea.value =
    "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.";
  text = textArea.value.split("");
  for (let i = 0; i < 81; i++) {
    if (text[i] === ".") tableIds[i].value = "";
    else tableIds[i].value = text[i];
  }
});

document.addEventListener("keydown", event => {
 
  if (keycodes.includes(event.keyCode)) {
    switch (event.keyCode) {
      case 8:
      case 46:
        deleteHandler(event.target.id);
        break;
      case 110:
      case 190:
        dotHandler(event.target.id);
        break;
      default:
        numberHandler(event.target.id, event.keyCode);
        break;
    }
  }  else if(!inputValidator(String.fromCharCode(event.keyCode))) console.log('No bueno');
});

//Required Unit Test function
const createGrid = (sudokuString = textArea.value) => {
  let grid = {};
  if (sudokuString.length != 81) {
    error.appendChild(lengthError);
    errorDiv.appendChild(error);
    return false;
  }
  for(let i = 0; i < 81; i++) {
    grid[gridIds[i]] = sudokuString[i];
  }
  return grid;
}

//Required Unit Test function
const validateGrid = (solution = textArea.value) => {
  let invalid = false;
  let possibleNums;
  
  for(let i = 0; i < 9; i++){
    possibleNums = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    rows[i].forEach(position => {
      let index = possibleNums.indexOf(Number.parseInt(solution[position], 10));
      if(index === -1) invalid = true;
      possibleNums.splice(index, 1);
    });
    if(invalid === true) break;
  }
  
  if(invalid === true) return false;
  
  for( let i = 0; i < 9; i++) {
    possibleNums = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    cols[i].forEach(position => {
      let index = possibleNums.indexOf(Number.parseInt(solution[position], 10));
      if(index === -1) invalid = true;
      possibleNums.splice(index, 1);
    });
    if(invalid === true) break;
  }
  if(invalid === true) return false;  
  
  for( let i = 0; i < 9; i++){
    possibleNums = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    boxes[i].forEach(position => {
      let index = possibleNums.indexOf(Number.parseInt(solution[position], 10));
      if(index === -1) invalid = true;
      possibleNums.splice(index, 1);
    });    
    if(invalid === true) break;
  }
  if(invalid === true) return false;  
  else return true;
}

//Required Unit Test function
const inputValidator = input => {
  if(!numbers.includes(input)) return false;
  else return true;
}

//Required test function
const setGrid = gridNumbers => {
  let numbers = gridNumbers.split('');
  for( let i = 0; i < 81; i++){
    if(!numbers[i]) tableIds[i].value = '';
    else if(numbers[i] === '.') tableIds[i].value = '';
    else tableIds[i].value = numbers[i];
  }
} 

//Required test function
const setTextArea = () => {
  let newText = [];
  for(let i = 0; i < 81; i++){
    newText.push(tableIds[i].value);
  }
  newText = newText.join('');
  textArea.value = newText;
}

const numberHandler = (id, keycode) => {
  if (gridIds.includes(id)) {
    let digit;
    keycode > 57
      ? (digit = String.fromCharCode(keycode - 48))
      : (digit = String.fromCharCode(keycode));
    let index = gridIds.indexOf(id);
    tableIds[index].value = digit;
    text[index] = digit;
    text = text.join("");
    textArea.value = text;
    text = text.split("");
  } else if (id === "text-input") {
    setTimeout(() => {
      if (textArea.value.length === 81) {
        text = textArea.value.split("");
        for (let i = 0; i < 81; i++) {
          if (text[i] === ".") tableIds[i].value = "";
          else if(!numbers.includes(text[i])) tableIds[i].value = '';
          else tableIds[i].value = text[i];
        }
      } else console.log("invalid length");
    }, 100);
  } else alert("Please enter a number inside a cell or the text area");
};

const deleteHandler = id => {
  if (gridIds.includes(id)) {
    let index = gridIds.indexOf(id);
    text[index] = ".";
    text = text.join("");
    textArea.value = text;
    text = text.split("");
  } else if (id === "text-input") {
    setTimeout(() => {
      if (textArea.value.length === 81) {
        text = textArea.value.split("");
        for (let i = 0; i < 81; i++) {
          if (text[i] === ".") tableIds[i].value = "";
          else if(!numbers.includes(text[i])) tableIds[i].value = '';
          else tableIds[i].value = text[i];
        }
      } else console.log("invalid length");
    }, 100);
  } else console.log("What's it like to be wrong?");
};

const dotHandler = id => {
  if (id === "text-input") {
    setTimeout(() => {
      if (textArea.value.length === 81) {
        text = textArea.value.split("");
        for (let i = 0; i < 81; i++) {
          if (text[i] === ".") tableIds[i].value = "";
          else if(!numbers.includes(text[i])) tableIds[i].value = '';
          else tableIds[i].value = text[i];
        }
      } else console.log("invalid length");
    }, 100);
  } else console.log("What's it like to be wrong?");
};

const solve = (event = undefined, input = textArea.value) => {

  const attempt = input.split("");
  const solutions = puzzlesAndSolutions.map(
    puzzleSolutions => puzzleSolutions[1]
  );
  let match = true;
  let complete = false;
  let changed = false;
  let numCount = 0;
  for (let i = 0; i < 81; i++) {
    if (attempt[i] != ".") numCount++;
  }
  if(event) event.preventDefault();
  error.style.color = "red";
  error.setAttribute("class", "err");

  if (attempt.length != 81) {
    error.appendChild(lengthError);
    errorDiv.appendChild(error);
  } else if (numCount < 17) {
    error.appendChild(cluesError);
    errorDiv.appendChild(error);
  } else {
    
    if (document.getElementsByClassName("err")) {
      while (errorDiv.lastElementChild) {
        errorDiv.removeChild(errorDiv.lastElementChild);
      }
    }

    while (!complete) {
      changed = false;
      for (let i = 0; i < 81; i++) {
        if (attempt[i] === ".") {
          let rowToSearch, colToSearch, boxToSearch;
          for (let j = 0; j < 9; j++) {
            if (rows[j].includes(i)) rowToSearch = rows[j];
            if (cols[j].includes(i)) colToSearch = cols[j];
            if (boxes[j].includes(i)) boxToSearch = boxes[j];
          }

          let possibleNums = [1, 2, 3, 4, 5, 6, 7, 8, 9];
          possibleNums = checkRow(attempt, possibleNums, rowToSearch);
          if (!possibleNums) {
            console.log('Row error');
            error.appendChild(puzzleError);
            errorDiv.appendChild(error);
            return;
          }
          possibleNums = checkCol(attempt, possibleNums, colToSearch);
          if (!possibleNums) {
            console.log('Column error');
            error.appendChild(puzzleError);
            errorDiv.appendChild(error);
            return;
          }
          possibleNums = checkBox(attempt, possibleNums, boxToSearch);
          if (!possibleNums) {
            console.log('Box error');
            error.appendChild(puzzleError);
            errorDiv.appendChild(error);
            return;
          }
          if (possibleNums.length === 1) {
            changed = true;
            tableIds[i].value = Number.parseInt(possibleNums[0]);
            attempt[i] = Number.parseInt(possibleNums[0]);
          } else if (possibleNums.length === 0) {
            console.log("puzzle error at cell " + i);
            error.appendChild(puzzleError);
            errorDiv.appendChild(error);
            return;
          } 
        }
      }
      textArea.value = attempt.join('');
      if(!changed) complete = true;
    }
  }
  return textArea.value;
};

const checkRow = (grid, nums, row) => {
  let currentNums = [];
  
  for (let i = 0; i < 9; i++) {
   if(grid[row[i]] != '.') currentNums.push(grid[row[i]]);
  }  
  
  for(let i = 0; i < currentNums.length; i++){
    for(let j = i + 1; j < currentNums.length; j++){
      if(currentNums[i] === currentNums[j]){
        return false;
      }
    }
  } 
  row.forEach(num => {
    let counter = 0;
    for( let i = num +1 ; i < 9; i++){
      if(grid[num] === grid[i]) return false;
    }
    if (nums.includes(Number.parseInt(grid[num], 10))) {
      let index = nums.indexOf(Number.parseInt(grid[num]));
      nums.splice(index, 1);
    }
  });
  return nums;
};

const checkCol = (grid, nums, col) => {
  let currentNums = [];
  
  for (let i = 0; i < 9; i++) {
   if(grid[col[i]] != '.') currentNums.push(grid[col[i]]);
  }  
  
  for(let i = 0; i < currentNums.length; i++){
    for(let j = i + 1; j < currentNums.length; j++){
      if(currentNums[i] === currentNums[j]){
        return false;
      }
    }
  }  
  col.forEach(num => {
    if (nums.includes(Number.parseInt(grid[num], 10))) {
      let index = nums.indexOf(Number.parseInt(grid[num]));
      nums.splice(index, 1);
    }
  });
  return nums;
};

const checkBox = (grid, nums, box) => {
  let currentNums = [];
  
  for (let i = 0; i < 9; i++) {
   if(grid[box[i]] != '.') currentNums.push(grid[box[i]]);
  }  
  
  for(let i = 0; i < currentNums.length; i++){
    for(let j = i + 1; j < currentNums.length; j++){
      if(currentNums[i] === currentNums[j]){
        return false;
      }
    }
  } 
  box.forEach(num => {
    if (nums.includes(Number.parseInt(grid[num], 10))) {
      let index = nums.indexOf(Number.parseInt(grid[num]));
      nums.splice(index, 1);
    }
  });
  return nums;
};

const clear = (event = undefined) => {
  if(event) event.preventDefault();
  textArea.value =
    ".................................................................................";
  text = textArea.value.split("");
  for (let i = 0; i < 81; i++) {
    if (text[i] === ".") tableIds[i].value = "";
    else tableIds[i].value = text[i];
  }
};

document.getElementById("solve-button").onclick = solve;
document.getElementById("clear-button").onclick = clear;

/* 
  Export your functions for testing in Node.
  Note: The `try` block is to prevent errors on
  the client side
*/

try {
  module.exports = {
    solve,
    clear,
    dotHandler,
    deleteHandler,
    numberHandler,
    inputValidator,
    createGrid,
    validateGrid,
    setGrid,
    setTextArea};
} catch (e) {}

