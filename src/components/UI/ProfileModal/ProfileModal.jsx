import React from 'react'
import cl from '../ProfileModal/ProfileModal.module.css'

const MyModal = ({children, visible, setVisible}) => {

    const rootClasses = [cl.profileModal]

    if (visible) {
        rootClasses.push(cl.active);
    }

    return (
        <div className={rootClasses.join(' ')} onClick={() => setVisible(false)}>
            <div className={cl.profileModalContent} onClick={(e) => e.stopPropagation()}>
                {children}
            </div>
        </div>
    );
};

export default MyModal;