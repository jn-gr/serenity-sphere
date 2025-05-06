import React, { useState, useEffect, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { createJournalEntry, fetchJournalEntries } from './journalSlice'
import { useNavigate } from 'react-router-dom'
import { FaPaperPlane, FaCheck, FaExclamationTriangle, FaRedo } from 'react-icons/fa'
import { motion, AnimatePresence } from 'framer-motion'
import { IoMdCheckmarkCircle, IoMdClose } from 'react-icons/io'
import { fetchNotifications } from '../notifications/notificationSlice'

// Toast notification component for errors
const ErrorToast = ({ error, onDismiss }) => {
    if (!error) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: 20, x: '-50%' }}
                animate={{ opacity: 1, y: 0, x: '-50%' }}
                exit={{ opacity: 0, y: -20, x: '-50%' }}
                className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-red-900 border border-red-700 text-white px-6 py-3 rounded-lg shadow-lg z-50 max-w-md w-full"
            >
                <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                        <FaExclamationTriangle className="text-red-300 mt-1 flex-shrink-0" />
                        <div>
                            <h4 className="font-medium mb-1">{error.title || "Error"}</h4>
                            <p className="text-red-200 text-sm">{error.message}</p>
                            {error.action && (
                                <button 
                                    onClick={error.action.handler} 
                                    className="mt-2 text-xs bg-red-800 hover:bg-red-700 px-3 py-1 rounded-full flex items-center gap-1"
                                >
                                    {error.action.icon || <FaRedo size={10} />}
                                    <span>{error.action.text}</span>
                                </button>
                            )}
                        </div>
                    </div>
                    <button onClick={onDismiss} className="text-red-300 hover:text-white">
                        <IoMdClose />
                    </button>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};

// Field-level error component
const FieldError = ({ message }) => {
    if (!message) return null;
    
    return (
        <div className="mt-1 text-red-400 text-sm flex items-center gap-1">
            <FaExclamationTriangle size={12} />
            <span>{message}</span>
        </div>
    );
};

const SuccessModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-[#1A2335] rounded-2xl border border-[#2A3547] p-8 max-w-md w-full mx-4"
                >
                    <div className="text-center">
                        <div className="flex justify-center mb-4">
                            <IoMdCheckmarkCircle className="text-green-500 text-6xl" />
                        </div>
                        <h3 className="text-xl font-semibold text-white mb-2">
                            Entry Added Successfully!
                        </h3>
                        <p className="text-[#B8C7E0] mb-6">
                            Your journal entry has been saved.
                        </p>
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={onClose}
                            className="bg-gradient-to-r from-[#3E60C1] to-[#5983FC] text-white px-6 py-3 rounded-xl"
                        >
                            Continue
                        </motion.button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

const JournalForm = () => {
    const [content, setContent] = useState('')
    const [showSuccess, setShowSuccess] = useState(false)
    const [hasEntryToday, setHasEntryToday] = useState(false)
    const [todaysEntry, setTodaysEntry] = useState(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    
    // Error states
    const [fieldErrors, setFieldErrors] = useState({})
    const [toastError, setToastError] = useState(null)
    
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { entries, status, error: journalError } = useSelector(state => state.journal)

    // Function to handle errors in a standardized way
    const handleError = useCallback((error, type = 'toast') => {
        console.error('Error in JournalForm:', error);
        
        // Parse the error message
        let errorTitle = 'Error';
        let errorMessage = 'An unexpected error occurred.';
        
        if (error?.response?.status === 401) {
            errorTitle = 'Authentication Error';
            errorMessage = 'You must be logged in to continue. Please log in and try again.';
        } else if (error?.response?.status === 403) {
            errorTitle = 'Permission Error';
            errorMessage = 'You don\'t have permission to perform this action.';
        } else if (error?.response?.status === 429) {
            errorTitle = 'Too Many Requests';
            errorMessage = 'You\'re doing that too often. Please wait and try again later.';
        } else if (error?.response?.status >= 500) {
            errorTitle = 'Server Error';
            errorMessage = 'Our server is experiencing issues. Please try again later.';
        } else if (error?.message) {
            errorMessage = error.message;
        } else if (typeof error === 'string') {
            errorMessage = error;
        }
        
        // Handle different error display types
        if (type === 'field') {
            setFieldErrors(prevErrors => ({
                ...prevErrors,
                [error.field]: errorMessage
            }));
        } else {
            // For toast errors
            setToastError({
                title: errorTitle,
                message: errorMessage,
                // Only add retry action for network or server errors
                action: error?.response?.status >= 500 || error?.code === 'NETWORK_ERROR' 
                    ? {
                        text: 'Retry',
                        handler: error.retry || (() => window.location.reload()),
                        icon: <FaRedo size={10} />
                      }
                    : null
            });
            
            // Auto-dismiss toast after 8 seconds
            setTimeout(() => {
                setToastError(null);
            }, 8000);
        }
    }, []);

    // Clear field errors when content changes
    useEffect(() => {
        setFieldErrors(prev => ({...prev, content: null}));
    }, [content]);

    const loadEntries = useCallback(async () => {
        setIsLoading(true);
        try {
            await dispatch(fetchJournalEntries()).unwrap();
        } catch (err) {
            handleError({
                ...err,
                retry: loadEntries
            });
        } finally {
            setIsLoading(false);
        }
    }, [dispatch, handleError]);

    useEffect(() => {
        if (status === 'idle') {
            loadEntries();
        } else {
            setIsLoading(false);
        }
    }, [status, loadEntries]);
    
    useEffect(() => {
        if (entries.length > 0) {
            const today = new Date().toISOString().split('T')[0];
            const entryToday = entries.find(entry => 
                new Date(entry.date).toISOString().split('T')[0] === today
            );
            
            if (entryToday) {
                setHasEntryToday(true);
                setTodaysEntry(entryToday);
                setContent(entryToday.content);
            } else {
                setHasEntryToday(false);
                setTodaysEntry(null);
            }
        }
    }, [entries]);

    // Display API errors from redux state
    useEffect(() => {
        if (journalError) {
            handleError({
                message: journalError,
                retry: loadEntries
            });
        }
    }, [journalError, handleError, loadEntries]);

    const validateEntry = () => {
        let isValid = true;
        const errors = {};
        
        // Content validation
        if (!content.trim()) {
            errors.content = 'Please enter some content for your journal entry.';
            isValid = false;
        } else if (content.trim().length < 3) {
            errors.content = 'Your entry is too short. Please write more about your thoughts.';
            isValid = false;
        } else if (content.length > 10000) {
            errors.content = 'Your entry is too long. Maximum 10,000 characters allowed.';
            isValid = false;
        }
        
        setFieldErrors(errors);
        return isValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Clear previous errors
        setFieldErrors({});
        setToastError(null);
        
        if (!validateEntry()) {
            return;
        }
        
        setIsSubmitting(true);
        
        try {
            await dispatch(createJournalEntry({ content })).unwrap();
            setShowSuccess(true);
            
            // Reset form state on success
            if (!hasEntryToday) {
                setContent('');
            }
            
            setTimeout(() => {
                setShowSuccess(false);
            }, 3000);
            
            // After submission, fetch notifications to check for mood triggers
            dispatch(fetchNotifications());
        } catch (err) {
            handleError({
                ...err,
                retry: () => handleSubmit(new Event('submit'))
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSuccessClose = () => {
        setShowSuccess(false);
        navigate('/mood');
    };

    const dismissToast = () => {
        setToastError(null);
    };

    return (
        <>
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#1A2335] rounded-2xl border border-[#2A3547] p-6 w-full shadow-lg hover:border-[#3E60C1]/50 transition-all duration-300"
            >
                <div className="flex items-center gap-3 mb-6">
                    <div className="bg-[#3E60C1]/20 p-3 rounded-xl">
                        <FaPaperPlane className="text-[#5983FC]" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-semibold text-white">
                            {hasEntryToday ? "Today's Journal Entry" : "New Journal Entry"}
                        </h2>
                        <p className="text-[#B8C7E0] text-sm mt-1">
                            {hasEntryToday ? "Edit and update your thoughts from today" : "Share your thoughts and feelings"}
                        </p>
                    </div>
                </div>
                
                {hasEntryToday && (
                    <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-6 p-4 bg-[#2A3547] rounded-xl border border-[#3E60C1]/30"
                    >
                        <div className="flex items-start gap-3">
                            <div className="bg-[#3E60C1]/20 p-2 rounded-lg">
                                <FaCheck className="text-[#5983FC]" size={14} />
                            </div>
                            <div>
                                <p className="text-[#B8C7E0] text-sm">
                                    You've already written an entry today. Feel free to edit and refine your thoughts below.
                                </p>
                            </div>
                        </div>
                    </motion.div>
                )}
                
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-12 space-y-4">
                        <div className="w-10 h-10 border-4 border-[#3E60C1]/30 border-t-[#5983FC] rounded-full animate-spin"></div>
                        <p className="text-[#B8C7E0] animate-pulse">Loading your journal...</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <div className="relative">
                                <textarea
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    placeholder="How are you feeling today? What's on your mind?"
                                    className={`w-full p-5 rounded-xl bg-[#0F172A] border ${
                                        fieldErrors.content ? 'border-red-500' : 'border-[#2A3547]'
                                    } text-[#B8C7E0] min-h-[250px] focus:outline-none focus:border-[#3E60C1] focus:ring-2 focus:ring-[#3E60C1]/20 transition-all duration-200 text-base leading-relaxed`}
                                    disabled={isSubmitting}
                                    aria-invalid={fieldErrors.content ? 'true' : 'false'}
                                    aria-describedby={fieldErrors.content ? "content-error" : undefined}
                                ></textarea>
                                
                                <div className="absolute bottom-4 right-4 text-sm text-[#B8C7E0] opacity-70">
                                    {content.length > 0 && (
                                        <span className={`transition-colors duration-200 ${
                                            content.length > 9000 ? 'text-yellow-400' : 
                                            content.length > 8000 ? 'text-yellow-300/70' : ''
                                        }`}>
                                            {content.length} / 10,000
                                        </span>
                                    )}
                                </div>
                            </div>
                            
                            <AnimatePresence>
                                {fieldErrors.content && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                    >
                                        <FieldError message={fieldErrors.content} id="content-error" />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                        
                        <div className="flex justify-end items-center mt-6">
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                className={`flex items-center gap-3 px-8 py-4 rounded-xl text-white font-medium shadow-lg ${
                                    isSubmitting ? 'bg-[#3E60C1] cursor-not-allowed' :
                                    'bg-gradient-to-r from-[#3E60C1] to-[#5983FC] hover:shadow-[#5983FC]/20'
                                } transition-all duration-200 disabled:opacity-70`}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                                        <span>Saving Entry...</span>
                                    </>
                                ) : showSuccess ? (
                                    <>
                                        <FaCheck size={18} />
                                        <span>Entry Saved!</span>
                                    </>
                                ) : (
                                    <>
                                        <FaPaperPlane size={18} />
                                        <span>{hasEntryToday ? "Update Entry" : "Save Entry"}</span>
                                    </>
                                )}
                            </motion.button>
                        </div>
                    </form>
                )}
            </motion.div>

            <SuccessModal 
                isOpen={showSuccess} 
                onClose={handleSuccessClose}
            />
            
            <ErrorToast 
                error={toastError} 
                onDismiss={dismissToast}
            />
        </>
    );
};

export default JournalForm; 