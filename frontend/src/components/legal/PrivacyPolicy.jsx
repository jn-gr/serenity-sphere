import React, { useState } from 'react';
import Modal from '../common/Modal';

const PrivacyPolicy = ({ isLink = true }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // If used as a link, render link + modal
  if (isLink) {
    return (
      <>
        <button 
          onClick={openModal} 
          className="text-[#5983FC] hover:text-[#3E60C1] inline font-medium"
        >
          Privacy Policy
        </button>
        <PrivacyModal isOpen={isModalOpen} onClose={closeModal} />
      </>
    );
  }
  
  // Otherwise, render just the content (for use in standalone pages)
  return <PrivacyContent />;
};

// Separated content component
export const PrivacyContent = () => {
  return (
    <div className="text-[#B8C7E0] space-y-6">
      <p>Last Updated: May 2025</p>
      
      <section className="space-y-2">
        <h3 className="text-lg font-semibold text-white">1. Introduction</h3>
        <p>
          This Privacy Policy explains how information is collected and used in the Serenity Sphere application, which is developed as a university project.
        </p>
        <p>
          <strong className="text-white">Educational Purpose:</strong> This application is for educational and demonstration purposes only.
        </p>
      </section>
      
      <section className="space-y-2">
        <h3 className="text-lg font-semibold text-white">2. Information We Collect</h3>
        <p>
          Through this application, we may collect:
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li><span className="text-white">Account Information:</span> Email address and username</li>
          <li><span className="text-white">Content:</span> Journal entries and mood logs</li>
          <li><span className="text-white">Usage Data:</span> Information about how you use the application</li>
        </ul>
      </section>
      
      <section className="space-y-2">
        <h3 className="text-lg font-semibold text-white">3. How We Use Information</h3>
        <p>
          We use the collected information to:
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Provide and improve the application features</li>
          <li>Personalize your experience</li>
          <li>Analyze usage patterns for educational research</li>
        </ul>
      </section>
      
      <section className="space-y-2">
        <h3 className="text-lg font-semibold text-white">4. Data Security</h3>
        <p>
          As this is a university project, we implement basic security measures but cannot guarantee complete data security. Please do not use this application for sensitive personal information.
        </p>
      </section>
      
      <section className="space-y-2">
        <h3 className="text-lg font-semibold text-white">5. Your Rights</h3>
        <p>
          You have the right to:
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Access your data</li>
          <li>Request correction of your data</li>
          <li>Delete your account and associated data</li>
        </ul>
      </section>
      
      <section className="space-y-2">
        <h3 className="text-lg font-semibold text-white">6. Changes</h3>
        <p>
          This Privacy Policy may be updated as the project develops. Please review it periodically.
        </p>
      </section>
    </div>
  );
};

// Modal wrapper component
const PrivacyModal = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Privacy Policy">
      <PrivacyContent />
    </Modal>
  );
};

export default PrivacyPolicy; 