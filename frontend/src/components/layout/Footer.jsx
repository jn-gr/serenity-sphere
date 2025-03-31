import { useSelector } from 'react-redux';

const FOOTER_LINKS = [
  { label: 'Privacy', href: '#' },
  { label: 'Terms', href: '#' },
  { label: 'Contact', href: '#' }
];

const Footer = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  return (
    <footer className="bg-[#1A2335] border-t border-[#2A3547] mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex flex-col md:flex-row justify-between items-center text-sm">
          <span className="text-[#B8C7E0] mb-2 md:mb-0">
            © {new Date().getFullYear()} Serenity Sphere. All rights reserved.
          </span>
          <div className="flex space-x-4">
            {FOOTER_LINKS.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                className="text-[#B8C7E0] hover:text-[#5983FC] transition-colors"
              >
                {label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 