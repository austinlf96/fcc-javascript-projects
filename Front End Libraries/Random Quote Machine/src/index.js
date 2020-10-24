import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.css';
import './index.css';
import 'font-awesome/css/font-awesome.min.css';
import '../node_modules/font-awesome/css/font-awesome.min.css'; 
import * as serviceWorker from './serviceWorker';


class Text extends React.Component{
    render(){
        return(
            <div>
                <div id='text'>
                    <i className='fa fa-quote-left '></i> {this.props.text} <i className='fa fa-quote-right '></i>
                </div>
                <div id='author'>
                    <i className="fa fa-minus" aria-hidden="true"> </i>
                    {this.props.author}
                </div>
            </div>
        )
    }
}
class Quote extends React.Component{

    constructor(props){
        super(props);
        this.state= {
            loading: false,
            text: '',
            author: '',
            color: '',
            quotesHistory: [],
            quoteNumber: 0,
            quotes: []
        };
    }
    /*
    componentDidMount(){
        this.setState({loading: true});
        fetch('https://raw.githubusercontent.com/JamesFT/Database-Quotes-JSON/master/quotes.json')
            .then( resp => resp.json())
            .then((data)=> {
                this.setState({
                    loading: false,
                    quotes: data
                });

            })
            .catch((error)=> console.error(error));       
    }
    */
    componentWillMount(){
        this.setState({loading: true});
        fetch('https://raw.githubusercontent.com/JamesFT/Database-Quotes-JSON/master/quotes.json')
            .then( resp => resp.json())
            .then((data)=> {
                this.setState({
                    loading: false,
                    quotes: data
                });
                this.newQuote();
            })
            .catch((error)=> console.error(error));       
    }
    newQuote(){
 
        const newQuote= this.state.quotes[Math.floor(Math.random() * this.state.quotes.length)];
        const currentQuote= {text: this.state.text, author: this.state.author, color: this.state.color};
        const history= this.state.quotesHistory.slice(0, this.state.quoteNumber);
        const colors=['#e69053','#f56653','#bee649','#23f011','#11f0b1','#11f0f0','#11b8f0','#115ff0','#8a39db','#b339db','#db39ce','#e3205e','#ff0000',];
        this.setState({
            text: newQuote.quoteText,
            author: newQuote.quoteAuthor === '' ? 'Unknown' : newQuote.quoteAuthor,
            color: colors[Math.floor(Math.random() * colors.length)],
            quotesHistory: history.concat(currentQuote),
            quoteNumber: this.state.quoteNumber + 1
        });
        //this.animate(this.state.color);

    }
    goBack(){
        let history= this.state.quotesHistory;
        const previousQuote= this.state.quotesHistory[this.state.quoteNumber-1];
        const currentQuote= {text: this.state.text, author: this.state.author, color: this.state.color};
        if(this.state.quoteNumber === this.state.quotesHistory.length){
            history=history.concat(currentQuote);
        }
        this.setState({
            text: previousQuote.text,
            author: previousQuote.author,
            color: previousQuote.color,
            quotesHistory: history,
            quoteNumber: this.state.quoteNumber-1
        });
        //this.animate(this.state.color);
    }
    
    goForward(){
        let nextQuote= this.state.quotesHistory[this.state.quoteNumber+1];
        //this.state.quoteNumber + 1 === this.state.quotesHistory.length 
        //    ? nextQuote= this.state.quotesHistory[this.state.quotesHistory.length]
        //    : nextQuote= this.state.quotesHistory[this.state.quoteNumber+1]
        
        this.setState({
            text: nextQuote.text,
            author: nextQuote.author,
            color: nextQuote.color,
            quoteNumber: this.state.quoteNumber+1            
        })
        //this.animate(this.state.color);
    }
    /*
    animate(newColor){
        document.documentElement.style.setProperty('--color2', newColor);
        document.getElementById('page').classList.toggle('fadedOut');
        document.getElementById('new-quote').classList.toggle('fadedOut');
        document.getElementById('forward-button').classList.toggle('fadedOut');
        document.getElementById('back-button').classList.toggle('fadedOut');

    }
    */
    render(){
        let {text, author, quoteNumber, color, quotesHistory}=this.state;
        if(this.state.loading) 
        {
            return (<h2 id='load'>Loading...<i className="fa fa-spinner fa-spin" aria-hidden="true"></i></h2>)
        } else {
            const forwardButton=<button id='forward-button' className='direction-button fader' onClick={()=>{this.goForward()}}><i className="fa fa-arrow-circle-right fa-2x" aria-hidden="true" style={{backgroundColor: color}}></i></button>;
            const backButton= <button id='back-button' className='direction-button fader' onClick={()=>this.goBack()}><i className="fa fa-arrow-circle-left fa-2x" aria-hidden="true" style={{backgroundColor: color}} ></i></button>;
            return(
                <div id='page' className='container-fluid text-center fader' style={{backgroundColor: color}}>
                        <div id='quote-box'>
                            <Text text={text} author={author}/>
                            <div id='buttons'>                              
                                {quoteNumber>1 && quotesHistory.length>1  
                                    ? backButton 
                                    : <div></div>}
                                <div id='new-quote-button'>
                                    <button id='new-quote' className='fader' style={{color:color}} onClick={()=>this.newQuote()}>
                                    New Quote
                                    </button>
                                </div>
                                {quoteNumber < quotesHistory.length  
                                    ? quotesHistory.length - quoteNumber === 1
                                    ?  <div></div> 
                                    : forwardButton
                                    : <div></div>}                               
                            </div>
                            <div id='socials'>
                                <a id='tweet-quote' href={'https://www.twitter.com/intent/tweet?text='+encodeURIComponent('"'+text+'"-'+author)} target='_blank' className='social-button btn btn-primary'><i id='twitter-logo' className="fa fa-twitter" aria-hidden="true"></i></a>
                            </div>
                        </div>
                    
                </div>
            )
        }
    }
}



//--------------------------------------
ReactDOM.render(<Quote />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
