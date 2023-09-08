import './App.css'
import Editor from './editor/codeEditor'
function App() {


  return (
    <>
     <h1>Node Editor in browser</h1>
     <span className='language-version'>node version: v16.20.0</span>
      <Editor/>
    </>
  )
}

export default App
