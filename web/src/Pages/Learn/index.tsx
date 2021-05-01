import React, { useContext, useEffect, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import server from '../../services/server'

import Context from '../../components/tools/Context'
import Header from '../../components/Header'
import Select from '../../components/Select'
// import InputLabel from '../../components/InputLabel'

import emojiIcon from '../../assets/imgs/icon/emoji.svg'
import whatsappIcon from '../../assets/imgs/icon/whatsapp.svg'

import './styles.css'


function Learn () {
    const history = useHistory()

    const subjectOptions = [
        {value: '', label: 'Limpar Filtro'},
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
    
    const defaultClasses = [{
        id: '',
        name: '',
        secundaryName: '',
        bio: '',
        avatar: '',
        whatsapp: '',
        subject: '',
        cost: '',
        hours: [{weekDay: '', to: '', from: ''}],
    }]

    const [classes, setClasses] = useState(defaultClasses)

    const [subject, setSubject] = useState('')
    const [weekDay, setWeekday] = useState('')
    // const [hours, setHours] = useState('00')
    const [proffys, setProffys] = useState('0')

    function time (hours: {weekDay: string, to: string, from: string}[], day: string) {
        let index = hours.findIndex((hour) => {
            return hour.weekDay === day
        })

        if (index >= 0) {
            return hours[index].from + 'h - ' + hours[index].to + 'h'
        } else {
            return '-'
        }
    }
 
    function matchSubject (subject: string) {
        let id = subjectOptions.findIndex((element) => {
            return element.value === subject
        })

        if (id === -1) { return }

        return subjectOptions[id].label
    }

    function newConnection (class_id: string) {
        server.post('/connections', {class_id}, {headers: {Authorization: 'Bear ' + token}})
    }

    useEffect(() => {
        document.querySelectorAll('div[data-time] strong').forEach((element) => {
            if (element.innerHTML !== '-') {
                element.closest('li')?.setAttribute('data-active', 'true')
            }
        })
    }, [classes])

    useEffect(() => {
        if (!subject && !weekDay) {
            server.get('/learn', {
                headers: {
                    Authorization: 'Bear ' + token,
                    limit: 5
                }
            }).then(({data}) => {
                setClasses(data.classes)
                setProffys(data.teachers)
            }).catch(({response}) => {
                if(response.status === 401) {
                    setToken('')
                    history.push('/')
                }
            })
            return
        }

        server.get('/learn', {
            headers: {
                Authorization: 'Bear ' + token,
                limit: 5,
                filters: JSON.stringify({subject, weekDay})
            }
        }).then(({data}) => {
            setClasses(data.classes)
            setProffys(data.teachers)
        }).catch(({response}) => {
            if(response.status === 401) {
                setToken('')
                history.push('/')
                return
            }
            setClasses(defaultClasses)
        })
    }, [subject, weekDay, token, defaultClasses, setToken, history])

    return (
        <div className="container" id="learn">
            <Header title="Estudar">
                <div className="row">
                    <h1>Estes são os<br /> proffys disponíveis</h1>
                    <div>
                        <div>
                            <img src={emojiIcon} alt="Sorriso"/>
                            <p>Nós temos {proffys}<br/>professores.</p>
                        </div>
                    </div>
                </div>
            </Header>
            <main>
                <nav>
                    <form action="/">
                        <Select name="subject" label="Matéria" value={subject} change={setSubject.bind(Learn)}
                            options={subjectOptions}
                        />
                        <Select name="weekday" label="Dia da semana" value={weekDay} change={setWeekday.bind(Learn)}
                            options={[
                                {value: '', label: 'Limpar Filtro'},
                                {value: '2', label: 'Segunda-feira'},
                                {value: '3', label: 'Terça-feira'},
                                {value: '4', label: 'Quarta-feira'},
                                {value: '5', label: 'Quinta-feira'},
                                {value: '6', label: 'Sexta-feira'}
                            ]}
                        />
                        {/* <InputLabel name='hours' label='Horário' type="number" value={hours} father="hours"
                            onChange={(e) => setHours(e.target.value)}
                            onKeyDown={(e) => {
                                if ((e.target as HTMLInputElement).value.length === 2 && e.keyCode !== 8 && e.keyCode !== 37 && e.keyCode !== 39) {
                                    e.preventDefault()
                                }
                            }}
                        /> */}
                    </form>
                </nav>
                <ul id="list">
                    {/* Nenhum professor encontrado<br/>com sua pesquisa. */}

                    {classes.map((teacher, index) => {
                        if (!teacher.name) {return <footer key={index}>Nenhum professor encontrado<br/>com sua pesquisa.</footer>}

                        return (
                        <li key={index}>
                            <div className="file">
                                <div className="row">
                                    <img src={teacher.avatar} alt="Profile"/>
                                    <div>
                                        <h1>{teacher.name + ' ' + teacher.secundaryName}</h1>
                                        <h2>{matchSubject(teacher.subject)}</h2>
                                    </div>
                                </div>
                                <div className="row">
                                    <p>{teacher.bio}</p>
                                </div>

                                <ul className="week">
                                    <li>
                                        <div>
                                            <span>Dia</span>
                                            <strong>Segunda</strong>
                                        </div>
                                        <div data-time>
                                            <span>Horário</span>
                                            <strong>{time(teacher.hours, '2')}</strong>
                                        </div>
                                    </li>
                                    <li>
                                        <div>
                                            <span>Dia</span>
                                            <strong>Terça</strong>
                                        </div>
                                        <div data-time>
                                            <span>Horário</span>
                                            <strong>{time(teacher.hours, '3')}</strong>
                                        </div>
                                    </li>
                                    <li>
                                        <div>
                                            <span>Dia</span>
                                            <strong>Quarta</strong>
                                        </div>
                                        <div data-time>
                                            <span>Horário</span>
                                            <strong>{time(teacher.hours, '4')}</strong>
                                        </div>
                                    </li>
                                    <li>
                                        <div>
                                            <span>Dia</span>
                                            <strong>Quinta</strong>
                                        </div>
                                        <div data-time>
                                            <span>Horário</span>
                                            <strong>{time(teacher.hours, '5')}</strong>
                                        </div>
                                    </li>
                                    <li>
                                        <div>
                                            <span>Dia</span>
                                            <strong>Sexta</strong>
                                        </div>
                                        <div data-time>
                                            <span>Horário</span>
                                            <strong>{time(teacher.hours, '6')}</strong>
                                        </div>
                                    </li>
                                </ul>
                            </div>

                            <footer>
                                <div><span>Preço / hora</span><strong>R$ {teacher.cost},00</strong></div>
                                <Link to="/"
                                    onClick={(e) => {
                                        e.preventDefault()
                                        newConnection(teacher.id)
                                        window.open("https://wa.me/55" + teacher.whatsapp)
                                    }}
                                >
                                    <img src={whatsappIcon} alt="WhatsApp"/>WhatsApp
                                </Link>
                            </footer>
                        </li>)
                    })}

                    {/* <footer>Estes são todos os resultados</footer> */}
                </ul>
            </main>
        </div>
    )
}

export default Learn