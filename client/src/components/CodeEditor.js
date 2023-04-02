import React from "react";
import Editor from "@monaco-editor/react";
import axios from "axios";
import { useState } from "react";
const CodeEditor = () => {
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [input, setInput] = useState("");
  const [expectedOutput, setExpectedOutput] = useState("");
  const [passed, setPassed] = useState(false);
  const testCase = [
    {input: "1 2", output: "3"},
    {input: "2 3", output: "5"},
    {input: "3 4", output: "7"},
    {input: "4 5", output: "9"},
    {input: "5 6", output: "11"}
  ];
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(code);
    axios
      .post("http://localhost:4000/submission/cpp", { code, input, testCase })
      .then((res) => {
        console.log(res.data.numPassed);
        // console.log(res.)
        setOutput(res.data.numPassed);
        // console.log(res.data);
        // console.log(expectedOutput);
        // console.log(testCase);
        // if (res.data == expectedOutput) {
        //   setPassed(true);
        // } else {
        //   setPassed(false);
        // }
        // console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const handleCodeChange = (value) => {
    console.log(value);
    setCode(value);
  };
  return (
    <div className="flex">
      <div className="text-2xl basis-3/4">
        <Editor
          height="90vh"
          defaultLanguage="cpp"
          defaultValue="// some comment"
          theme="vs-dark"
          width={`100%`}
          onChange={handleCodeChange}
        />
      </div>
      <div className="text-xl font-semibold basis-1/4 px-2">
        <p>Input</p>
        <textarea
          className="block mt-2 border-2 border-black"
          rows={6}
          cols={28}
          onChange={(e) => setInput(e.target.value)}
          type="text"
        />
        <p>Expected Output</p>
        <textarea
          className="block mt-2 border-2 border-black"
          rows={6}
          cols={28}
          type="text"
          onChange={(e) => setExpectedOutput(e.target.value)}
        />
        <button
          className="mt-3 rounded-md bg-indigo-600 px-3.5 py-1.5 text-base font-semibold leading-7 text-white hover:bg-indigo-500 "
          onClick={handleSubmit}
        >
          Run Code
        </button>
        {passed && <p className="text-green-500">Passed</p>}
        {!passed && <p className="text-red-500">Failed</p>}
        {output && <p>Output : {output}</p>}
      </div>
    </div>
  );
};

export default CodeEditor;
