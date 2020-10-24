/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

const chai = require("chai");
const assert = chai.assert;
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
import {puzzlesAndSolutions} from '../public/puzzle-strings';
let Solver;

suite('Functional Tests', () => {
  suiteSetup(() => {
    // DOM already mocked -- load sudoku solver then run tests
    Solver = require('../public/sudoku-solver.js');
  });
  
  suite('Text area and sudoku grid update automatically', () => {
    // Entering a valid number in the text area populates 
    // the correct cell in the sudoku grid with that number
    test('Valid number in text area populates correct cell in grid', done => {
      
      let textArea = document.getElementById('text-input');
      let expect = ['7', '.', '1', '3', '.', '4', '5', '.', '1'];
      textArea.value = '7.13.45.1';
      Solver.setGrid(textArea.value);
      expect.forEach((expectedNum,i) => {
        assert.equal(expectedNum, textArea.value[i]);
      })
      done();
    });

    // Entering a valid number in the grid automatically updates
    // the puzzle string in the text area
    test('Valid number in grid updates the puzzle string in the text area', done => {
      let textArea = document.getElementById('text-input');
      let cells = document.getElementsByClassName('sudoku-input');
      textArea.value = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
      Solver.setGrid(textArea.value);
      cells[0].value = '9';
      cells[1].value = '1';
      cells[2].value = '4';
      Solver.setTextArea(); 
      assert.equal(textArea.value[0], '9');
      assert.equal(textArea.value[1], '1');
      assert.equal(textArea.value[2], '4');
      done();
    });
  });
  
  suite('Clear and solve buttons', () => {
    // Pressing the "Clear" button clears the sudoku 
    // grid and the text area
    test('Function clearInput()', done => {
      let textArea = document.getElementById('text-input');
      let cells = document.getElementsByClassName('sudoku-input');
      let expected = '';
      textArea.value = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
      for(let i = 0; i <81; i++){
        expected+='.';
      }
      Solver.setGrid(textArea.value);
      Solver.clear();
      assert.equal(textArea.value, expected);
      done();
    });
    
    // Pressing the "Solve" button solves the puzzle and
    // fills in the grid with the solution
    test('Function showSolution(solve(input))', done => {
      let textArea = document.getElementById('text-input');
      textArea.value = puzzlesAndSolutions[0][0];
      Solver.solve();
      assert.equal(textArea.value, puzzlesAndSolutions[0][1]);
      done();
    });
  });
});

