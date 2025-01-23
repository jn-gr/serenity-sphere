import { useTheme } from '../../context/ThemeContext';
import '../../styles/components/_theme-toggle.css';

const ThemeToggle = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button 
      onClick={toggleTheme}
      className="theme-toggle"
      aria-label="Toggle theme"
    >
      {isDark ? 'Light' : 'Dark'}
    </button>
  );
};

export default ThemeToggle; 