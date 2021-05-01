import React, { useContext, useEffect, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'

import jwt from 'jwt-decode'

import offIcon from '../../assets/imgs/icon/off.svg'
import learnIcon from '../../assets/imgs/icon/learn.svg'
import teachIcon from '../../assets/imgs/icon/teach.svg'
import heartIcon from '../../assets/imgs/icon/heart-purple.svg'
import logoImg from '../../assets/imgs/logo.svg'
import illustrationImg from '../../assets/imgs/illustration.svg'

import Context from '../../components/tools/Context'
import server from '../../services/server'

import './styles.css'

function Home() {

    const {token, setToken} = useContext(Context)
    const {name, secundaryName, avatar} = jwt(token)
    const [conn, setConn] = useState(0)

    const history = useHistory()

    function logout (e: React.MouseEvent) {
        e.preventDefault()

        setToken('')

        history.push('/')
    }

    useEffect(() => {
        server.get('connections', {headers: {Authorization: 'Bear ' + token}}).then((resp) => {
            setConn(resp.data.connections)
        }).catch(({response}) => {
            if(response.status === 401) {
                setToken('')
                history.push('/')
            }
        })
    }, [token, history, setToken])

    return (
        <div className="container home">
            <section id="homeTop">
                <header>
                    <Link to="/profile">
                        <img src={avatar} alt="User"/>
                        <span>{name + ' ' + secundaryName}</span>
                    </Link>
                    <Link to="/" onClick={(e) => logout(e)}>
                        <img src={offIcon} alt="Sair"/>
                    </Link>
                </header>
                <div>
                    <div>
                        <div>
                            <img src={logoImg} alt="Proffy"/>
                            <p>Sua plataforma de estudos online.</p>
                        </div>
                        <img src={illustrationImg} alt="Illustração"/>
                    </div>
                </div>
            </section>
            <section id="homeBotton">
                <div>
                    <p>Seja bem-vindo.<br/><strong>O que deseja fazer?</strong></p>
                    <div>
                        <Link to="/learn"><button type="button">
                            <img src={learnIcon} alt="Estudar"/>
                            Estudar
                        </button></Link>
                        <Link to="/teach"><button type="button">
                            <img src={teachIcon} alt="Dar aulas"/>
                            Dar aulas
                        </button></Link>
                    </div>
                    <span>Total de {conn} conexões já realizadas. <img src={heartIcon} alt="Coração Roxo"/></span>
                </div>
            </section>
        </div>
    )
}

export default Home