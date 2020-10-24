import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square (props) {
      return (
        <button className={"square " + (props.isAWinner ? 'square-winner' : '')} onClick={() => props.onClick()}>
            {props.value} 
        </button>
      );
}
  
class Board extends React.Component {   
  renderSquare(i) {
      return (
      <Square 
          isAWinner={this.props.winningNumbers.includes(i)}
          value={this.props.squares[i]} 
          onClick={() => this.props.onClick(i)} 
      />);
  } 
  createBoard(rows, tiles){
    let boardArr=[];
    let counter=0;
    for(let i=1; i<=rows; i++){
      let row=[];
      for(let j=0; j<tiles; j++){
        row.push(this.renderSquare(counter));
        counter++;
      }
      boardArr.push(<div key={('board-row-' + i)} className='board-row'>{row}</div>);
    }
    return (
      <div>
        {boardArr}
      </div>
    );
  }
  render() {
    const board = this.createBoard(3,3);
    
    return (
      <div>
        {board}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props){
      super(props);
      this.state = {
          history: [{
              squares: Array(9).fill(null)
          }],
          xIsNext: true,
          stepNumber: 0,
          ascendingOrder: true,
      };
  }
  handleClick(i){
      const history = this.state.history.slice(0,this.state.stepNumber+1); 
      const current = history[history.length-1];
      const squares = current.squares.slice();
      const locations= [[1,1], [1,2], [1,3], [2,1],[2,2],[2,3],[3,1],[3,2],[3,3]];
      if(this.calculateWinner(squares)[0] || squares[i]){
        return;
      } 
      squares[i]= this.state.xIsNext ? 'X' : 'O';
      this.setState({
          history: history.concat([{squares: squares, location: locations[i]}]),
          xIsNext: !this.state.xIsNext,
          stepNumber: history.length
      });   
  }
  jumpTo(step){
      this.setState({
          stepNumber: step,
          xIsNext: (step % 2 === 0)
      });
  }
  order(){
    this.setState({
      ascendingOrder: !this.state.ascendingOrder
    });
  }   
  calculateWinner(squares) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return [squares[a],lines[i]];
      }
    }
    return [null,[]];
  }
  render() {
      const history= this.state.history;
      const current= history[this.state.stepNumber];
      const winner= this.calculateWinner(current.squares);
      const moves= history.map((step,move)=> {
          const desc = move ? 
              'Go to move # ' + move + ' (' + step.location + ')' :
              'Go to the beginning';
          return (
              <li key={move}>
                  <button onClick={()=>this.jumpTo(move)}>
                    {move===this.state.stepNumber ? <b>{desc}</b> :desc}
                  </button>
              </li>
          );
      });

      let status; 
      winner[0] ? (status = 'Winner: ' +winner[0]) :
      this.state.stepNumber === 9 ? (status = 'Aha! Finally, a worth adversary!'):
      (status= 'Next player: ' + (this.state.xIsNext? 'X' : 'O'));

      return (
      <div className="game">
          <div className="game-board">
          <Board 
              winningNumbers= {winner[0] ? winner[1]:[] }
              squares= {current.squares}
              onClick= {(i) =>this.handleClick(i)}
          />
          </div>
          <div className="game-info">
          <div>{status}</div>
          <ol>{this.state.ascendingOrder ? moves : moves.reverse()}</ol>
          </div>
          <div className='order-button'>
            <button onClick={() => this.order()}>{this.state.ascendingOrder ? 'Switch to descending' : 'Switch to ascending'}</button>
          </div>
      </div>
      );
  }

}
  // ========================================
  
  ReactDOM.render(
    <Game />,
    document.getElementById('root')
  );
  