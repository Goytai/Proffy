import React from 'react'
import { Link } from 'react-router-dom'
import jQuery from 'jquery'

import arrowDownIcon from '../../assets/imgs/icon/arrow-down.svg'

import './styles.css'

interface SelectProps {
    name: string,
    label: string,
    value: string,
    change: Function,
    options: Array<{value: string, label: string}>,
    flex?: number,
    back?: object
}

const Select: React.FC<SelectProps> = ({name, label, value, change, options, flex, back}) => {
    const lab = () => {
        if (value === '') {
            return 'Selecione'
        }
        let lab = options.map((option) => {if (option.value === value) {return option.label} return null})
        return lab
    }

    function toggleSelect (element: React.MouseEvent) {
        let box = ((element.target as HTMLElement).closest('.select') as HTMLElement).querySelector('.selectBox') as HTMLElement
        let options = ((element.target as HTMLElement).closest('.select') as HTMLElement).querySelector('.selectOptions') as HTMLElement

        if (options.style.display === 'block') {
            box.setAttribute('style', 'border-bottom-left-radius: 1rem; border-bottom-right-radius: 1rem;');
            (box.querySelector('img') as HTMLElement).style.transform = ''
           jQuery(options).slideUp()
        } else {
            box.setAttribute('style', 'border-bottom-left-radius: 0; border-bottom-right-radius: 0 ');
            (box.querySelector('img') as HTMLElement).style.transform = 'rotate(180deg)'
            jQuery(options).slideDown()
            document.addEventListener('click', function click ({target}) {
                if((target as HTMLElement) !== box && (target as HTMLElement) !== options) {
                    box.setAttribute('style', 'border-bottom-left-radius: 1rem; border-bottom-right-radius: 1rem;');
                    (box.querySelector('img') as HTMLElement).style.transform = ''
                    jQuery(options).slideUp()
                    document.removeEventListener('click', click)
                }
            })
        }
    }

    function activeOption (element: React.MouseEvent) {
        let before = ((element.target as HTMLElement).closest('.select') as HTMLElement).querySelector('li[data-activeOption=true]')

        before?.removeAttribute('data-activeOption');
        (element.target as HTMLElement).setAttribute('data-activeOption', 'true')
    }

    return (
        <div className="select" style={{flex}}>
            <label>{label}</label>
            <Link to="/" id={name} data-value={value} className="selectBox"
                onClick={(e) => { e.preventDefault(); toggleSelect(e)}}
            >
                <p>{lab()}</p>
                <img src={arrowDownIcon} alt={label}/>
            </Link>
            <ul className="selectOptions">
                {options.map((option, index) => {
                    return (
                        <li key={index} data-value={option.value}
                            onClick={(e) => {change(option.value, document.getElementById(name), back); activeOption(e); toggleSelect(e)}}
                        >
                            {option.label}
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}

export default Select