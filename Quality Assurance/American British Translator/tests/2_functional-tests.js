/*
 *
 *
 *       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
 *       -----[Keep the tests in the same order!]----
 *       (if additional are added, keep them at the very end!)
 */

const chai = require('chai');
const assert = chai.assert;

let Translator;

suite('Functional Tests', () => {
  suiteSetup(() => {
    // DOM already mocked -- load translator then run tests
    Translator = require('../public/translator.js');
  });

  suite('Function ____()', () => {
    /* 
      The translated sentence is appended to the `translated-sentence` `div`
      and the translated words or terms are wrapped in 
      `<span class="highlight">...</span>` tags when the "Translate" button is pressed.
    */
    test("Translation appended to the `translated-sentence` `div`", done => {
      
      const input = 'What is your favorite color?';
      const message = 'What is your <span class="highlight">favourite</span> <span class="highlight">colour</span>?';
      const output = 'What is your favourite colour?';
      let tDiv = document.getElementById('translated-sentence');
      document.getElementById('locale-select').value = 'american-to-british';
      
      Translator.translate(input);
      assert.isString(tDiv.innerHTML);
      assert.isString(tDiv.textContent);
      assert.equal(tDiv.textContent, output, "Success?");
      assert.equal(tDiv.innerHTML, message, "Success?");
      assert.equal(document.getElementsByClassName('highlight').length, 2);
      done();
    });

    /* 
      If there are no words or terms that need to be translated,
      the message 'Everything looks good to me!' is appended to the
      `translated-sentence` `div` when the "Translate" button is pressed.
    */
    test("'Everything looks good to me!' message appended to the `translated-sentence` `div`", done => {
      const input = 'What on Earth is a Kangaroo?';
      const output = 'Everything looks good to me!';
      let tDiv = document.getElementById('translated-sentence');
      
      Translator.translate(input);
      assert.equal(tDiv.textContent, output);
      done();
    });

    /* 
      If the text area is empty when the "Translation" button is
      pressed, append the message 'Error: No text to translate.' to 
      the `error-msg` `div`.
    */
    test("'Error: No text to translate.' message appended to the `translated-sentence` `div`", done => {
      const input = '';
      const output = 'Error: No text to translate.';
      let eDiv = document.getElementById('error-msg');
      
      Translator.translate(input);
      assert.isString(eDiv.textContent);
      assert.isString(eDiv.innerHTML);
      assert.equal(eDiv.style.color, 'red');
      assert.equal(eDiv.textContent, output);
      done();
    });

  });

  suite('Function ____()', () => {
    /* 
      The text area and both the `translated-sentence` and `error-msg`
      `divs` are cleared when the "Clear" button is pressed.
    */
    test("Text area, `translated-sentence`, and `error-msg` are cleared", done => {
      const textArea = document.getElementById('text-input');
      const eDiv = document.getElementById('error-msg');
      const tDiv = document.getElementById('translated-sentence');
      const inputTranslates = 'What is your favorite color?';
      const inputDoesNotTranslate = 'What on Earth is a Kangaroo?';
      const inputError = '';
      const outputTranslates = 'What is your favourite colour?';
      const outputDoesNotTranslate = 'Everything looks good to me!';
      const outputError = 'Error: No text to translate.';
      
      textArea.value = inputTranslates;
      Translator.translate(inputTranslates);
      
      assert.isString(tDiv.textContent);
      assert.isString(textArea.value);
      assert.equal(tDiv.textContent, outputTranslates);
      assert.equal(textArea.value, inputTranslates);
      assert.equal(eDiv.textContent, '');
      assert.equal(eDiv.innerHTML, '');
      
      Translator.clear();
      
      assert.equal(textArea.value, '');
      assert.equal(tDiv.innerHTML, '');
      assert.equal(tDiv.textContent, '');
      assert.equal(eDiv.textContent, '');
      assert.equal(eDiv.innerHTML, '');
      
      Translator.translate(inputDoesNotTranslate);
      
      assert.equal(tDiv.textContent, outputDoesNotTranslate);
      assert.equal(eDiv.textContent, '');
      assert.equal(eDiv.innerHTML, '');
      
      Translator.clear();
      
      assert.equal(textArea.value, '');
      assert.equal(tDiv.innerHTML, '');
      assert.equal(tDiv.textContent, '');
      assert.equal(eDiv.textContent, '');
      assert.equal(eDiv.innerHTML, '');
      
      Translator.translate(inputError);
      
      assert.equal(tDiv.innerHTML, '');
      assert.equal(tDiv.textContent, '');
      assert.equal(eDiv.textContent, outputError);

      Translator.clear();
      
      assert.equal(textArea.value, '');
      assert.equal(tDiv.innerHTML, '');
      assert.equal(tDiv.textContent, '');
      assert.equal(eDiv.textContent, '');
      assert.equal(eDiv.innerHTML, '');
      
      done();
    });

  });

});
