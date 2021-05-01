import React, { TextareaHTMLAttributes } from 'react'

import './styles.css'

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    name: string
    label: string
    flex ?: number
}

const TextArea: React.FC<TextAreaProps> = ({name, label, flex, ...rest}) => {
    window.onload = () => {
        document.querySelectorAll('textarea').forEach(textarea => {
            textarea.addEventListener('keyup', function () {
                let rows = Number(this.getAttribute('rows'))
                let height = this.scrollHeight
                let dHeight = Number(this.getAttribute('data-height'))

                if (height > dHeight) {
                    this.setAttribute('rows', String(rows + 1))
                    this.setAttribute('data-height', String(height))
                }
            })

            textarea.addEventListener('focus', function () {
                this.setAttribute('data-height', String(this.scrollHeight))
            })
        })
    }

    return (
        <div className="textArea">
            <label htmlFor={name}>{label}<span>(Máximo 300 caracteres)</span></label>
            <textarea
                rows={5}
                name={name}
                id={name}
                style={{flex}}

                data-height={document.querySelector('#' + name)?.scrollHeight}

                {...rest}>
            </textarea>
        </div>
    )
}

export default TextArea