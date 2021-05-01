import React, {InputHTMLAttributes} from 'react'

import './styles.css'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    name: string
    label: string
    flex?: number
    father?: string
}

const InputLabel: React.FC<InputProps> = ({name, label, flex, father, ...rest}) => {
    return (
        <div className={"inputLabel"} data-family={father} style={{flex}}>
            <label htmlFor={name}>{label}</label>
            <input type="text" name={name} id={name} {...rest}/>
        </div>
    )
}

export default InputLabel