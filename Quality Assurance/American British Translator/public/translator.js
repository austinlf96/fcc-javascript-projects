import { americanOnly } from './american-only.js';
import { britishOnly } from './british-only.js';
import { americanToBritishSpelling } from './american-to-british-spelling.js';
import { americanToBritishTitles } from './american-to-british-titles.js';
const noTranslationMsg = 'Everything looks good to me!';
const errorMsg = 'Error: No text to translate.';
const errorDiv = document.getElementById('error-msg');
const translateDiv = document.getElementById('translated-sentence');
const translateButton = document.getElementById('translate-btn');
const clearButton = document.getElementById('clear-btn');
/* 
  Export your functions for testing in Node.
  Note: The `try` block is to prevent errors on
  the client side
*/

document.addEventListener('click', event => {
  if(event.target.id === 'translate-btn'){
    event.preventDefault(); 
    let text = document.getElementById('text-input').value;
    translate(text);
  } else if(event.target.id === 'clear-btn') {
    event.preventDefault();
    clear();
  }
});

const translateToBritish = (sentence) => {
  
  const language = document.getElementById('locale-select').value;
  const timeRegex = new RegExp(/[0-9]{1,2}[:|.][0-9]{2}/, 'g');
  
  const americanWords = Object.keys(americanOnly);
  const americanSpellings = Object.keys(americanToBritishSpelling);
  const americanTitles = Object.keys(americanToBritishTitles);
  let newSentence = sentence;
  
  if(timeRegex.test(newSentence)) {
    let times = newSentence.match(timeRegex);
    for(let i=0; i<times.length; i++){
      newSentence = newSentence.replace(timeRegex, '<span class="highlight">' + convertTime(times[i], language) + '</span>');
    }
  }
  for(let i=0; i<americanWords.length; i++){
    let regex = new RegExp(`\\b${americanWords[i]}\\b`, 'gi');
    if(regex.test(newSentence)){
      let words = newSentence.split(' ');
      let matches = newSentence.match(regex);
      let translatedWord = words.indexOf(matches[0]);
      
      newSentence = newSentence.replace(regex, '<span class="highlight">' + americanOnly[americanWords[i]] + '</span>');      
    } 
  }
  
  for(let i=0; i<americanSpellings.length; i++){
    let regex = new RegExp(`\\b${americanSpellings[i]}\\b`, 'gi');
    if(regex.test(newSentence)){
      newSentence = newSentence.replace(regex, '<span class="highlight">' + americanToBritishSpelling[americanSpellings[i]] + '</span>');
    } 
  }
  
  for(let i=0; i<americanTitles.length; i++){
    let regex = new RegExp(americanTitles[i], 'gi');
    if(regex.test(newSentence)) {
      let capitalTitle = americanToBritishTitles[americanTitles[i]].split('');
      capitalTitle[0] = capitalTitle[0].toUpperCase();
      capitalTitle = capitalTitle.join('');
      newSentence = newSentence.replace(regex, '<span class="highlight">' + capitalTitle + '</span>');
    }
  }
  return newSentence;
}

const translateToAmerican = (sentence) => {
  const language = document.getElementById('locale-select').value;
  const timeRegex = new RegExp(/[0-9]{1,2}[:|.][0-9]{2}/, 'g');
  
  const britishWords = Object.keys(britishOnly);
  const britishSpellings = Object.values(americanToBritishSpelling);
  const britishTitles = Object.values(americanToBritishTitles);
  let newSentence = sentence;

  if(timeRegex.test(newSentence)) {
    let times = newSentence.match(timeRegex);
    for(let i=0; i<times.length; i++){
      newSentence = newSentence.replace(timeRegex, '<span class="highlight">' + convertTime(times[i], language) + '</span>');
    }
  }
  
  for(let i=0; i<britishWords.length; i++){
 
    let regex = new RegExp(`\\b${britishWords[i]}\\b`, 'gi');
    if(britishWords[i] === 'chippy') i++; //Hacked so that chippy and chip shop don't double translate
    if(regex.test(newSentence)) newSentence = newSentence.replace(regex, '<span class="highlight">' + britishOnly[britishWords[i]] + '</span>'); 
  }
  
  for(let i=0; i<britishSpellings.length; i++){
    let regex = new RegExp(`\\b${britishSpellings[i]}\\b`, 'gi');
    if(regex.test(newSentence)) newSentence = newSentence.replace(regex, '<span class="highlight">' + Object.keys(americanToBritishSpelling)[i] + '</span>');
  }
  
  for(let i=0; i<britishTitles.length; i++){
    let regex = new RegExp(`\\b${britishTitles[i]}\\b`, 'gi');
    if(regex.test(newSentence)) { 
      let capitalTitle = Object.keys(americanToBritishTitles)[i].split('');
      capitalTitle[0] = capitalTitle[0].toUpperCase();
      capitalTitle = capitalTitle.join('');
      newSentence = newSentence.replace(regex, '<span class="highlight">' + capitalTitle + '</span>');
    }
  }
  return newSentence;
}

const translate = (input) => { 
  let language = document.getElementById('locale-select').value;
  let timeRegex = /[0-9]{1,2}[:|.][0-9]{2}/g; 
  let translation;
  
  if(input === '') sendOutput(errorMsg);
  else{
    if(language === 'american-to-british') translation = translateToBritish(input);
    else if (language === 'british-to-american') translation = translateToAmerican(input);
    if(translation === input) sendOutput(noTranslationMsg);
    else sendOutput(translation);
  }

}

const convertTime = (time, language) => {
  if(time.includes('.') && language === 'british-to-american') return time.replace('.', ':');
  else if(time.includes(':') && language === 'american-to-british') return time.replace(':', '.');
  else return time;
}

const sendOutput = (msg) => {
  if(msg === errorMsg) {
    document.getElementById('translated-sentence').innerHTML='';
    errorDiv.style.color = "red";
    errorDiv.innerHTML = msg;
  } else{
    document.getElementById('error-msg').innerHTML = '';
    translateDiv.innerHTML = msg;
  }
}

const clear = () => {
  document.getElementById('text-input').value = '';
  document.getElementById('error-msg').innerHTML = '';
  document.getElementById('translated-sentence').innerHTML='';
}

try {
  module.exports = {
    convertTime, 
    translate,
    translateToAmerican,
    translateToBritish,
    sendOutput,
    clear
  }
} catch (e) {}
