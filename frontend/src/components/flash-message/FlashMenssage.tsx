import React from 'react';

interface FlashMessageProps {
    message: string;
    success: boolean
}

const FlashMessage: React.FC<FlashMessageProps> = ({ message, success }) => {
    const bgColor = success ? 'bg-blue-100 text-gray-700' : 'bg-red-100 text-gray-700';

    return (
        <div className={`w-full p-4 rounded-md ${bgColor} mb-4 shadow-lg`}>
            <span>{message}</span>
        </div>
    );
};

export default FlashMessage;
