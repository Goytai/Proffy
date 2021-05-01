import React from 'react'
import {useLocation, useHistory, Link} from 'react-router-dom'

import successfulIcon from '../../assets/imgs/icon/successful.svg'

import './styles.css'


interface SuccessfulProps {
    title: string
    text: string
    span?: string
    button: string
    link: string
}

function Successful () {
    const location = useLocation<SuccessfulProps>().state
    const history = useHistory()

    if (location === undefined) {
        history.goBack()
        return (<> </>)
    }

    return (
        <section className="section-successful">
            <div>
                <img src={successfulIcon} alt="Sucesso"/>
                <h1>{location.title}</h1>
                <p>{location.text}<br/> <span>{location.span}</span></p>
                <Link to={location.link}><button type="button" data-secundary>{location.button}</button></Link>
            </div>
        </section>
    )
}

export default Successful