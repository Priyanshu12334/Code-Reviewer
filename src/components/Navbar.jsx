import React from 'react'
import { Columns2 } from 'lucide-react';
import { Sun, Moon } from 'lucide-react';

// Navbar receives theme and toggleTheme from parent (App)
const Navbar = ({ theme = 'dark', toggleTheme = () => {} }) => {
  const isDark = theme === 'dark'

  return (
    <>
      <div
        className={`nav flex items-center justify-between h-[90px]`}
        style={{ padding: "0px 150px", backgroundColor: isDark ? '#0f1720' : '#ffffff' }}
      >
        <div className="logo flex items-center gap-[10px]">
          
          <Columns2 size={30} color='#1d4ed8' />
          <span className={`text-2xl font-bold ml-2`} style= {{ color: isDark ? '#fff' : '#0b1220' }}>Codex</span>
        </div>
        <div className="icons flex items-center gap-[20px]">
          <button
            onClick={toggleTheme}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            className='cursor-pointer transition-all p-2 rounded-md'
            style={{ background: 'transparent', border: 'none' }}
          >
            {isDark ? <Sun color="#fbbf24" /> : <Moon color="#111827" />}
          </button>
        </div>
      </div>
    </>
  )
}

export default Navbar