import { motion } from 'framer-motion';
import { FaCalendarAlt, FaClock } from 'react-icons/fa';

const JournalPreview = ({ entry }) => {
  return (
    <motion.div 
      whileHover={{ scale: 1.01 }}
      className="bg-[#0F172A] rounded-xl p-4 transition-all duration-300"
    >
      <div className="flex items-start gap-4">
        <div className="bg-[#3E60C1]/20 p-2 rounded-lg flex-shrink-0">
          <FaCalendarAlt className="text-[#5983FC]" size={16} />
        </div>
        
        <div className="flex-grow min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <h4 className="text-white font-medium truncate">
              {new Date(entry.date).toLocaleDateString(undefined, {
                weekday: 'long',
                month: 'short',
                day: 'numeric'
              })}
            </h4>
            <div className="flex items-center gap-1 text-xs text-[#B8C7E0]">
              <FaClock className="text-[#5983FC]" size={10} />
              <span>
                {new Date(entry.date).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>
          </div>
          
          <p className="text-[#B8C7E0] text-sm line-clamp-2 leading-relaxed">
            {entry.content}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default JournalPreview; 