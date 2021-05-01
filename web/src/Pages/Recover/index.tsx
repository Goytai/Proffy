import React, { useState } from 'react'
import { Link, useHistory } from 'react-router-dom'

import SectionLogo from '../../components/SectionLogo'
import Input from '../../components/Input'

import arrowIcon from '../../assets/imgs/icon/arrow-purple.svg'

import './styles.css'

function Recover () {
    const history = useHistory()

    const [email, setEmail] = useState('')

    function submit (e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()

        history.push('/successful', {
            title: 'Versão Demostrativa',
            text: 'Está função está desabilitada durante a versão beta desse site.',
            button: 'Voltar ao login',
            link: '/'
        })
    }

    return (
        <div className="container">
            <section className="sectionWhite">
                <div>
                    <Link to="/">
                        <img src={arrowIcon} alt="Voltar"/>
                    </Link>
                </div>

                <form action="/" onSubmit={submit} data-finsh="true">
                    <div>
                        <h1 style={{width: '250px'}}>Eita, esqueceu sua senha? </h1>
                        <p style={{marginBottom: '1rem', width: 'auto'}}>Não esquenta, vamos dar um jeito nisso</p>
                    </div>

                    <div className="inputs">
                        <Input
                            name="email"
                            value={email}
                            label="E-mail"
                            type="email"
                            change={setEmail.bind(Recover)}
                        />
                    </div>
                    <div>
                        <button type="submit">Enviar</button>
                    </div>
                </form>
            </section>

            <SectionLogo/>
        </div>
    )
}

export default Recover