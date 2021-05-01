import React from 'react'

import backgroundImg from './../../assets/imgs/background.svg'
import logoImg from './../../assets/imgs/logo.svg'

import './styles.css'

function SectionLogo () {
    return (
        <section className="section-logo" id="section-logo">
            <img src={backgroundImg} alt=""/>
            <div>
                <img src={logoImg} alt="Proffy"/>
                <p>Sua plataforma de estudos online</p>
            </div>
        </section>
    )
}

export default SectionLogo