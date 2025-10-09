import React, { useState, useEffect } from 'react'
import "./App.css"
import Navbar from './components/Navbar'
import Editor from '@monaco-editor/react';
import Select from 'react-select';
import { GoogleGenAI } from "@google/genai";
import Markdown from 'react-markdown'
import RingLoader from "react-spinners/RingLoader";

const App = () => {
  const options = [
    { value: 'javascript', label: 'JavaScript' },
    { value: 'python', label: 'Python' },
    { value: 'java', label: 'Java' },
    { value: 'csharp', label: 'C#' },
    { value: 'c', label: 'C' },
    { value: 'cpp', label: 'C++' },
    { value: 'php', label: 'PHP' },
    { value: 'sql', label: 'SQL' },
    { value: 'ruby', label: 'Ruby' },
    { value: 'go', label: 'Go' },
    { value: 'swift', label: 'Swift' },
    { value: 'kotlin', label: 'Kotlin' },
    { value: 'typescript', label: 'TypeScript' },
    { value: 'rust', label: 'Rust' },
    { value: 'dart', label: 'Dart' },
    { value: 'scala', label: 'Scala' },
    { value: 'perl', label: 'Perl' },
    { value: 'haskell', label: 'Haskell' },
    { value: 'elixir', label: 'Elixir' },
    { value: 'r', label: 'R' },
    { value: 'matlab', label: 'MATLAB' },
    { value: 'bash', label: 'Bash' }
  ];

  const [selectedOption, setSelectedOption] = useState(options[0]);

  const customStyles = {
    control: (provided) => ({
      ...provided,
      backgroundColor: '#18181b', // dark background (similar to bg-zinc-900)
      borderColor: '#3f3f46',
      color: '#fff',
      width: "100%"
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: '#18181b', // dropdown bg
      color: '#fff',
      width: "100%"
    }),
    singleValue: (provided) => ({
      ...provided,
      color: '#fff',  // selected option text
      width: "100%"
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused ? '#27272a' : '#18181b',  // hover effect
      color: '#fff',
      cursor: 'pointer',
      // width: "30%"
    }),
    input: (provided) => ({
      ...provided,
      color: '#fff',
      width: "100%"
    }),
    placeholder: (provided) => ({
      ...provided,
      color: '#a1a1aa',
      width: "100%"
    }),
  };

  const [code, setCode] = useState("");
  // theme: 'dark' | 'light'
  const [theme, setTheme] = useState('dark')

  useEffect(() => {
    // toggle a class on body so CSS can react
    if (typeof document !== 'undefined') {
      document.body.classList.toggle('light', theme === 'light')
    }
  }, [theme])

  function toggleTheme() {
    setTheme((t) => (t === 'dark' ? 'light' : 'dark'))
  } 

  const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState("");

  async function reviewCode() {
    setResponse("")
    setLoading(true);
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: `You are an expert-level software developer, skilled in writing efficient, clean, and advanced code.
I’m sharing a piece of code written in ${selectedOption.value}.
Your job is to deeply review this code and provide the following:

1️⃣ A quality rating: Better, Good, Normal, or Bad.
2️⃣ Detailed suggestions for improvement, including best practices and advanced alternatives.
3️⃣ A list of any potential bugs or logical errors, if found.
4️⃣ Identification of syntax errors or runtime errors, if present.
5️⃣ Solutions and recommendations on how to fix each identified issue.

Analyze it like a senior developer reviewing a pull request.

Code: ${code}
`,
    });
    setResponse(response.text)
    setLoading(false);
  }

  // Fix code: generate a corrected/fixed version 
  async function fixCode() {
    setResponse("")
    setLoading(true);
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: `You are an expert-level software developer, skilled in writing efficient, clean, and advanced code.
I’m sharing a piece of code written in ${selectedOption.value}.
Your job is to deeply review this code and provide the following:

A corrected/fixed version of the code(include only the updated code block clearly labeled), and a clear explanation of what changed.

Return a concise, copy-pasteable fixed code block followed by the explanation.

Code: ${code}
`,
    });
    setResponse(response.text)
    setLoading(false);
  }


  return (
    <>
      <Navbar theme={theme} toggleTheme={toggleTheme} />
      <div className="main flex justify-between" style={{ height: "calc(100vh - 90px" }}>
        <div className="left h-[87.5%] w-[50%]">
          <div className="tabs !mt-5 !px-5 !mb-3 w-full flex items-center gap-[10px]">
            <Select
              value={selectedOption}
              onChange={(e) => { setSelectedOption(e) }}
              options={options}
              styles={theme === 'dark' ? customStyles : {
                ...customStyles,
                control: (provided) => ({
                  ...provided,
                  backgroundColor: '#ffffff',
                  borderColor: '#d1d5db',
                  color: '#0b1220'
                }),
                singleValue: (provided) => ({ ...provided, color: '#0b1220' }),
                menu: (provided) => ({ ...provided, backgroundColor: '#fff', color: '#0b1220' }),
                option: (provided, state) => ({ ...provided, backgroundColor: state.isFocused ? '#f3f4f6' : '#fff', color: '#0b1220' })
              }}
            />
            <button
              onClick={() => {
                if (code === "") {
                  alert("Please enter code first")
                } else {
                  fixCode()
                }
              }}
              disabled={loading}
              className={`btnNormal min-w-[120px] transition-all ${theme === 'light' ? 'btnReview' : 'bg-zinc-900'} ${loading ? 'opacity-60 cursor-not-allowed' : 'hover:bg-zinc-800'}`}>
              Fix Code
            </button>

            <button
              onClick={() => {
                if (code === "") {
                  alert("Please enter code first")
                }
                else {
                  reviewCode()
                }
              }}
              disabled={loading}
              className={`btnNormal min-w-[120px] transition-all ${theme === 'light' ? 'btnReview' : 'bg-zinc-900'} ${loading ? 'opacity-60 cursor-not-allowed' : 'hover:bg-zinc-800'}`}>
              Review
            </button>
          </div>
                            
          <Editor
            height="100%"
            theme={theme === 'dark' ? 'vs-dark' : 'light'}
            language={selectedOption.value}
            value={code}
            onChange={(e) => { if (!loading) setCode(e) }}
            options={{ automaticLayout: true, readOnly: loading }}
          />
        </div>

        <div className={`right overflow-scroll !p-[10px] w-[50%] h-[101%]`} style={{ backgroundColor: theme === 'dark' ? '#0b0b0c' : '#ffffff' }}>
          <div className="topTab border-b-[1px] border-t-[1px] border-[#27272a] flex items-center justif-between h-[60px]">
            <p className='font-[700] text-[17px]'>Response</p>
          </div>
          {loading && <RingLoader color= '#1d4ed8'/>}
          <div style={{ color: theme === 'dark' ? '#d1d5db' : '#0b1220' }}>
            <Markdown>{response}</Markdown>
          </div>
        </div>
      </div>
    </>
  )
}


export default App