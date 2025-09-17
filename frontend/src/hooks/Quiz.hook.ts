import React, { useEffect, useState, createContext, useContext } from 'react';
import type { ReactNode} from 'react';

interface QuizContextType {
    isAdmin: boolean;
    setIsAdmin: (value: boolean) => void;
}

const QuizContext = createContext<QuizContextType | undefined>(undefined);

export const QuizProvider = ({ children }: { children: ReactNode }) => {
    const [isAdmin, setIsAdmin] = useState<boolean>(false);

    return React.createElement(
        QuizContext.Provider,
        { value: { isAdmin, setIsAdmin } },
        children
    );
};

export const useQuiz = () => {
    const context = useContext(QuizContext);
    if (!context) {
        throw new Error('useQuiz must be used within QuizProvider');
    }
    return context;
};