import { useState, useCallback } from 'react';
import { createDesign, getDesigns } from '../api/designApi';
import { useAuth } from '../context/AuthContext';

export const useDesign = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [designs, setDesigns] = useState([]);
    const { auth } = useAuth();

    const saveDesign = async (designData) => {
        setIsLoading(true);
        setError(null);
        try {
            const result = await createDesign(designData, auth?.token);
            return result;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const fetchUserDesigns = useCallback(async (userId) => {
        setIsLoading(true);
        setError(null);
        try {
            const result = await getDesigns(userId, auth?.token);
            setDesigns(result);
            return result;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, [auth?.token]);

    return { saveDesign, fetchUserDesigns, designs, isLoading, error };
};
