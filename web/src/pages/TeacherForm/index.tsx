import React, { useState, FormEvent } from 'react'
import { useHistory }from 'react-router-dom'

import PageHeader from '../../components/PageHeader'
import Input from '../../components/Input'
import Textarea from '../../components/Textarea'
import Select from '../../components/Select'

import warningIcon from '../../assets/images/icons/warning.svg'

import './styles.css'
import api from '../../services/api'


function TeacherForm () {

    const history = useHistory()

    const [name, setName] = useState('')
    const [avatar, setAvatar] = useState('')
    const [whatsapp, setWhatsapp] = useState('')
    const [bio, setBio] = useState('')

    const [subject, setSubject] = useState('')
    const [cost, setCost] = useState('')

    const [schelduleItems, setSchelduleItems] = useState([{week_day: '0', from: '', to: ''}])

    function addNewSchelduleLine () {
        setSchelduleItems([
            ...schelduleItems,
            {
                week_day: '0',
                from: '',
                to: ''
            }
        ])
    }

    function handleCreateClass(e: FormEvent) {
        e.preventDefault()
    
        api.post('classes', {
            name,
            avatar,
            whatsapp,
            bio,
            subject,
            cost: Number(cost),
            schedule: schelduleItems
        }).then(() => {
            alert('Cadastro realizado com sucesso!')
            history.push('/')
        }).catch((error) => {
            alert('Erro no cadastro!')
            console.log(error)
        })

        console.log({name, avatar, whatsapp, bio, cost, subject, schelduleItems})
    }

    function setSchelduleItemValue (position: number, field: string, value: string) {
        const updateSchelduleItems = schelduleItems.map((schelduleItem, index) => {
            if (index === position) {
                return {...schelduleItem, [field]: value}
            }

            return schelduleItem    
        })

        setSchelduleItems(updateSchelduleItems)
    }

    return (
        <div id="page-teacher-form" className="cotainer">
            <PageHeader
                title="Que íncrivel que você quer dar aulas."
                description="O primeiro passo é preencher esse formulário de inscrição"
            />

            <main>
                <form onSubmit={handleCreateClass}>
                    <fieldset>
                        <legend>Seus dados</legend>

                        <Input name="name" label="Nome completo" value={name} onChange={(e) => {setName(e.target.value)}} />
                        <Input name="avatar" label="Avatar" value={avatar} onChange={(e) => {setAvatar(e.target.value)}} />
                        <Input name="whatsapp" label="WhatsApp" value={whatsapp} onChange={(e) => {setWhatsapp(e.target.value)}} />
                        <Textarea name="bio" label="Biografia" value={bio} onChange={(e) => {setBio(e.target.value)}} />

                    </fieldset>

                    <fieldset>
                        <legend>Sobre a aula</legend>

                        <Select 
                            name="subject"
                            label="Matéria"
                            value={subject}
                            onChange={(e) => {setSubject(e.target.value)}}
                            options={[
                                {value: 'Artes', label: 'Artes'},
                                {value: 'Biologia', label: 'Biologia'},
                                {value: 'Educação Física', label: 'Educação Física'},
                                {value: 'Física', label: 'Física'},
                                {value: 'Geografia', label: 'Geografia'},
                                {value: 'História', label: 'História'},
                                {value: 'Matemática', label: 'Matemática'},
                                {value: 'Português', label: 'Português'},
                                {value: 'Química', label: 'Química'},
                                {value: 'Filosofia', label: 'Filosofia'},
                                {value: 'Sociologia', label: 'Sociologia'},
                                {value: 'Informática', label: 'Informática'}
                            ]}
                        />
                        <Input name="cost" label="Custo da sua hora pro aula" value={cost} onChange={(e) => {setCost(e.target.value)}}/>

                    </fieldset>

                    <fieldset>
                        <legend>
                            Horários disponíveis
                            <button type="button" onClick={addNewSchelduleLine}>
                                + Novo horário
                            </button>
                        </legend>
                        
                        {schelduleItems.map((schelduleItem, index) => {
                            return (
                                <div key={schelduleItem.week_day} className="schedule-item">
                                    <Select 
                                        name="week_day"
                                        label="Dia da semana"
                                        value={schelduleItem.week_day}
                                        onChange={e => setSchelduleItemValue(index, 'week_day', e.target.value)}
                                        options={[
                                            {value: '0', label: 'Domingo'},
                                            {value: '1', label: 'Segunda-feira'},
                                            {value: '2', label: 'Terça-feira'},
                                            {value: '3', label: 'Quarta-feira'},
                                            {value: '4', label: 'Quinta-feira'},
                                            {value: '5', label: 'Sexta-feira'},
                                            {value: '6', label: 'Sábado'},
                                        ]}
                                    />

                                    <Input 
                                        name="from"
                                        label="Das"
                                        type="time"
                                        value={schelduleItem.from}
                                        onChange={e => setSchelduleItemValue(index, 'from', e.target.value)}
                                    />

                                    <Input
                                        name="to"
                                        label="Até"
                                        type="time"value={schelduleItem.to}
                                        onChange={e => setSchelduleItemValue(index, 'to', e.target.value)}
                                    />
                                </div>
                            )
                        })}

                    </fieldset>

                    <footer>
                        <p>
                            <img src={warningIcon} alt="Aviso importante"/>
                            Importante! <br/>
                            Preencha todos os dados
                        </p>
                        <button type="submit">Salvar cadastro</button>
                    </footer>
                </form>

            </main>
        </div>
    );
}

export default TeacherForm;