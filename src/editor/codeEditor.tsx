import React from 'react';
import CodeEditor from '@uiw/react-textarea-code-editor';
import './codeEditor.css'
import { getWebContainerInstance } from '../webcontainer/instance'
import ANSIToHTML from 'ansi-to-html'

export default function Editor() {
  const [code, setCode] = React.useState(
    `import chalk from 'chalk';

function sayAMessageFromBrowserWithNodejs(message, nameColor){
    // checking if the is a valid color
    if (chalk[nameColor]) {
        console.log(chalk[nameColor](message));
    } else {
        console.error('Color invalid');
    }
}
    
// example:
sayAMessageFromBrowserWithNodejs('Your Custom message!', 'red');`    
);

  const [output, setOutput] = React.useState<string[]>([])
  const [isRunning, setIsRunning] = React.useState(false)
  const ANSIConverter = new ANSIToHTML()

  async function handleEvaluateCode() {
    setIsRunning(true)
    const webContainer = await getWebContainerInstance()

    await webContainer.mount({
        'index.js': {
            file: {
                contents: code
            },
        },
        'package.json': {
            file: {
                contents: `
                    {
                        "name": "example-app",
                        "type": "module",
                        "dependencies": {
                            "chalk": "latest"
                        },
                        "scripts": {
                            "start": "node index.js"
                        }
                        
                    }
                `.trim()
            }
        }
    })
    
    const install = await webContainer.spawn('npm', ['i'])

    install.output.pipeTo(
        new WritableStream({
            write(data) {
                setOutput((state) => [...state, ANSIConverter.toHtml(data)])
            }
        })
    )
    await install.exit

    const start = await webContainer.spawn('npm', ['start'])

    start.output.pipeTo(
        new WritableStream({
            write(data) {
                setOutput((state) => [...state, ANSIConverter.toHtml(data)])
            }
        })
    )
    await start.exit
    handleStopEvaluateCode()
  }

  function handleStopEvaluateCode() {
    setIsRunning(false)
  }

  return (
    <>
        <CodeEditor
        value={code}
        language="js"
        placeholder="Please enter JS code."
        onChange={(evn) => setCode(evn.target.value)}
        padding={15}
        minHeight={100}
        spellCheck={false}
        style={{
            borderRadius: 10,
            fontSize: 16,
            marginBottom: 8,
            marginTop: 16,
            backgroundColor: "#212002e",
            fontFamily: 'ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace',
        }}
        />
        <div 
        className='output'
        contentEditable={false}
        spellCheck={false}
        >
            <div className='output-terminal-header'>
                <p>Terminal</p>
                <p className='language-name'>nodejs</p>
            </div>
            
            {isRunning || output[0] != undefined ? (
                <span className='output-message'>
                    {
                        output.map((line)=> {
                            return <p key='line' dangerouslySetInnerHTML={{__html: line}}/>
                        })
                    }
                </span>
            ): (
                <span className='output-message'>
                    Click on run to evaluate the code.
                </span>
            )}
        </div>
        <button 
        className='runcode'
        contentEditable={false}
        type='button'
        onClick={handleEvaluateCode}
        disabled={isRunning ? true : false}
        >
            Run code
        </button>
     </>
  );
}