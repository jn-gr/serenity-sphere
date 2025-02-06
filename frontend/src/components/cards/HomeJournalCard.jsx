import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';

const HomeJournalCard = () => {
  const { isDark } = useTheme(); // Get the current theme state

  return (
    <div className={`flex flex-col ${isDark ? 'bg-theme-color-dark-card' : 'bg-theme-color-card'} rounded-3xl`}>
      <div className="px-6 py-8 sm:p-10 sm:pb-6">
        <div className="grid items-center justify-center w-full grid-cols-1 text-left">
          <div>
            <h2 className="text-lg font-medium tracking-tighter" style={{ color: 'var(--text-color)' }}>
              Start Journaling today
            </h2>
            <p className="mt-2 text-sm" style={{ color: 'var(--text-color)' }}>
              Vent your thoughts and emotions.
            </p>
          </div>
        </div>
      </div>
      <div className="flex px-6 pb-8 sm:px-8">
        <Link
          to="/journal"
          aria-describedby="Journaling Card"
          className="items-center justify-center w-full px-6 py-2.5 text-center text-white duration-200 bg-black border-2 border-black rounded-full inline-flex hover:bg-transparent hover:border-black hover:text-black focus:outline-none focus-visible:outline-black text-sm focus-visible:ring-black"
        >
          Get started
        </Link>
      </div>
    </div>
  );
}

export default HomeJournalCard;