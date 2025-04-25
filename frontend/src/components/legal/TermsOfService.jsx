import React, { useState } from 'react';
import Modal from '../common/Modal';

const TermsOfService = ({ isLink = true }) => {
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
          Terms of Service
        </button>
        <TermsModal isOpen={isModalOpen} onClose={closeModal} />
      </>
    );
  }
  
  // Otherwise, render just the content (for use in standalone pages)
  return <TermsContent />;
};

// Separated content component
export const TermsContent = () => {
  return (
    <div className="text-[#B8C7E0] space-y-6">
      <p>Last Updated: May 2025</p>
      
      <section className="space-y-2">
        <h3 className="text-lg font-semibold text-white">1. Introduction</h3>
        <p>
          These Terms of Service govern your use of Serenity Sphere, a university project application. By using this application, you agree to these terms.
        </p>
      </section>
      
      <section className="space-y-2">
        <h3 className="text-lg font-semibold text-white">2. Service Description</h3>
        <p>
          Serenity Sphere is a digital mental wellness application that offers mood tracking, journaling, and emotional analysis tools for educational and demonstration purposes.
        </p>
        <p>
          <strong className="text-white">Important:</strong> This application is a university project and not intended for actual medical use or professional mental health treatment.
        </p>
      </section>
      
      <section className="space-y-2">
        <h3 className="text-lg font-semibold text-white">3. User Content</h3>
        <p>
          Any content you create within the application (such as journal entries and mood logs) remains your property. You are responsible for the content you provide.
        </p>
      </section>
      
      <section className="space-y-2">
        <h3 className="text-lg font-semibold text-white">4. Privacy</h3>
        <p>
          We respect your privacy. Please review our Privacy Policy to understand how we handle your information.
        </p>
      </section>
      
      <section className="space-y-2">
        <h3 className="text-lg font-semibold text-white">5. Limitations</h3>
        <p>
          Since this is a university project, we do not guarantee continuous availability, accuracy, or security of the application. Use it at your own risk.
        </p>
      </section>
      
      <section className="space-y-2">
        <h3 className="text-lg font-semibold text-white">6. Changes</h3>
        <p>
          These terms may be updated as the project evolves. Continued use of the application after changes indicates your acceptance of the revised terms.
        </p>
      </section>
    </div>
  );
};

// Modal wrapper component
const TermsModal = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Terms of Service">
      <TermsContent />
    </Modal>
  );
};

export default TermsOfService; 