const getToken = async (bearer: boolean = false): Promise<string | null> => {
    try {
        const token = localStorage.getItem('access_token');
        if (token) {
            return bearer ? `Bearer ${token}` : token;
        }
        return null;
    } catch (error) {
        return null;
    }
};

export default getToken;
