//Palindrome Checker

function palindrome(str) {
    let alphaNumsRegex = /[A-Za-z0-9]+/ig;
    let collection = str.match(alphaNumsRegex);
    console.log(collection);
    collection = collection.join('').toLowerCase();
    collection = collection.split('');
    for(let i=0; i<Math.floor(collection.length/2); i++){
      if(collection[i]!=collection[collection.length-1-i]) return false;
    }
    return true;
  }
  palindrome("My age is 0, 0 si ega ym.");

  //Roman Numeral Converter

  function convertToRoman(num) {
    let x=num;
    let romanNumeral= '';
    while(x>0){
        switch(true){
            case x>=1000:
                x -= 1000;
                romanNumeral+= 'M';
                break;
            case x>=900:
                x -= 900;
                romanNumeral+= 'CM';
                break;
            case x>=500:
                x -= 500;
                romanNumeral+= 'D';
                break;
            case x>=400:
                x -= 400;
                romanNumeral+='CD';
                break;
            case x>=100:
                x -= 100;
                romanNumeral+='C';
                break;
            case x>=90:
                x -= 90;
                romanNumeral+='XC';
                break;
            case x>=50:
                x -= 50;
                romanNumeral+='L';
                break;
            case x>=40:
                x -= 40;
                romanNumeral+='XL';
                break;
            case x>=10:
                x -= 10;
                romanNumeral+='X';
                break;
            case (x>=9):
                x -= 9;
                romanNumeral+='IX';
                break;
            case x>=5:
                x -= 5;
                romanNumeral+='V';
                break;
            case x>=4:
                x -= 4;
                romanNumeral+='IV';
                break;
            case x>=1:
                x -= 1;
                romanNumeral+='I';
                break;
            default:
                x=0;
                break;
        }
        console.log(romanNumeral);
    }
 return romanNumeral;
}
convertToRoman(36);

// Caesars Cipher

function rot13(str) { // LBH QVQ VG!
    let deciphered=[];
    let characterValue=0;
    for(let i=0; i<str.length; i++){
      characterValue= str.charCodeAt(i);
      if (characterValue >= 78 && characterValue <= 90) { 
        deciphered.push(String.fromCharCode(characterValue-13));
      } else if(characterValue >=65 && characterValue < 78) {
        deciphered.push(String.fromCharCode(characterValue+13));
      } else {
        deciphered.push(str[i]);
      }
    }
      return deciphered.join('');
    }
console.log(rot13("SERR PBQR PNZC"));

// Telephone Number Validator

function telephoneCheck(str) {
    
    let phoneRegexs=[/^(1\s|1)?[0-9]{3}\-[0-9]{3}\-[0-9]{4}$/, /^(1\s|1)?\([0-9]{3}\)[0-9]{3}\-[0-9]{4}$/, /^(1\s|1)?[0-9]{3}\s[0-9]{3}\s[0-9]{4}$/, /^(1\s|1)?\([0-9]{3}\)\s[0-9]{3}\-[0-9]{4}$/, /^(1\s|1)?[0-9]{10}$/, /^(1\s|1)?[0-9]{3}\s[0-9]{3}\s[0-9]{4}$/];
    //[0] : xxx-xxx-xxxx
    //[1] : (xxx)xxx-xxxx
    //[2] : xxx xxx-xxxx
    //[3] : (xxx) xxx-xxxx
    //[4] : xxxxxxxxxx
    //[5] : 1 xxx xxx xxx
    for(let i=0; i<phoneRegexs.length; i++){
      if(phoneRegexs[i].test(str)==true)
      {
        console.log(' string ' +str + ' does equal ' + phoneRegexs[i]);
        return true;
      } 
      
    }
    return false;
  }
  telephoneCheck("555-555-5555");

//Cash Register

function checkCashRegister(price, cash, cid) {
    var change= Math.floor((cash-price)*100);
    let insufficent={
        status: "INSUFFICIENT_FUNDS",
        change: []
      };
    let open = {
      status: "OPEN",
      change: []
    };
    let closed = {
      status: "CLOSED", 
      change: [...cid]
    };
    // Here is your change, ma'am.
    let sum=0;
    cid.forEach(currency => sum = sum + currency[1]*100);
    sum= Math.floor(sum);
    if(sum<change){
      return insufficent;
    }
     else if(sum==change){
      return closed;
    } else {
      let changeCurrencies=[];
      let totalChange=[];
      let tempChange= [];
      cid.forEach(currency => {
        switch(currency[0]){
          case 'PENNY':
            changeCurrencies.push(['PENNY', 1]);
            break;
          case 'NICKEL':
            changeCurrencies.push(['NICKEL', 5]);
            break;
          case 'DIME': 
            changeCurrencies.push(['DIME', 10]);
            break;
          case 'QUARTER':
            changeCurrencies.push(['QUARTER', 25]);
            break;
          case 'ONE':
            changeCurrencies.push(['ONE', 100]);
            break;
          case 'FIVE':
            changeCurrencies.push(['FIVE', 500]);
            break;
          case 'TEN':
            changeCurrencies.push(['TEN', 1000]);
            break;
          case 'TWENTY':
            changeCurrencies.push(['TWENTY', 2000]);
            break;
          case 'ONE HUNDRED':
            changeCurrencies.push(['ONE HUNDRED', 10000]);
            break;
          default:
            console.log(totalChange);
            console.log(changeCurrencies);
            break;
        }
        currency[1] = Math.round(currency[1]*100);
      });
      while(change>0){
        let tempChangeTotal=0;
        for(let i=cid.length-1; i>=0; i--){
          if(cid[i][1]>0 && change>0){
            tempChange=[cid[i][0], tempChangeTotal];
            if(change-changeCurrencies[i][1]>=0){
              change -= changeCurrencies[i][1];
              cid[i][1] -= changeCurrencies[i][1];
              tempChangeTotal = tempChangeTotal+ changeCurrencies[i][1];
              tempChange[1]=tempChangeTotal
              i++;
            } else{
            if(tempChange[1]>0){
              tempChange[1]= tempChange[1]/100;
              totalChange.push(tempChange);
              tempChangeTotal=0;
              tempChange=[];
            }
          }  
          }else{
            if(tempChange[1]>0){
              tempChange[1]=tempChange[1]/100;
              totalChange.push(tempChange);
              tempChangeTotal=0;
              tempChange=[];
            }
          console.log(tempChange);
          }  
        }
        if(change>0) return insufficent;
      }
      open.change=totalChange;
      return open;
    }
  }
  console.log(checkCashRegister(19.5, 20, [["PENNY", 0.01], ["NICKEL", 0], ["DIME", 0], ["QUARTER", 0], ["ONE", 1], ["FIVE", 0], ["TEN", 0], ["TWENTY", 0], ["ONE HUNDRED", 0]]));
  console.log(checkCashRegister(3.26, 100, 
    [["PENNY", 1.01], ["NICKEL", 2.05], ["DIME", 3.1], 
    ["QUARTER", 4.25], ["ONE", 90], ["FIVE", 55], 
    ["TEN", 20], ["TWENTY", 60], ["ONE HUNDRED", 100]]));