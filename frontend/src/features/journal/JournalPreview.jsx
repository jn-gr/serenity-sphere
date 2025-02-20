import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const JournalPreview = ({ entry }) => {
  const emotionList = entry.emotions?.slice(0, 3).map(e => e[0]).join(', ') || '';

  return (
    <motion.div 
      whileHover={{ x: 5 }}
      className="border-b border-calm-100 py-4 last:border-0"
    >
      <Link to={`/journal/${entry.id}`} className="block hover:text-primary.DEFAULT">
        <div className="flex justify-between items-center">
          <div>
            <h4 className="font-medium">
              {new Date(entry.date).toLocaleDateString()}
            </h4>
            <p className="text-calm-400 text-sm line-clamp-1">
              {entry.content}
            </p>
          </div>
          {emotionList && (
            <span className="bg-primary.light text-primary.DEFAULT px-3 py-1 rounded-full text-sm">
              {emotionList}
            </span>
          )}
        </div>
      </Link>
    </motion.div>
  );
};

export default JournalPreview; 