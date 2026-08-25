import React, { createContext, useContext, useState, useCallback } from 'react';

const ErrorContext = createContext();

export const ErrorProvider = ({ children }) => {
    const [errors, setErrors] = useState([]);

    const addError = useCallback((message) => {
        const id = Date.now();
        setErrors((prev) => [...prev, { id, message }]);

        // Auto-dismiss after 5 seconds
        setTimeout(() => {
            setErrors((prev) => prev.filter((e) => e.id !== id));
        }, 5000);
    }, []);

    const removeError = useCallback((id) => {
        setErrors((prev) => prev.filter((e) => e.id !== id));
    }, []);

    return (
        <ErrorContext.Provider value={{ addError, removeError }}>
            {children}

            {/* Global error display */}
            <div style={{
                position: 'fixed',
                bottom: '20px',
                right: '20px',
                zIndex: 9999,
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                maxWidth: '400px',
            }}>
                {errors.map((error) => (
                    <div key={error.id} style={{
                        overflow:'auto',
                        backgroundColor: '#800020',
                        color: '#F9F1E4',
                        padding: '12px 16px',
                        borderRadius: '8px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: '12px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                        animation: 'fadeIn 0.3s ease',
                    }}>
                        <span style={{ fontSize: '14px' }}>{error.message}</span>
                        <button
                            onClick={() => removeError(error.id)}
                            style={{
                                background: 'none',
                                border: 'none',
                                color: '#F9F1E4',
                                cursor: 'pointer',
                                fontSize: '18px',
                                lineHeight: 1,
                                padding: 0,
                            }}
                        >
                            ×
                        </button>
                    </div>
                ))}
            </div>
        </ErrorContext.Provider>
    );
};

export const useError = () => useContext(ErrorContext);