import { useState } from 'react';
import api from '../../services/api'; 
import '../../styles/components/_emotion.css'; // Import the CSS file

const EmotionDetector = () => {
    const [text, setText] = useState('');
    const [emotions, setEmotions] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await api.post('/api/detect-emotions/', { text });
            setEmotions(response.data.emotions);
            setError(null);
        } catch (err) {
            setError('Failed to detect emotions.');
            setEmotions([]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="emotion-detector">
            <h2>Emotion Detector (TESTING)</h2>
            <form onSubmit={handleSubmit}>
                <textarea
                    className="emotion-detector-textarea"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Write your thoughts here..."
                    rows="5"
                    cols="60"
                    required
                ></textarea>
                <br />
                <button type="submit" className="emotion-detector-button">Detect Emotions</button>
            </form>
            {loading && <p className="loading">Waiting for answer...</p>}
            {error && <p className="error">{error}</p>}
            {emotions.length > 0 && (
                <div className="detected-emotions">
                    <h3>Detected Emotions:</h3>
                    <ul>
                        {emotions.map((emotion, index) => (
                            <li key={index}>
                                {emotion[0]}: {emotion[1].toFixed(2)}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default EmotionDetector; 