import React from 'react';
import logo from '../assets/images/logo.png'

const Header = () => {
    return (
        <header className='header'>
            <nav className='logo'>
                <img src={logo} alt='TodoList' />
            </nav>
        </header>
    )
}

export default Header
