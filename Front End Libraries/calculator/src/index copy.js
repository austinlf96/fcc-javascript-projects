/*
Working copy that passes all tests formatted with <FontAwesomeIcon />

import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faEquals, faDivide, faMinus, faTimes, faPlus, faCircle} from '@fortawesome/free-solid-svg-icons';

function Display(props){
  return(
    <div id='top-half'>
      <div id='display'>
          {props.display}
      </div>
      <div id='answer'>
          {props.answer}
      </div>
    </div>);
}
class NumberPad extends React.Component{
  render(){
    const numbers=['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
    const operators=[
      {id: 'add', 
      symbol:
      <span className='fa-layers fa-fw'>
        <FontAwesomeIcon icon={faCircle} size='lg' transform='left-0.5 up-0.5 grow-5.5'/>
        <FontAwesomeIcon icon={faPlus} className='fa-operator' inverse size='lg' transform='grow-1 up-0.5' />
      </span>, 
      character: '+'},
      {id: 'subtract', 
      symbol: 
      <span className='fa-layers fa-fw'>
        <FontAwesomeIcon icon={faCircle} size='lg' transform='left-0.5 up-0.5 grow-5.5'/>
        <FontAwesomeIcon icon={faMinus} className='fa-operator' inverse size='lg' transform='grow-1 up-0.5' />
      </span>,
      character: '-'},
      {id: 'multiply', 
      symbol: 
      <span className='fa-layers fa-fw'>
        <FontAwesomeIcon icon={faCircle} size='lg' transform='left-0.5 up-0.5 grow-5.5'/>
        <FontAwesomeIcon icon={faTimes} className='fa-operator' inverse size='lg' transform='grow-1 up-0.5' />
      </span>,
      character: '*'}, 
      {id: 'divide', 
      symbol: 
        <span className='fa-layers fa-fw'>
          <FontAwesomeIcon icon={faCircle} size='lg' transform='left-0.5 up-0.5 grow-5.5'/>
          <FontAwesomeIcon icon={faDivide} className='fa-operator' inverse size='lg' transform='grow-1 up-0.5' />
        </span>, 
      character: '/'
      }, 
      {id: 'equals', 
      symbol: 
        <span className='fa-layers fa-fw'>
          <FontAwesomeIcon icon={faCircle} size='lg' transform='left-0.5 grow-5.5'/>
          <FontAwesomeIcon icon={faEquals} className='fa-operator' inverse size='lg' transform='grow-1 up-0.5' />
          =
        </span>, 
      character: '='
      }
    ];
    let numberButtons= numbers.map((number, index)=>{
      return(
        <button
          className='number' 
          id={number} 
          onClick={()=>this.props.appendSymbol(index.toString())}
        >
          <span className='fa-layers fa-fw'>
            <FontAwesomeIcon icon={faCircle} size='2x' transform='left-3 grow-2'/>
            <span className='fa-layers-text fa-inverse fa-2x' >{index.toString()}</span>
          </span>
        </button>);
    });
    let operatorButtons= operators.map((operand)=>{
      return(
      <button 
        className='operator' 
        id={operand.id} 
        onClick={()=>this.props.appendSymbol(operand.character)}
      >
        {operand.symbol}
      </button>);
    });
    return(
      <div id='numpad'>
        <div id='numbers'>
          {numberButtons}
          <button 
            id='clear'
            className='number'
            onClick={()=>this.props.clearDisplay()}
            >
            <span className='fa-layers fa-fw'>
              <FontAwesomeIcon icon={faCircle} size='2x' transform='left-3 grow-2'/>
              <span className='fa-layers-text fa-inverse fa-xs'>Clear</span>
            </span>
          </button> 
          <button
            id='decimal'
            className='number'
            onClick={()=>this.props.appendSymbol('.')}
          ><span className='fa-layers fa-fw'>
            <FontAwesomeIcon icon={faCircle} size='2x' transform='left-3 grow-2' />
            <FontAwesomeIcon icon={faCircle} className='fa-layers-text' size='sm' transform='down-12 right-8' inverse/>
            .
          </span>
          </button>
        </div>
        <div id='operators'>
          {operatorButtons}
        </div>
      </div>
    )
  }
}
class Calculator extends React.Component{
  constructor(props){
    super(props);
    this.state={
      answer: 0,
      equation: [],
      number: [],
      display: [0],
      hasDecimal: false,
      startsWithZero: false,
      lastOperator: '',
      cleared: true
    };
  }
  evaluate(equation){
    let tempArr=equation;
    let answer,temp;
    const ops=['*','/','+', '-'];
    for(let i=0; i<ops.length; i+=2){
      for(let j=0; j<tempArr.length; j++){
        if(tempArr[j] === ops[i] || tempArr[j] === ops[i+1]){
          switch (tempArr[j]){
            case '*':
              temp= tempArr[j-1]*tempArr[j+1];
              tempArr.splice(j-1, 3, temp);
              j=0;
              break;
            case '/':
              temp= tempArr[j-1]/tempArr[j+1];
              tempArr.splice(j-1, 3, temp);
              j=0;
              break;
            case '+':
              temp= tempArr[j-1]+tempArr[j+1];
              tempArr.splice(j-1, 3, temp);
              j=0;
              break;
            case '-':
              temp= tempArr[j-1]-tempArr[j+1];
              tempArr.splice(j-1, 3, temp);
              j=0;
              break;
            default:
              break;
          }
        }
        console.log(tempArr[j]);
      }
    }
    answer=tempArr[0].toPrecision();
    if(answer.includes('.')){
      this.setState({
        answer: answer,
        lastOperator: '',
        hasDecimal: true,
        display: [answer]
      });
    } else {
      this.setState({
        answer: answer,
        lastOperator: '',
        display: [answer]
      });
   }
  }
  clearDisplay(){
    this.setState({
      answer: 0,
      equation: [],
      number: [],
      display: [0],
      hasDecimal: false,
      startsWithZero: false,
      lastOperator: '',
      cleared: true
    });
  }
  appendSymbol(symbol){
    const lastOperator=this.state.lastOperator;
    let tempNumber, numToEquation;
    switch (symbol){
      case '0':
        if(this.state.cleared)
        {
          this.setState({
            display: [symbol],
            number: [symbol],
            startsWithZero: true,
            cleared: false
          });
        } else {
          if(this.state.startsWithZero) break;
          if(lastOperator){
            this.setState({
              equation: this.state.equation.concat(lastOperator),
              number: this.state.number.concat(symbol),
              display: this.state.display.concat(symbol),
              startsWithZero: true,
              lastOperator: '',
            });
          } else {
            if(this.state.number[0]===undefined){
              this.setState({
                number: this.state.number.concat(symbol),
                display: this.state.display.concat(symbol),
                startsWithZero: true
              });  
            } else {
              this.setState({
                number: this.state.number.concat(symbol),
                display: this.state.display.concat(symbol),
              });
            }
          }
        }
        break;
      case '1': 
      case '2':
      case '3':
      case '4':
      case '5':
      case '6': 
      case '7':
      case '8':
      case '9':
        if(this.state.cleared)
        {
          this.setState({
            display: [symbol],
            number: [symbol],
            startsWithZero: false,
            cleared: false
          });
          break;
        } else {
          if(lastOperator){
            this.setState({
              equation: this.state.equation.concat(lastOperator),
              display: this.state.display.concat(symbol),
              number: this.state.number.concat(symbol),
              lastOperator: '',
              startsWithZero: false
            });
            break;
          } else {
            this.setState({
              display: this.state.display.concat(symbol),
              number: this.state.number.concat(symbol),
              startsWithZero: false
            });
            break;
          }
        }
      case '*':
        if(lastOperator){
          this.setState({
            display: this.state.display.concat(' x '),
            number: [],
            lastOperator: symbol
          });
          break;
        }
        if(this.state.answer){
          let currentAnswer;
          if(this.state.hasDecimal){
            currentAnswer= parseFloat(this.state.answer);
          } else {
            currentAnswer=parseInt(this.state.answer, 10);
          }
          this.setState({
            display: [currentAnswer + ' x '],
            equation: [currentAnswer],
            answer: 0,
            number :[],
            lastOperator: symbol,
            hasDecimal: false,
            startsWithZero: true
          });
        } else {
          if(this.state.number[0] && this.state.number[this.state.number.length-1]!=='.'){
            tempNumber= this.state.number.join('');
            if(this.state.hasDecimal){
              numToEquation= parseFloat(tempNumber);
            } else {
              numToEquation=parseInt(tempNumber, 10);
            }
            this.setState({
              equation: this.state.equation.concat(numToEquation),
              number: [],
              lastOperator: symbol,
              display: this.state.display.concat(' x '),
              startsWithZero: true,
              hasDecimal: false
            });
          }
        }
        break;
      case '/':
      case '+':
        if(lastOperator){
            this.setState({
              display: this.state.display.concat(symbol),
              number: [],
              lastOperator: symbol
            });
          break;
        }
        if(this.state.answer){
          let currentAnswer;
          if(this.state.hasDecimal){
            currentAnswer= parseFloat(this.state.answer);
          } else {
            currentAnswer=parseInt(this.state.answer, 10);
          }
          this.setState({
            display: [currentAnswer +  ' ' +symbol + ' '],
            equation: [currentAnswer],
            answer: 0,
            number :[],
            lastOperator: symbol,
            hasDecimal: false,
            startsWithZero: true
          });
        } else {
          if(this.state.number[0] && this.state.number[this.state.number.length-1]!=='.'){
            tempNumber= this.state.number.join('');
            if(this.state.hasDecimal){
              numToEquation= parseFloat(tempNumber);
            } else {
              numToEquation=parseInt(tempNumber, 10);
            }
            this.setState({
              equation: this.state.equation.concat(numToEquation),
              number: [],
              lastOperator: symbol,
              display: this.state.display.concat(' ' +symbol + ' '),
              startsWithZero: true,
              hasDecimal: false
            });
          }
        }
        break;
      case '-':
        if(this.state.lastOperator){
          this.setState({
            display: this.state.display.concat(symbol),
            number: ['-'],
          });
          break;
        }
        if(this.state.answer){
          let currentAnswer;
          if(this.state.hasDecimal){
            currentAnswer= parseFloat(this.state.answer);
          } else {
            currentAnswer=parseInt(this.state.answer, 10);
          }
          this.setState({
            display: [currentAnswer + ' - '],
            equation: [currentAnswer],
            number: [],
            answer: 0,
            lastOperator: symbol,
            hasDecimal: false,
            startsWithZero: true
          });
        } else {
          if(this.state.number[0] && this.state.number[this.state.number.length-1]!=='.'){
            tempNumber= this.state.number.join('');
            if(this.state.hasDecimal){
              numToEquation= parseFloat(tempNumber);
            } else {
              numToEquation=parseInt(tempNumber);
            }
            this.setState({
              equation: this.state.equation.concat(numToEquation),
              number: [],
              lastOperator: symbol,
              display: this.state.display.concat(' ' + symbol + ' '),
              startsWithZero: true,
              hasDecimal: false
            });
          }
        }
        break;
      case '=':
          if(this.state.number[0] && this.state.number[this.state.number.length-1]!=='.'){
            tempNumber= this.state.number.join('');
            if(this.state.hasDecimal){
              numToEquation= parseFloat(tempNumber);
            } else {
              numToEquation=parseInt(tempNumber);
            }
            this.setState({
              equation: this.state.equation.concat(numToEquation),
              number: [],
              display: this.state.display.concat(' ' + symbol + ' '),
              startsWithZero: true,
              hasDecimal: false
            });
          } 
          switch (this.state.number[this.state.number.length-1]){
            case '*':
            case '/':
            case '+':
            case '-':
            case '.':
                break;
            default:
              if(this.state.equation[0]===undefined) break;
              tempNumber=this.state.number.join('');
              if(this.state.hasDecimal){
                numToEquation= parseFloat(tempNumber);
              } else {
                numToEquation=parseInt(tempNumber);
              }
              this.setState({
                equation: this.state.equation.concat(numToEquation),
                number: [],
                display: this.state.display.concat(' ' + symbol + ' '),
                startsWithZero: true,
                hasDecimal: false
              });
              this.evaluate(this.state.equation.concat(numToEquation));
              break;
          }          
        break;
      case '.':
        if(this.state.hasDecimal) break;
        this.setState({
          display: this.state.display.concat('.'),
          number: this.state.number.concat('.'),
          hasDecimal: true,
          startsWithZero: false
        });
        break;
      default:
        break;
    }
  }
  render(){
    return(
      <div id='container'>
        <div id='calculator'>
          <Display 
            display={this.state.display}
            answer={this.state.answer} />
          <NumberPad 
            clearDisplay={()=>this.clearDisplay()}
            appendSymbol={(symbol)=>this.appendSymbol(symbol)}/>
        </div>
      </div>
    );
  }
}

ReactDOM.render(<Calculator />,document.getElementById('root'));
*/