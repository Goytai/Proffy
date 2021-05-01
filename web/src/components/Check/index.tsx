import React, {InputHTMLAttributes} from 'react'

import './styles.css'

interface CheckProps extends InputHTMLAttributes<HTMLInputElement> {
    name: string
    label: string
}

const Check: React.FC<CheckProps> = ({name, label, ...rest}) => {
    function ToggleStyleCheckbox () {
        if ((document.querySelector('label[for=' + name + ']') as HTMLElement).hasAttribute('data-checkbox')) {
            (document.querySelector('label[for=' + name + ']') as HTMLElement).removeAttribute('data-checkbox')
        } else {
            (document.querySelector('label[for=' + name + ']') as HTMLElement).setAttribute('data-checkbox', 'active')
        }
    }

    return (
        <div className="checkbox">
            <input type="checkbox" name={name} id={name} {...rest} />
            <label onClick={ToggleStyleCheckbox} htmlFor={name}>{label}</label>
        </div>
    )
}

export default Check