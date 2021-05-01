import React, { useState } from 'react'
import {Link, useHistory} from 'react-router-dom'

import SectionLogo from '../../components/SectionLogo'
import Input from '../../components/Input'

import arrowIcon from '../../assets/imgs/icon/arrow-purple.svg'

import './styles.css'
import server from '../../services/server'
import { AxiosError } from 'axios'


function Register () {

    const history = useHistory()

    const [name, setName] = useState('')
    const [secundaryName, setSecundaryName] = useState('')
    const [email, setEmail] = useState('')
    const [pass, setPass] = useState('')

    function submit (e: React.FormEvent) {
        e.preventDefault()

        server.post('register', {name, secundaryName, email, pass}).then((result) => {
            if (result.status === 201) {
                history.push('/successful', {
                    title: 'Cadastro concluído',
                    text: 'Agora você faz parte da plataforma Proffy.',
                    span: 'Tenha uma ótima experiência.',
                    button: 'Fazer login',
                    link: '/'
                })
            }
        }).catch( (err: AxiosError) => {
            if (err.response?.status === 401) {
                return window.alert('E-mail já registrado')
            } else {
                const menssage: string = err.response?.data.error || err.response?.data.menssage
                return window.alert(menssage)
            }
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
                        <h1>Cadastro</h1>
                        <p style={{width: "20rem"}}>Preencha os dados abaixo para começar.</p>
                    </div>

                    <div className="input-column inputs">
                        <Input
                            name="name"
                            value={name}
                            label="Nome"
                            type="text"
                            change={setName.bind(Register)}
                        />

                        <Input
                            name="secundaryname"
                            value={secundaryName}
                            label="Sobrenome"
                            type="text"
                            change={setSecundaryName.bind(Register)}
                        />

                        <Input
                            name="email"
                            value={email}
                            label="E-mail"
                            type="email"
                            change={setEmail.bind(Register)}
                        />

                        <Input
                            name="pass"
                            value={pass}
                            label="Senha"
                            type="password"
                            change={setPass.bind(Register)}
                        />

                    </div>

                    <div>
                        <button type="submit">Concluir cadastro</button>
                    </div>
                </form>
            </section>

            <SectionLogo/>
        </div>
    )
}

export default Register