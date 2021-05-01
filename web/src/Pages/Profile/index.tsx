import React, { useContext, useEffect, useState} from 'react'
import { useHistory } from 'react-router-dom'
import jwt from 'jwt-decode'
import server from '../../services/server'

import Header from '../../components/Header'
import InputLabel from '../../components/InputLabel'
import TextArea from '../../components/TextArea'
import Select from '../../components/Select'
import Hours from '../../components/Hours'
import SectionForm from '../../components/SectionForm'
import Context from '../../components/tools/Context'

import camIcon from '../../assets/imgs/icon/cam.svg'

import './styles.css'


function Profile () {

    const history = useHistory()

    const subjectOptions = [
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
    ]

    const {token, setToken} = useContext(Context)
    const {name: nameToken, secundaryName: secundaryNameToken, avatar: avatarToken} = jwt(token)

    const [name, setName] = useState(nameToken)
    const [secundaryName, setSecundaryName] = useState(secundaryNameToken)
    const [avatar, setAvatar] = useState(avatarToken)

    const [email, setEmail] = useState('')
    const [whatsapp, setWhatsapp] = useState('')
    const [bio, setBio] = useState('')

    const [hours, setHours] = useState([{weekDay: '', from: '', to: ''}])

    const [subject, setSubject] = useState('')
    const [subjectLabel, setSubjectLabel] = useState('')
    const [cost, setCost] = useState('')

    useEffect(() => {
        server.get('user', {
            headers: {Authorization: "Bear " + token},
            params: {
                email: '',
                whatsapp: '',
                bio: ''
            }
        }).then(({data}) => {
            data.email && setEmail(data.email)
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
        
    }, [token, history, setToken])

    useEffect(() => {
        let id = subjectOptions.findIndex((element) => {
            return element.value === subject
        }) 

        if (id === -1) { return }

        setSubjectLabel(subjectOptions[id].label)
    }, [subject, subjectOptions])

    function newAvatar () {
        const src = window.prompt('Insira a URL da imagem')

        if (!src) {return}

        let header = src.split(':')[0]
        if (!(header === 'http' || header === 'https' || header === 'data')) { return }

        setAvatar(src)
    }

    async function updateProfile (e: Event) {
        e.preventDefault()

        try {
            await server.post('class', {
                subject,
                cost,
                hours: {hours}
            }, {
                headers: {
                    Authorization: "Bear " + token
                }
            })
            await server.post('user', {
                name,
                secundaryName,
                avatar,
                email,
                whatsapp,
                bio
            }, {
                headers: {
                    Authorization: "Bear " + token,
                    newToken: true
                }
            }).then(({data}) => {
                setToken(data.token)
            })

            history.push('/successful', {
                title: 'Cadastro salvo',
                text: 'Tudo certo, seu cadastro está na nossa lista de professores.',
                span: 'Agora é só ficar de olho no seu WhatsApp',
                button: 'Acessar lista',
                link: '/learn'
            })
        } catch (err) {
            if (err) {return}
        }
    }

    return (
        <div className="container" id="profile">
            <Header title="Meu perfil">
                <div className="headerCenter">
                    <div>
                        <img src={avatar} alt={name}/>
                        <button type="button" onClick={() => {newAvatar()}}><img src={camIcon} alt="Alterar Imagem"/></button>
                    </div>
                    <h1>{nameToken + ' ' + secundaryNameToken}</h1>
                    <p>{subjectLabel}</p>
                </div>
            </Header>

            <SectionForm submit={(e: Event) => updateProfile(e)} id="profile">
                <div className="title">Seus dados</div>
                <div className="row">
                    <InputLabel onChange={(e) => setName(e.target.value)} value={name} name='name' label='Nome'/>
                    <InputLabel onChange={(e) => setSecundaryName(e.target.value)} value={secundaryName} name='secundaryName' label='Sobrenome'/>
                </div>
                <div className="row">
                    <InputLabel onChange={(e) => setEmail(e.target.value)} disabled value={email} type="email" name='email' label='E-mail' flex={3}/>
                    <InputLabel name='whatsapp' label='Whatsapp' 
                        onKeyDown={
                            (e) => {
                                if(/\d/.test(e.key) || e.keyCode === 8 || e.keyCode === 9 || e.keyCode === 37 || e.keyCode === 39 || e.ctrlKey) {
                                    return;
                                } else {
                                    e.preventDefault()
                                }
                            }
                        }
                        onChange={(e) => setWhatsapp(e.target.value)}
                        value={whatsapp}
                    />
                </div>
                <div className="row">
                    <TextArea onChange={(e) => setBio(e.target.value)} value={bio} name="bio" label="Biografia"></TextArea>
                </div>
                <div className="title">Sobre a aula</div>
                <div className="row">
                    <Select name="subject" flex={2} label="Matéria" value={subject} change={setSubject.bind(Profile)}
                        options={subjectOptions}
                    />

                    <InputLabel onChange={(e) => setCost(e.target.value)} value={cost} father="price" name='to' label='Custo da sua hora por aula'/>
                </div>
                <Hours hours={hours} setHours={setHours.bind(Profile)} />
            </SectionForm>
            
        </div>
    )
}

export default Profile