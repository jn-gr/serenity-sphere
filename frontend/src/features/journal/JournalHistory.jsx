import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchJournalEntries } from './journalSlice';
import '../../styles/components/_journalHistory.css';

const JournalHistory = () => {
    const dispatch = useDispatch();
    const { entries, status, error } = useSelector(state => state.journal);

    useEffect(() => {
        if (status === 'idle') {
            console.log("Fetching journal entries...");
            dispatch(fetchJournalEntries());
        }
    }, [status, dispatch]);

    console.log("Current status:", status);
    console.log("Current entries:", entries);
    console.log("Current error:", error);

    let content;
    if (status === 'loading') {
        content = <p>Loading...</p>;
    } else if (status === 'succeeded') {
        if (entries.length === 0) {
            content = <p>No previous journal entries found.</p>;
        } else {
            content = entries.map(entry => (
                <div key={entry.id} className="journal-history-item">
                    <h3>{new Date(entry.date).toLocaleString()}</h3>
                    <p className="journal-content">{entry.content}</p>
                    {entry.emotions && entry.emotions.length > 0 && (
                        <div className="journal-emotions">
                            <h4>Emotions:</h4>
                            <ul>
                                {entry.emotions.map((emotion, idx) => (
                                    <li key={idx}>
                                        <span className="emotion-label">{emotion[0]}</span>: <span className="emotion-threshold">{Number(emotion[1]).toFixed(2)}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            ));
        }
    } else if (status === 'failed') {
        content = <p>{error}</p>;
    } else {
        content = <p>No data found.</p>;
    }

    return (
        <div className="journal-history">
            <h2>Journal History</h2>
            {content}
        </div>
    );
};

export default JournalHistory;