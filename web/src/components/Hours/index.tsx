import React from 'react'

import Select from '../Select'
import InputLabel from '../InputLabel'

import './styles.css'

interface HoursProps {
    hours: Array<{weekDay: string, from: string, to: string}>,
    setHours: Function
}

const Hours: React.FC<HoursProps> = ({hours, setHours}) => {

    function newHour () {
        if (hours.length === 7) {return}

        setHours([...hours, {weekDay: '', from: '00', to: '00'}])
    }

    function changeHoursItem (value: string, element: Element, data: {index: number, field: string}) {
        const updateHours = hours.map((hour, index) => {
            if (index === data.index) {
                return {...hour, [data.field]: value}
            }

            return hour
        })

        setHours(updateHours)
    }

    function deleteHour (position: number) {
        if(hours.length === 1) {return}

        const updadeHours = [...hours]
        updadeHours.splice(position, 1)
        console.log(updadeHours)
        setHours(updadeHours)
    }

    return (
        <>
            <div className="title column">
                Horário disponíveis
                <button type="button" id="newHours" onClick={newHour}>+ &nbsp;Novo horário</button>
            </div>

            {hours.map((hour, index) => {
                return (
                    <div key={index}>
                        <div className="row hours">
                            <Select value={hour.weekDay} name={'weekDay' + index } label="Dia da semana" flex={3}
                                options={[
                                    {value: '2', label: 'Segunda-feira'},
                                    {value: '3', label: 'Terça-feira'},
                                    {value: '4', label: 'Quarta-feira'},
                                    {value: '5', label: 'Quinta-feira'},
                                    {value: '6', label: 'Sexta-feira'}
                                ]}
                                change={changeHoursItem.bind(Hours)} //(index, 'weekDay', e.target.value)
                                back={{index, field: 'weekDay'}}
                            />

                            <InputLabel father="hours" label='Das' value={hour.from} name={'from' + index }
                                onChange={(e) => changeHoursItem(e.target.value, e.target, {index, field: 'from'})}
                            />
                            <InputLabel father="hours" label="Até" value={hour.to} name={'to' + index }
                                onChange={(e) => changeHoursItem(e.target.value, e.target, {index, field: 'to'})}
                            />
                        </div>
                        <div className="row">
                            <button type="button" onClick={() => deleteHour(index)}>Excluir horário</button>
                        </div>
                    </div>
                )
            })}
        </>
    )
}

export default Hours