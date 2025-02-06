import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import '../../styles/components/_journal.css';
import JournalForm from './JournalForm';
import { fetchJournalEntries, deleteJournalEntry } from './journalSlice';

const JournalList = () => {
    const dispatch = useDispatch();
    const { entries, status, error } = useSelector(state => state.journal);
    const [activeTab, setActiveTab] = useState("history");

    // When the history tab is active, fetch entries if needed.
    useEffect(() => {
        if (activeTab === "history" && status === 'idle') {
            dispatch(fetchJournalEntries());
        }
    }, [activeTab, status, dispatch]);

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this journal entry?")) {
            dispatch(deleteJournalEntry(id));
        }
    };

    return (
        <div className="container mx-auto my-8">
            <h2 className="text-2xl font-bold mb-4">Your Journal</h2>
            <div className="flex gap-4">
                <div className="w-60">
                    <ul className="menu p-2 bg-base-200 rounded-box">
                        <li className={activeTab === 'create' ? 'bg-base-300' : ''} onClick={() => handleTabClick('create')}>
                            <a>Create Journal</a>
                        </li>
                        <li className={activeTab === 'history' ? 'bg-base-300' : ''} onClick={() => handleTabClick('history')}>
                            <a>View Journal History</a>
                        </li>
                    </ul>
                </div>
                {/* Main Content Area */}
                <div className="flex-1">
                    {activeTab === 'create' ? (
                        <div className="card bg-base-100 shadow-xl">
                            <div className="card-body">
                                <JournalForm />
                            </div>
                        </div>
                    ) : (
                        <div>
                            {status === 'loading' && <p>Loading...</p>}
                            {status === 'failed' && <p>{error}</p>}
                            {status === 'succeeded' && entries.length === 0 && <p>No journal entries found.</p>}
                            {status === 'succeeded' && entries.length > 0 && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {entries.map(entry => (
                                        <div key={entry.id} className="card bg-base-100 shadow-xl relative">
                                            <div className="card-body">
                                                <h3 className="card-title">{new Date(entry.date).toLocaleString()}</h3>
                                                <p>{entry.content}</p>
                                                {entry.emotions && entry.emotions.length > 0 && (
                                                    <div className="mt-2">
                                                        <h4 className="font-semibold">Emotions:</h4>
                                                        <ul className="list-disc list-inside">
                                                            {entry.emotions.map((emotion, idx) => (
                                                                <li key={idx}>
                                                                    {emotion[0]}: {Number(emotion[1]).toFixed(2)}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )}
                                            </div>
                                            <button
                                                className="btn btn-square btn-sm absolute top-2 right-2"
                                                onClick={() => handleDelete(entry.id)}
                                            >
                                                &times;
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default JournalList; 