import React from 'react';
import MyBtn from './MyButton.module.css';

const MyButton = ({children, ...props}) => {
    return (
        <button {...props} className={MyBtn.myBtn}>
            {children}
        </button>
    );
};

export default MyButton;