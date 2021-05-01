import React, {FormHTMLAttributes} from 'react'

import warningIcon from '../../assets/imgs/icon/warning.svg'

import './styles.css'

interface SectionFormProps extends FormHTMLAttributes<HTMLFormElement> {
    id: string
    submit: Function
}

const SectionForm: React.FC<SectionFormProps> = ({id, submit, children,...rest}) => {
    return (
        <section className="sectionForm">
            <div>
                <form action="/" id={id} onSubmit={(e) => submit(e)} {...rest}>
                    {children}
                </form>
            </div>
            <footer>
                <div>
                    <img src={warningIcon} alt="Importante!"/>
                    <p><span>Importante!</span><br/>Preencha todos os dados corretamente</p>
                </div>
                <button type="submit" onClick={(e) => submit(e)} form={id}>Salvar cadastro</button>
            </footer> 
        </section>
    )
}

export default SectionForm