import React, {InputHTMLAttributes} from 'react'

import './styles.css'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    name: string
    label: string
    change: Function
    blur?: Function
    back?: object
}

const Input: React.FC<InputProps> =  ({name, change, blur, label, back, ...rest}) => {

    function inputChange (input: HTMLInputElement) {
        input.value === ''?
        input.style.background = 'transparent':
        input.style.background = 'white'
    }

    function inputBlur (input: HTMLInputElement) {
        let form = input.closest('form') as HTMLElement

        if (form.hasAttribute('data-finish')) {
            let nullResult = [];

            form.querySelectorAll('.input').forEach((div, index) => {
                if ((div.querySelector('input') as HTMLInputElement).value === '') {
                    nullResult[nullResult.length] = index
                }
            })

            nullResult.length > 0?
            (form.querySelector('button') as HTMLElement).setAttribute('data-secundary', 'false'):
            (form.querySelector('button') as HTMLElement).setAttribute('data-secundary', 'true')
        }
    }

    return (
        <div className="input">
            <input type="text" name={name} id={name} {...rest}
                onChange={(e) => {inputChange(e.target); change(e.target.value, e.target, back)}}
                onBlur={(e) => {inputBlur(e.target)}}
            />
            <label htmlFor={name}>{label}</label>
        </div>
    )
}

export default Input