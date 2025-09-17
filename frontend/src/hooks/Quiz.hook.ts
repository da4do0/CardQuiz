import { useEffect, useState } from 'react';


export const useQuiz = () => {
    const [isAdmin, setIsAdmin] = useState<boolean>(false);

    return {isAdmin, setIsAdmin}
};