import React from 'react';

interface ModalProps {
    onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({onClose}) => {
    const handleContentClick = (event: React.MouseEvent) => {
        event.stopPropagation();
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center" onClick={onClose}>
            <div className="w-4/5 h-4/5 bg-white bg-opacity-50" onClick={handleContentClick}>
                <p>Hello setting</p>
            </div>
        </div>
    );
};

export default Modal;

