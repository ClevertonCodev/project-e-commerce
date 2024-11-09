import getToken from "./GetToken";
import decodeToken from "./DecodeToken";

export const authGuard = async (): Promise<boolean> => {
    try {
        const token = await getToken();

        if (!token) {
            return false;
        }

        const decoded = decodeToken(token);

        if (!decoded) {
            return false;
        }
        localStorage.setItem('user_type', decoded.userType);
        const currentTime = Date.now() / 1000;

        if (decoded.iat + 3600 < currentTime) {
            return false;
        }

        return true;
    } catch (error) {
        return false;
    }
};

