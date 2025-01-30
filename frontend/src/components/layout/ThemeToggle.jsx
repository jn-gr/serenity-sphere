import { useTheme } from '../../context/ThemeContext'
import '../../styles/components/_theme-toggle.css'

import { FaSun, FaMoon } from 'react-icons/fa'

const ThemeToggle = () => {
  const { isDark, toggleTheme } = useTheme()

  return (
    <button onClick={toggleTheme} className="theme-toggle-button" aria-label="Toggle Theme">
      {isDark ? <FaSun size={20} /> : <FaMoon size={20} />}
    </button>
  )
}

export default ThemeToggle
