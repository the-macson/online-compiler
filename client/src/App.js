import './App.css';
import { useState } from 'react';
import axios from 'axios';
import Header from './components/Header';
import Editor from './components/CodeEditor';
function App() {
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [input, setInput] = useState('');
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(code);
    axios.post('http://localhost:4000/submit', { code, input})
      .then(res => {
        setOutput(res.data);
        console.log(res);
      })
      .catch(err => {
        console.log(err);
      });
  };
  const handleCodeChange = (e) => {
    setCode(e.target.value);
  };
  return (
    <div className="App">
      <Header />
      <Editor />
      {/* <SubmitCode />
      <header className="App-header">
        <textarea onChange={handleCodeChange} name="" id="" cols="50" rows="30"/>
        <br />
        <input type="text" onChange={(e) => setInput(e.target.value)} />
        <br />
        <button onClick={handleSubmit}>Submit</button>
        <br />
        <h4>Output : {output}</h4>
      </header> */}
    </div>
  );
}

export default App;
