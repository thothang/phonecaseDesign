export const createDesign = async (designData, token) => {
    const response = await fetch('/api/designs', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(designData),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Failed to create design' }));
        const error = new Error(errorData.message || 'Failed to create design');
        error.response = { data: errorData, status: response.status };
        throw error;
    }

    return response.json();
};

export const getDesigns = async (userId, token) => {
    const response = await fetch(`/api/designs?userId=${userId}`, {
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch designs');
    }

    return response.json();
};

export const deleteDesign = async (designId, token) => {
    const response = await fetch(`/api/designs/${designId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Failed to delete design' }));
        const error = new Error(errorData.message || 'Failed to delete design');
        error.response = { data: errorData, status: response.status };
        throw error;
    }

    return response.json();
};
