import React from 'react';
import { FaGithub, FaLinkedin } from 'react-icons/fa';

function Footer() {
  return (
    <footer className="p-4 from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 text-gray-800 dark:text-gray-100 text-center fixed bottom-0 w-full">
      <div className="flex items-center justify-center space-x-4">
        <p>Semih Mert</p>
        <a
          href="https://github.com/semihmertdev"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-800 dark:text-gray-100 hover:text-gray-600 dark:hover:text-gray-300 transition duration-300 ease-in-out"
        >
          <FaGithub className="w-6 h-6" />
        </a>
        <a
          href="https://www.linkedin.com/in/semihmert/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-800 dark:text-gray-100 hover:text-gray-600 dark:hover:text-gray-300 transition duration-300 ease-in-out"
        >
          <FaLinkedin className="w-6 h-6" />
        </a>
      </div>
    </footer>
  );
}

export default Footer;
