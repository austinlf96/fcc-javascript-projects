/*
*
*
*       Complete the handler logic below
*       
*       
*/

function ConvertHandler() {
  
    this.getNum = function(input) {
      var result;
      let index = input.search(/[a-zA-Z]/g);
      let numString = input.slice(0, index);
      let num1, num2, count;
      if (numString.length == 0){
        result = '1';
      } else {    
        count = numString.match(/\//g); 
        if(count == null ) result = Number.parseFloat(numString).toFixed(5);
        else if (count.length > 1) return 'invalid number'; //Checks for more than 1 division symbol i.e. double fractions
        else {
          index = numString.search(/\//);
          num1 = numString.slice(0, index);
          num2 = numString.slice(index + 1);
          result = (Number.parseFloat(num1) / Number.parseFloat(num2)).toFixed(5);
        }
      }
      return result = Number.parseFloat(result).toString(10);
    };
    
    this.getUnit = function(input) {
      var result;
      let index = input.search(/[a-zA-Z]/g);
      let unitString = input.slice(index);
      
      switch (unitString.toLowerCase()) {
        case 'km' :
        case 'kg' :
        case 'l'  :
        case 'mi' :
        case 'lbs':
        case 'gal':
          result = unitString;
          break;
        default:
          result = 'invalid unit';
          break;
      }
      
      return result;
    };
    
    this.getReturnUnit = function(initUnit) {
      var result;
      switch(initUnit.toLowerCase()){
        case 'km' :
          result = 'mi';
          break;
        case 'kg' :
          result = 'lbs';
          break;
        case 'l'  :
          result = 'gal';
          break;
        case 'mi' :
          result = 'km';
          break;
        case 'lbs': 
          result = 'kg';
          break;
        case 'gal': 
          result = 'l';
          break;
        default:
          result = 'invalid unit';
          break;
      }
      
      return result;
    };
  
    this.spellOutUnit = function(unit) {
      var result;
      switch(unit.toLowerCase()){
        case 'km' :
          result = 'kilometers';
          break;
        case 'kg' :
          result = 'kilograms';
          break;
        case 'l'  :
          result = 'liters';
          break;
        case 'mi' :
          result = 'miles';
          break;
        case 'lbs': 
          result = 'pounds';
          break;
        case 'gal': 
          result = 'gallons';
          break;
        default:
          result = 'invalid unit';
          break;
      }
      
      return result;
    };
    
    this.convert = function(initNum, initUnit) {
      const galToL = 3.78541;
      const lbsToKg = 0.453592;
      const miToKm = 1.60934;
      var result;
      if (initNum === 'invalid number' && initUnit === 'invalid unit') return result = 'invalid number and unit'; 
      else if(initNum === 'invalid number') return result = 'invalid number';
      else if(initUnit === 'invalid unit') return result = 'invalid unit';
      switch(initUnit.toLowerCase()){
        case 'km' :
          result = Number.parseFloat((initNum) / miToKm).toFixed(5);
          break;
        case 'kg' :
          result = Number.parseFloat((initNum) / lbsToKg).toFixed(5);
          break;
        case 'l'  :
          result = Number.parseFloat((initNum) / galToL).toFixed(5);
          break;
        case 'mi' :
          result = Number.parseFloat((initNum) * miToKm).toFixed(5);
          break;
        case 'lbs': 
          result = Number.parseFloat((initNum) * lbsToKg).toFixed(5);
          break;
        case 'gal': 
          result = Number.parseFloat((initNum) * galToL).toFixed(5);
          break;
        default:
          result = 'invalid';
          break;
      }    
      return result;
    };
    
    this.getString = function(initNum, initUnit, returnNum, returnUnit) {
      var result;
      result = (initNum + ' ' + this.spellOutUnit(initUnit) + ' converts to ' + returnNum + ' ' + this.spellOutUnit(returnUnit));
      return result;
    };
    
  }
  
  module.exports = ConvertHandler;
  