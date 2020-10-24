/*
*
*
*       FILL IN EACH UNIT TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]----
*       (if additional are added, keep them at the very end!)
*/

var chai = require('chai');
var assert = chai.assert;
var ConvertHandler = require('../controllers/convertHandler.js');
var input, expect;
var convertHandler = new ConvertHandler();

suite('Unit Tests', function(){
  
  suite('Function convertHandler.getNum(input)', function() {
    
    test('Whole number input', function(done) {
      input = '32L';
      assert.equal(Number.parseFloat(convertHandler.getNum(input)),32);
      done();
    });
    
    test('Decimal Input', function(done) {
      input = '3.1mi';
      assert.equal(Number.parseFloat(convertHandler.getNum(input)), 3.1)
      done();
    });
    
    test('Fractional Input', function(done) {
      input = '1/2gal';
      assert.equal(convertHandler.getNum(input), .5);
      done();
    });
    
    test('Fractional Input w/ Decimal', function(done) {
      input = '2.5/2lbs';
      assert.equal(convertHandler.getNum(input), 1.25);
      done();
    });
    
    test('Invalid Input (double fraction)', function(done) {
      input = '6/3/2kg';
      assert.notEqual(convertHandler.getNum(input), 1);
      done();
    });
    
    test('No Numerical Input', function(done) {
      input = 'gal';
      assert.equal(convertHandler.getNum(input), 1);
      done();
    }); 
    
  });
  
  suite('Function convertHandler.getUnit(input)', function() {
    
    test('For Each Valid Unit Inputs', function(done) {
      input = ['gal','l','mi','km','lbs','kg','GAL','L','MI','KM','LBS','KG'];
      input.forEach(function(ele) {
        assert.equal(convertHandler.getUnit('12'+ele), ele);
      });
      done();
    });
    
    test('Unknown Unit Input', function(done) {
      input = '23g';
      assert.notEqual(convertHandler.getUnit(input), 'g');
      done();
    });  
    
  });
  
  suite('Function convertHandler.getReturnUnit(initUnit)', function() {
    
    test('For Each Valid Unit Inputs', function(done) {
      input = ['gal','l','mi','km','lbs','kg'];
      expect = ['l','gal','km','mi','kg','lbs'];
      input.forEach(function(ele, i) {
        assert.equal(convertHandler.getReturnUnit(ele), expect[i]);
      });
      done();
    });
    
  });  
  
  suite('Function convertHandler.spellOutUnit(unit)', function() {
    
    test('For Each Valid Unit Inputs', function(done) {
      //see above example for hint
      input = ['gal','l','mi','km','lbs','kg'];
      expect = ['gallons', 'liters', 'miles', 'kilometers', 'pounds', 'kilograms'];
      input.forEach((ele, i) => {
        assert.equal(convertHandler.spellOutUnit(ele), expect[i]);
      });
      done();
    });
    
  });
  
  suite('Function convertHandler.convert(num, unit)', function() {
    
    test('Gal to L', function(done) {
      let inputArray = [5, 'gal'];
      expect = 18.9271;
      assert.approximately(Number.parseFloat(convertHandler.convert(inputArray[0], inputArray[1])), expect, 0.1); //0.1 tolerance
      done();
    });
    
    test('L to Gal', function(done) {
      let inputArray = [5, 'L'];
      expect = 1.32086;
      assert.approximately(Number.parseFloat(convertHandler.convert(inputArray[0], inputArray[1])), expect, 0.1); //0.1 tolerance
      done();
    });
    
    test('Mi to Km', function(done) {
      let inputArray = [5, 'mi'];
      expect= 8.04672;
      assert.approximately(Number.parseFloat(convertHandler.convert(inputArray[0], inputArray[1])), expect, 0.1); //0.1 tolerance
      done();
    });
    
    test('Km to Mi', function(done) {
      let inputArray = [5, 'km'];
      expect = 3.10686;
      assert.approximately(Number.parseFloat(convertHandler.convert(inputArray[0], inputArray[1])), expect, 0.1); //0.1 tolerance
      done();
    });
    
    test('Lbs to Kg', function(done) {
      let inputArray = [5, 'lbs'];
      expect = 2.26796;
      assert.approximately(Number.parseFloat(convertHandler.convert(inputArray[0], inputArray[1])), expect, 0.1); //0.1 tolerance
      done();
    });
    
    test('Kg to Lbs', function(done) {
      let inputArray = [5, 'kg'];
      expect = 11.0231;
      assert.approximately(Number.parseFloat(convertHandler.convert(inputArray[0], inputArray[1])), expect, 0.1); //0.1 tolerance
      done();
    });
    
  });

});