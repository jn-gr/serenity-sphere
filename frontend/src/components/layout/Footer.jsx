import { useSelector } from 'react-redux';
import '../../styles/components/_footer.css'

const Footer = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  return (
    <footer className={`${isAuthenticated ? 'ml-64' : ''} bg-[#1A2335] border-t border-[#2A3547]`}>
      <div className="container mx-auto px-8 py-4">
        <div className="flex flex-col md:flex-row justify-between items-center text-sm">
          <span className="text-[#B8C7E0] mb-2 md:mb-0">
            © 2024 Serenity Sphere. All rights reserved.
          </span>
          <div className="flex space-x-4">
            <a href="#" className="text-[#B8C7E0] hover:text-[#5983FC]">Privacy</a>
            <a href="#" className="text-[#B8C7E0] hover:text-[#5983FC]">Terms</a>
            <a href="#" className="text-[#B8C7E0] hover:text-[#5983FC]">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 