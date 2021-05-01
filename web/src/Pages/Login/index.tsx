import React, { useContext, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'

import server from '../../services/server'

import SectionLogo from '../../components/SectionLogo'
import Input from '../../components/Input'
import Check from '../../components/Check'

import Context from '../../components/tools/Context'

import heartPurpleIcon from '../../assets/imgs/icon/heart-purple.svg'

import './styles.css'

function Login () {
    const history = useHistory()

    const [email, setEmail] = useState('')
    const [pass, setPass] = useState('')

    const [remember, setRemember] = useState(false)

    const {setToken} = useContext(Context)

    function submit (e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()

        setRemember((document.querySelector('input[name="lembrar"]') as HTMLInputElement).checked)

        server.post('login', {email, pass, remember}).then((result) => {
            if (result.status === 201) {
                const token: string = result.data?.token
                setToken(token)
                history.push('/home')
            } else {
                window.alert(result.data?.error)
            }
        }).catch(({response}) => {
            if (response.status === 401) {
                switch (response.data?.reason) {
                    case 'email':
                        window.alert('E-mail não registrado.')
                        break
                    case 'pass':
                        window.alert('Senha incorreta')
                        break
                }
            } else {
                window.alert(response.data?.error)
            }
        })
    }

    return (
        <div className="container">
            <SectionLogo/>

            <section className="section-login">
                <form action="/" onSubmit={submit} data-finish="true">
                    <div className="form-group row">
                        <h1>Fazer login</h1>
                        <Link to="/register">Criar uma conta</Link>
                    </div>

                    <div className="form-group inputs input-column column">
                        <Input change={setEmail} value={email} name="email" label="E-mail" type="email" />
                        <Input change={setPass} value={pass} name="senha" label="Senha" type="password"/>
                    </div>

                    <div className="form-group row">
                        <div className="check">
                            <Check name='lembrar' label='Lembrar-me'/>
                        </div>
                        <Link to="/recover">Esqueci minha senha</Link>
                    </div>

                    <div className="form-group row">
                        <button type="submit">Entrar</button>
                    </div>
                </form>

                <footer>
                    <div>
                        <p>Não tem conta?</p>
                        <Link to="/register">Cadastre-se</Link>
                    </div>
                    <div>
                        <span>É de graça <img src={heartPurpleIcon} alt="Coração Roxo"/></span>
                    </div>
                </footer>
            </section>
        </div>
    )
}

export default Login