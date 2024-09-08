import React from 'react';
import { Link } from 'react-router-dom';
import { PlayCircle } from 'lucide-react';

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 text-gray-800 dark:text-gray-100 p-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 space-y-6">
        <h1 className="text-4xl font-bold text-center text-yellow-800 dark:text-yellow-400">
          Welcome to the Adventure!
        </h1>
        <p className="text-center text-gray-700 dark:text-gray-300">
          Find Waldo, Wizard, and Wilma in the photos. Follow the clues, beat the clock, and score high!
        </p>
        <div className="flex flex-col space-y-4">
          <Link to="/game" className="w-full">
            <button className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 px-6 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 flex items-center justify-center space-x-2">
              <PlayCircle className="w-5 h-5" />
              <span>Start Game</span>
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
