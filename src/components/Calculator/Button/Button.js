import React from 'react';
import './Button.css'

const Button = (props) => {
    return (
        <div className="button-container" onClick={() => props.onClick(props.button)}>
            <div className={"button-text"+ ' ' + props.type}>
                {props.button}
            </div>
        </div>
    )
}

export default Button