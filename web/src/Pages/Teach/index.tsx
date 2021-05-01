import React, { useContext, useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import jwt from 'jwt-decode'

import server from '../../services/server'
import Context from '../../components/tools/Context'

import Header from '../../components/Header'
import SectionForm from '../../components/SectionForm'
import InputLabel from '../../components/InputLabel'
import TextArea from '../../components/TextArea'
import Select from '../../components/Select'
import Hours from '../../components/Hours'

import rocketIcon from '../../assets/imgs/icon/rocket.svg'

import './styles.css'

function Teach () {
    const history = useHistory()

    const {token, setToken} = useContext(Context)
    const {avatar, name, secundaryName} = jwt(token)

    const [hours, setHours] = useState([{weekDay: '', from: '', to: ''}])
    const [whatsapp, setWhatsapp] = useState('')
    const [bio, setBio] = useState('')
    const [cost, setCost] = useState('')

    useEffect(() => {
        server.get('user', {
            headers: {Authorization: "Bear " + token},
            params: {whatsapp: '', bio: ''}
        }).then(({data}) => {
            data.whatsapp && setWhatsapp(data.whatsapp)
            data.bio && setBio(data.bio)
        }).catch(({response}) => {
            if(response.status === 401) {
                setToken('')
                history.push('/')
            }
        })

        server.get('class', {
            headers: {Authorization: "Bear " + token},
            params: {
                subject: '',
                cost: '',
                hours: ''
            }
        }).then(({data}) => {
            data.subject && setSubject(data.subject)
            data.cost && setCost(data.cost)
            data.hours && setHours(data.hours)
        }).catch(({response}) => {
            if(response.status === 401) {
                setToken('')
                history.push('/')
            }
        })
    }, [token, setToken, history])

    async function updateProfile (e: Event) {
        e.preventDefault()

        try {
            await server.post('user', {
                whatsapp,
                bio
            }, {
                headers: {
                    Authorization: "Bear " + token,
                    newToken: false
                }
            })
            await server.post('class', {
                subject,
                cost,
                hours: {hours}
            }, {
                headers: {
                    Authorization: "Bear " + token
                }
            })
        } catch (err) {
            if (err) {return}
        }

        history.push('/successful', {
            title: 'Cadastro salvo',
            text: 'Tudo certo, seu cadastro está na nossa lista de professores.',
            span: 'Agora é só ficar de olho no seu WhatsApp',
            button: 'Acessar lista',
            link: '/learn'
        })
    }

    const [subject, setSubject] = useState('')

    return (
        <div className="cotainer" id="teach">
            <Header title="Dar aulas">
                <div className="collumn">
                    <h1>Que incrível que você quer dar aulas.</h1>
                    <div>
                        <p>O primeiro passo, é preencher esse formulário de inscrição.</p>
                        <div>
                            <img src={rocketIcon} alt="Foquete"/>
                            <p>Preparare-se! <br/> vai ser o máximo</p>
                        </div>
                    </div>
                </div>
            </Header>

            <SectionForm submit={(e: Event) => updateProfile(e)} id="teach">
                <div className="title">Seus dados</div>
                <div className="row">
                    <div style={{flex: 1.8}} id="profileResume">
                        <img src={avatar} alt="Perfil"/>
                        <strong>{name + ' ' + secundaryName}</strong>
                    </div>
                    <InputLabel name="whatsapp" label="Whatsapp"
                        onKeyDown={
                            (e) => {
                                if(/\d/.test(e.key) || e.keyCode === 8 || e.keyCode === 9 || e.keyCode === 37 || e.keyCode === 39 || e.ctrlKey) {

                                    return;
                                } else {
                                    e.preventDefault()
                                }
                            }
                        }

                        onChange={(e) => {setWhatsapp(e.target.value)}} value={whatsapp}
                    />
                </div>
                <div className="row">
                    <TextArea onChange={(e) => {setBio(e.target.value)}} value={bio} name="bio" label="Biografia"></TextArea>
                </div>
                <div className="title">Sobre a aulas</div>
                <div className="row">
                    <Select name="subject" flex={2} label="Matéria" value={subject} change={setSubject.bind(Teach)}
                        options={[
                            {value: 'efi', label: 'Educação Física'},
                            {value: 'filo', label: 'Filosofia'},
                            {value: 'fis', label: 'Física'},
                            {value: 'geo', label: 'Geografia'},
                            {value: 'his', label: 'História'},
                            {value: 'inf', label: 'Informática'},
                            {value: 'ing', label: 'Inglês'},
                            {value: 'mat', label: 'Matemática'},
                            {value: 'pt', label: 'Português'},
                            {value: 'qui', label: 'Química'},
                            {value: 'soc', label: 'Sociologia'}
                        ]}
                    />

                    <InputLabel onChange={(e) => {setCost(e.target.value)}} value={cost} father="price" name='to' label='Custo da sua hora por aula'/>
                </div>
                <Hours hours={hours} setHours={setHours.bind(Teach)} />
            </SectionForm>
        </div>
    )
}

export default Teach