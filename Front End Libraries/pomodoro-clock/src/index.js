import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import '../node_modules/font-awesome/css/font-awesome.css'
function Break(props){
  return(
    <div id='break-box' className='timer-box'>
      <div id='break-label' className='time-label'> 
        <u>Break</u>
      </div>
      <button id='break-increment' className='value-button' onClick={()=>props.increment('break')}>
        <i className="fa fa-angle-double-up fa-inverse" aria-hidden="true"></i>
      </button>
      <div id='break-length' className='time-length'>
        {props.breakTime}
      </div>
      <button id='break-decrement' className='value-button' onClick={()=>props.decrement('break')}>
        <i className="fa fa-angle-double-down fa-inverse" aria-hidden="true"></i>  
      </button> 
    </div>
  );
}
function Session(props){
  return(
    <div id='session-box' className='timer-box'>
      <div id='session-label' className='time-label'>
        <u>Session</u>
      </div>
      <button id='session-increment' className='value-button' onClick={()=>props.increment('session')}>
        <i className="fa fa-angle-double-up" aria-hidden="true"></i>
      </button>
      <div id='session-length' className='time-length'>
        {props.sessionTime}
      </div>
      <button id='session-decrement' className='value-button' onClick={()=>props.decrement('session')}>
        <i className="fa fa-angle-double-down" aria-hidden="true"></i>
      </button>
    </div>
  );
}
function Timer(props){
  return(
    <div id='timer-box'>
      <button id='reset' className='timer-button' onClick={()=>props.reset()}>
        <i class="fa fa-refresh" aria-hidden="true"></i>
      </button>
      <div id='timer-circle'>
        <div id='timer-label'>
          {props.label}
        </div>
        <div id='time-left'>
          {props.remaining}
        </div>
        <audio id='beep' preload='auto' src='https://goo.gl/65cBl1'>Beep Beep</audio>
      </div>
      <button id='start_stop' className='timer-button' onClick={()=>props.toggle()}>
        {(props.running ? 'Stop' : 'Start')}
      </button>
      </div>
  );
}
class Clock extends React.Component{
  constructor(props){
    super(props);
    this.state={
      break: 300000,
      session: 1500000,
      currentLabel: 'Session',
      remaining: 1500000,
      paused: false,
      running: false,
      started: false
    };
  }
  toggleTimer(){
    if(this.state.started){
      if(this.state.running){
        this.setState((state)=>({
          remaining: state.remaining, 
          running: false,
          paused: true
        }));
        
      }else{
        if(this.state.paused){
          this.setState((state)=>({
            running: true,
            paused: false
          }));
        }
      }
    } else {
      this.setState((state)=>({
        remaining: state.session,
        started: true, 
        running: true,
        currentLabel: 'Session'
      }));
    }
  }
  resetClock(){
    const sound= document.getElementById('beep');
    if(sound.ended===false){
      sound.pause();
      sound.currentTime = 0;
    }
    this.setState({
      break: 300000,
      session: 1500000,
      currentLabel: 'Session',
      remaining: 1500000,
      paused: false,
      running: false,
      started: false
    });
  }
  convertTime(time){
    const minutes= (Math.floor(time/60000)).toString();
    const seconds= ((time % 60000)/1000).toString();
    const timeFormat= minutes.padStart(2,'0') + ':'+ seconds.padStart(2,'0');
    return (timeFormat);
  }
  convertMinutes(time){
    const minutes= (Math.floor(time/60000)).toString();
    return(minutes);
  }
  increment(label){
    switch (label){
      case 'break':
        if(this.state.break<3600000){
          this.setState((state)=>({
            break: state.break + 60000,
            remaining: state.break + 60000
          }));
        }
        break;
      case 'session':
        if(this.state.session<3600000){
          this.setState((state)=> ({
            session: state.session + 60000,
            remaining: state.session + 60000
          }));
        }
        break;
      default:
        console.log('Something went wrong in Increment()');
        break;
    }
  }
  decrement(label){
    switch (label){
      case 'break':
        if(this.state.break>60000){
          this.setState((state)=>({
            break: state.break - 60000,
            remaining: state.break - 60000
          }));
        }
        break;
      case 'session':
        if(this.state.session>60000){
          this.setState((state)=> ({
            session: state.session - 60000,
            remaining: state.session - 60000
          }));
        }
        break;
      default:
        console.log('Something went wrong in Increment()');
        break;
    }
  }
  //Timer countsdown at an exponential rate. Seems to be adding interval counters
  // causing the countdown to accelerate. Limit this so only ONE counter is running
  //at any given moment. 
  componentDidUpdate(prevState, prevProps){
    let toBreak= () => this.setState({
      currentLabel: 'Break',
      remaining: this.state.break
    });
    let toSession = () => this.setState({
      currentLabel: 'Session',
      remaining: this.state.session
    });
    if(prevState.running!==this.state.running){
      this.state.running ? this.counter=setInterval(()=>this.tick(), 1000) : clearInterval(this.counter);
    }
    if(this.state.remaining<0 && this.state.currentLabel){
      this.state.currentLabel ==='Session' ? toBreak() : toSession();
      document.getElementById('beep').play();
    } else {
      console.log(this.state + ' previous ' + prevState);
    }
  }
  //May need alternative setState function form -->  (state) => {state stuff}
  tick(){
    this.setState((state)=>({
      remaining: state.remaining-1000
    }));
  }
  render(){
    clearInterval(this.counter);
    return(
      <div className='container'>
        <div id='clock'>
          <Break 
            increment={(label)=>this.increment(label)}
            decrement={(label)=>this.decrement(label)}
            breakTime={this.convertMinutes(this.state.break)}/>
          <Timer 
            toggle={()=>this.toggleTimer()}
            reset={()=>this.resetClock()}
            label={this.state.currentLabel}
            running={this.state.running}
            remaining={this.convertTime(this.state.remaining)}/>
          <Session 
            increment={(label)=>this.increment(label)}
            decrement={(label)=>this.decrement(label)}
            sessionTime={this.convertMinutes(this.state.session)}/>
        </div>
      </div>
    );
  }
}

ReactDOM.render(<Clock />,document.getElementById('root'));

