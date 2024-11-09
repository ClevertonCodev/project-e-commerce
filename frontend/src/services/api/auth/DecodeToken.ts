import jwt_decode from 'jwt-decode';
interface AuthPayload {
    sub: number;
    userType: 'ADMIN' | 'USER' | 'GUEST';
    iat: number;
}

const decodeToken = (token: string): AuthPayload | null => {
    try {
        return jwt_decode(token);
    } catch (error) {
        return null;
    }
};

export default decodeToken;