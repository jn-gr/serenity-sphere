import { useTheme } from '../../context/ThemeContext'
import '../../styles/components/_theme-toggle.css'
import themeDark from '../../assets/theme_dark.svg'
import themeWhite from '../../assets/theme_white.svg'

const ThemeToggle = () => {
  const { isDark, toggleTheme } = useTheme()

  return (
    <div className="navbar-link">
      <button
        onClick={toggleTheme}
        className="theme-toggle"
        aria-label="Toggle theme"
      >
        <img src={isDark ? themeWhite : themeDark} alt="Toggle Theme" style={{ height: '24px' }} />
      </button>
    </div>
  )
}

export default ThemeToggle
