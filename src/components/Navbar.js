import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Sun, Moon } from 'lucide-react';

function Navbar() {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  return (
    <nav className="p-4 bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 flex justify-between items-center w-full fixed top-0 text-lg font-bold	">
      <div className="flex space-x-4">
        <Link to="/" className="flex items-center space-x-1">
          <span className="text-gray-700 dark:text-yellow-400 hover:text-yellow-400 dark:hover:text-gray-100">Hidden</span>
          <span className="text-yellow-400 dark:text-gray-100 hover:text-gray-700 dark:hover:text-yellow-400">Heroes</span>
        </Link>
        <Link to="/scoreboard" className="text-gray-800 dark:text-gray-200 hover:text-yellow-400 dark:hover:text-yellow-400">
          Scoreboard
        </Link>
      </div>
      <button
        onClick={() => setDarkMode(!darkMode)}
        className="bg-gray-300 dark:bg-gray-700 p-2 rounded-full text-gray-800 dark:text-gray-200 hover:bg-gray-400 dark:hover:bg-gray-200 transition-colors"
      >
        {darkMode ? <Sun className="text-yellow-400" /> : <Moon className="text-gray-800" />}
      </button>
    </nav>
  );
}

export default Navbar;
