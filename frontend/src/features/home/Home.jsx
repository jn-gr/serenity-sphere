// frontend/src/features/home/Home.jsx
import React from 'react';
import '../../styles/layouts/_home.css';
import HomeJournalCard from '../../components/cards/HomeJournalCard';
import HomeMoodLogCard from '../../components/cards/HomeMoodLogCard';

const Home = () => {
    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold text-center mb-8">Welcome to Serenity Sphere</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="card bg-base-100 shadow-xl">
                    <div className="card-body p-4">
                        <HomeJournalCard />
                    </div>
                </div>
                <div className="card bg-base-100 shadow-xl">
                    <div className="card-body p-4">
                        <HomeMoodLogCard />
                    </div>
                </div>
                <div className="card bg-base-100 shadow-xl p-4">
                    <div className="card-body">
                        <h2 className="card-title">Mental Health Awareness</h2>
                        <p>Mental health is an essential part of our overall well-being. It affects how we think, feel, and act.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;