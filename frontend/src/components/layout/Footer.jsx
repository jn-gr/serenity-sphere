import '../../styles/components/_footer.css'

const Footer = () => {
  return (
    <footer className="bg-calm-100 border-t border-calm-200">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-4 mb-4 md:mb-0">
            <span className="text-lg text-serenity-dark">Serenity Sphere</span>
          </div>
          <p className="text-sm text-calm-400">
            © 2024 Serenity Sphere. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 