import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';
import './index.css';
import marked from 'marked';
import 'font-awesome/css/font-awesome.min.css';
let defaultMarkdown;

const renderer = new marked.Renderer();
marked.setOptions({
    breaks:true,
    gfm: true
});
class Markdown extends React.Component{
    constructor(props){
        super(props);
        this.state={
            loading: false,
            markdown: defaultMarkdown,
            hidden: false
        }
        this.handleChange=this.handleChange.bind(this);
        this.handleClick=this.handleClick.bind(this);
    }
    handleClick(){
        const editor= document.getElementById('editor');
        this.state.hidden ? editor.style.display='none' : editor.style.display='block';
        //Has a double click bug- come back if there's time
        this.setState((state)=>({
            hidden: !state.hidden
        }));
    }
    handleChange(event){
        this.setState({
            markdown: event.target.value
        });
    }
    render(){
        if(this.state.loading){
            return(<div>Loading...</div>);
        } else{
            return(
                <div>
                    <div id='header-editor'>
                        <header>
                            <h2>Editor</h2>
                            <h2>Markdown - Austin Frey</h2>
                            <button id='toggle' onClick={()=>this.handleClick()}><i className="fa fa-angle-double-down fa-2x" aria-hidden="true"></i></button>
                        </header>
                        <Editor 
                            handleChange={this.handleChange}
                            markdown={this.state.markdown}
                        />
                    </div>
                    <div id='windows'>
                        <Preview 
                            markdown={this.state.markdown}
                        />
                    </div>
                </div>
            );
        }
    }
}
class Editor extends React.Component{
    render(){    
        return (
            <div id='text-edit' className='window'>
                <textarea id='editor' value={this.props.markdown} placeholder='Mark me down!' onChange={(e) => this.props.handleChange(e)}></textarea>
            </div>
            );
    }
}
class Preview extends React.Component{
    render(){
        return(
            <div>
                <header>
                    <h2>Previewer</h2>
                </header>
                <div id='preview' className='window' dangerouslySetInnerHTML={{__html: marked(this.props.markdown, renderer)}} />
            </div>
        );
    }
}
defaultMarkdown=
`# Welcome to my React Markdown Previewer!

## This is a sub-heading...
### And here's some other cool stuff:
  
Heres some code, \`<div></div>\`, between 2 backticks.

\`\`\`
// this is multi-line code:

function anotherExample(firstLine, lastLine) {
  if (firstLine == '\`\`\`' && lastLine == '\`\`\`') {
    return multiLineCode;
  }
}
\`\`\`
  
You can also make text **bold**... whoa!
Or _italic_.
Or... wait for it... **_both!_**
And feel free to go crazy ~~crossing stuff out~~.

There's also [links](https://www.freecodecamp.org/austinlf96), and
> Block Quotes!

And if you want to get really crazy, even tables:

Wild Header | Crazy Header | Another Header?
------------ | ------------- | ------------- 
Your content can | be here, and it | can be here....
And here. | Okay. | I think we get it.

- And of course there are lists.
  - Some are bulleted.
     - With different indentation levels.
        - That look like this.


1. And there are numbererd lists too.
1. Use just 1s if you want! 
1. But the list goes on...
- Even if you use dashes or asterisks.
* And last but not least, let's not forget embedded images:

![React Logo w/ Text](https://goo.gl/Umyytc)
`;
ReactDOM.render(<Markdown />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();