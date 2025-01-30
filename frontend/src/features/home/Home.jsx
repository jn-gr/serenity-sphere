// frontend/src/features/home/Home.jsx
import React from 'react';
import '../../styles/layouts/_home.css';
import HomeJournalCard from '../../components/cards/HomeJournalCard';
import HomeMoodLogCard from '../../components/cards/HomeMoodLogCard';

const Home = () => {
    return (
        <div className="home-container grid grid-cols-10 grid-rows-2 gap-10">
            <div className="home-features col-start-2 col-span-2 row-start-1 row-span-1">
                <div className="feature mb-4">
                    <HomeJournalCard />
                </div>
                <div className="feature mb-4">
                    <HomeMoodLogCard />
                </div>
            </div>
            <div className="mental-health-info col-start-4 col-span-3 row-start-1 row-span-1 p-3">
                <h2 className="text-2xl font-bold mb-4">Mental Health Awareness</h2>
                <p>
                    Mental health is an essential part of our overall well-being. It affects how we think, feel, and act. 
                </p>
            </div>
        </div>
    );
}

export default Home;