import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
function DrumPad(props){
  return(
    <button 
      id={props.description} 
      className='drum-pad' 
      onClick={()=>props.triggerAudio(props.description,props.id)}>
      {props.id}
      <audio id={props.id} className='clip' preload='auto' src={props.source}></audio>
    </button>
  );
}
function Display(props){
  return(<div id='display'><h3>{props.display}</h3></div>);
}
class Looper extends React.Component{
  render(){
    return(
      <div id='looper'>I'm a looper in development, check back soon!</div>
    );
  }
}
class Visualizer extends React.Component{
  render(){
    return(
      <div id="visualizer">I'm a visualizer in development, check back soon!</div>
    );
  }
}
class Pads extends React.Component{
  renderPad(pad){
    return(
      <DrumPad 
        id={pad.id}
        description={pad.description}
        source={pad.source}
        triggerAudio={(description,id)=>this.props.triggerAudio(description,id)}
      />
    );
  }
  render(){
    const padsBoard= this.props.pads.map((pad)=> this.renderPad(pad));
    return(
      <div id='pads'>
        <div className='row' id='row1'>
          {padsBoard[0]}
          {padsBoard[1]}
          {padsBoard[2]}
        </div>
        <div className='row' id='row2'>
          {padsBoard[3]}
          {padsBoard[4]}
          {padsBoard[5]}
        </div>
        <div className='row' id='row3'>
          {padsBoard[6]}
          {padsBoard[7]}
          {padsBoard[8]}
        </div>
      </div>
    );
  }
}
class DrumMachine extends React.Component{
  constructor(props){
    super(props);
    this.state={
      loading: false,
      display: '',
      pads:[
        {id: 'Q',
        description: 'Closed hi-hat',
        source: 'https://s3.amazonaws.com/freecodecamp/drums/Bld_H1.mp3'},
        {id: 'W',
        description: 'Snare',
        source: 'https://s3.amazonaws.com/freecodecamp/drums/Brk_Snr.mp3'},
        {id: 'E',
        description: 'Clap',
        source: 'https://s3.amazonaws.com/freecodecamp/drums/Heater-6.mp3'},
        {id: 'A',
        description: 'Open hi-hat',
        source: 'https://s3.amazonaws.com/freecodecamp/drums/Dsc_Oh.mp3'},
        {id: 'S',
        description: 'Kick',
        source: 'https://s3.amazonaws.com/freecodecamp/drums/punchy_kick_1.mp3'},
        {id: 'D',
        description: 'Guitar 1',
        source: 'https://s3.amazonaws.com/freecodecamp/drums/Heater-1.mp3'},
        {id: 'Z',
        description: 'Guitar 2',
        source: 'https://s3.amazonaws.com/freecodecamp/drums/Heater-2.mp3'},
        {id: 'X',
        description: 'Guitar 3',
        source: 'https://s3.amazonaws.com/freecodecamp/drums/Heater-3.mp3'},
        {id: 'C',
        description: 'Guitar 4',
        source: 'https://s3.amazonaws.com/freecodecamp/drums/Heater-4_1.mp3'}
      ],
      playLoop: false
    }
  }
  triggerAudio(description,id){
    const clip=document.getElementById(id);
    this.setState({
      display: description
    });
    clip.play();
  }
  findMatchingPad(event){
    this.state.pads.forEach((pad)=> {
      if(event.key.toUpperCase()===pad.id){
        this.triggerAudio(pad.description,pad.id);
      }
    });
  }
  componentDidMount(){
    document.addEventListener('keydown', (event)=>this.findMatchingPad(event));
  }
  componentWillUnmount(){
    document.removeEventListener('keydown', (event)=>this.findMatchingPad(event));
  }
  render(){
    return(
      <div id='container'>
        <div id='drum-machine'>
          <Display display={this.state.display}/>
          <Pads 
            pads={this.state.pads}
            triggerAudio={(description, id)=>this.triggerAudio(description,id)}
            />
          <Visualizer />
          <Looper />
        </div>
      </div>
    );
  }
}

ReactDOM.render(<DrumMachine />,document.getElementById('root'));