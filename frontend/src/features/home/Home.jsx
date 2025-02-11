// frontend/src/features/home/Home.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import HomeJournalCard from '../../components/cards/HomeJournalCard';
import HomeMoodLogCard from '../../components/cards/HomeMoodLogCard';
import '../../styles/layouts/_home.css';

const Home = () => {
  const features = [
    {
      title: "AI-Powered Insights",
      description: "Get instant emotional analysis of your journal entries",
      icon: "🧠"
    },
    {
      title: "Mood Tracking",
      description: "Visualize your emotional journey over time",
      icon: "📈"
    },
    {
      title: "Secure & Private",
      description: "Your data remains completely confidential",
      icon: "🔒"
    }
  ];

  return (
    <div className="min-h-screen bg-calm-100">
      {/* Hero Section */}
      <section className="relative pt-20 pb-24 bg-gradient-to-b from-primary.light to-white">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-5xl font-bold text-serenity-dark mb-6">
              Find Your Inner Peace with Serenity Sphere
            </h1>
            <p className="text-xl text-calm-400 mb-8">
              Your compassionate companion for mental wellness and emotional balance
            </p>
            <div className="flex justify-center gap-4">
              <Link 
                to="/journal" 
                className="bg-primary.DEFAULT hover:bg-primary.dark text-white px-8 py-4 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105"
              >
                Start Journaling
              </Link>
              <Link 
                to="/mood-log" 
                className="bg-secondary.DEFAULT hover:bg-secondary.dark text-white px-8 py-4 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105"
              >
                Track Your Mood
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.2 }}
                className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-2xl font-semibold text-serenity-dark mb-3">
                  {feature.title}
                </h3>
                <p className="text-calm-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Cards Section */}
      <section className="py-16 bg-calm-100">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-serenity-dark mb-12">
            Start Your Wellness Journey
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <HomeJournalCard />
            <HomeMoodLogCard />
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="bg-primary.light rounded-3xl p-12 text-center">
            <h3 className="text-2xl font-semibold text-serenity-dark mb-6">
              "Serenity Sphere helped me understand my emotions better than any other app I've tried."
            </h3>
            <p className="text-calm-400">- Sarah, Daily User</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;