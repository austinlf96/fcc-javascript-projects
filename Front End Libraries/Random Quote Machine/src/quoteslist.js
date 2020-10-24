import React from 'react';

class QuotesList extends React.Component{
    constructor(props){
        super(props);
        this.state={
            allQuotes: []
        };
    }
    componentDidMount(){
        fetch('https://raw.githubusercontent.com/JamesFT/Database-Quotes-JSON/master/quotes.json')
            .then( resp => resp.json())
            .then((data)=> {
                this.setState({
                    allQuotes: data
                })
            })
            .catch((error)=> console.error(error));       
    }
    render(){
        return (
            <div>
                <h1>Hey there</h1>
                {this.state.allQuotes.map((quote)=>{
                    return (<p>{quote.quoteText + quote.quoteAuthor}</p>);
                })}
            </div>
        );
        
    }
}

export default QuotesList


import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';
//import QuotesList from './quoteslist'
//let quotes=['hi','im','something'];
let colors=[];
class Text extends React.Component{
    render(){
        return(
            <div>
                <div id='text' color={this.props.color}>
                    {this.props.text}
                </div>
                <div id='author' color={this.props.color}>
                    -{this.props.author}
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
        const colors=[];
        this.setState({
            text: newQuote.quoteText,
            author: newQuote.quoteAuthor,
            color: colors[Math.floor(Math.random * colors.length)],
            quotesHistory: history.concat(currentQuote),
            quoteNumber: this.state.quoteNumber + 1
        });

    }
    goBack(){
        const previousQuote= this.state.quotesHistory[this.state.quoteNumber-1];
        this.setState({
            text: previousQuote.text,
            author: previousQuote.author,
            color: previousQuote.color,
            quoteNumber: this.state.quoteNumber-1
        });
    }
    
    goForward(){
        let nextQuote= this.state.quotesHistory[-1 + this.state.quoteNumber];
        //this.state.quoteNumber + 1 === this.state.quotesHistory.length 
        //    ? nextQuote= this.state.quotesHistory[this.state.quotesHistory.length]
        //    : nextQuote= this.state.quotesHistory[this.state.quoteNumber+1]
        
        this.setState({
            text: nextQuote.text,
            author: nextQuote.author,
            color: nextQuote.color,
            quoteNumber: this.state.quoteNumber+1            
        })
    }
   
    render(){
        let {text, author, quoteNumber, color, quotesHistory}=this.state;
        if(this.state.loading) 
        {
            return (<h2 id='load'>Loading...</h2>)
        } else {
            const forwardButton=<button id='foward-button' onClick={()=>this.goForward()}>Go forward</button>;
            const backButton= <button id='back-button' onClick={()=>this.goBack()}>Go back</button>;
            return(
                <div id='quote-box' background-color={this.state.color}>
                    {quoteNumber + ' , ' + quotesHistory.length}
                    {this.state.quotesHistory.map((quote, num)=>{
                        return (<p>{quote.text + ' ' + quote.author}</p>);
                    })}
                    <Text text={text} author={author}/>
                    <div id='buttons'>
                    {quoteNumber>1 && quotesHistory.length>1  
                        ? backButton 
                        : <div></div>}
                    {
                    quoteNumber !== quotesHistory.length  
                       ? forwardButton 
                       : <div></div> 
                    }
                    </div>
                    <div id='new-quote'>
                        <button onClick={()=>this.newQuote()}>
                        New Quote
                        </button>
                    </div>
                    <div id='tweet'>
                        <a id='tweet-quote' href='www.twitter.com/intent/tweet/' className='social-button'><i class="fa fa-twitter" aria-hidden="true"></i>a friend in need is a friend indeed</a>
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
*/}