import React from 'react'
import { Link } from 'react-router-dom'

import logoImg from '../../assets/imgs/logo.svg'

import './styles.css'

interface HeaderProps {
    title: string
}

const Header: React.FC<HeaderProps> = ({title, children}) => {
    return (
        <section className="sectionHeader">
            <nav>
                <Link to="/home">
                    <svg width="49" height="32" viewBox="0 0 49 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g stroke="#BDA5F6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M2 16H48"/>
                            <path d="M6.00098 21.001L0.999976 16L6.00098 10.999"/>
                        </g>
                    </svg>
                </Link>
                <span>{title}</span>
                <img src={logoImg} alt="Proffy"/>
            </nav>
            <header>
                {children}
            </header>
        </section>
    )
}

export default Header