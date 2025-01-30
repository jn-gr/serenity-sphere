import React from 'react'
import { Link } from 'react-router-dom'
import { FaHome, FaBook, FaUserFriends,} from 'react-icons/fa' // Import React Icons

const Home = () => {
    return (
        <div className="home-container">
            <h1>Welcome to Serenity Sphere</h1>
            <div className="home-features">
                <div className="feature">
                    <FaBook size={40} />
                    <h3>Daily Journaling</h3>
                    <p>Keep track of your thoughts and reflections every day.</p>
                    <Link to="/journal">Get Started</Link>
                </div>
            </div>
        </div>
    )
}

export default Home