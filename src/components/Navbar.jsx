import React, { useState } from 'react'; // Javítva: useState importálva
import LoginButton from "./LoginButton"; // Ez most már nem lesz szürke!
import logo from "../assets/logo.png";
import { Link } from "react-router-dom";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="navbar-container">
            {/* BAL OLDAL: LOGÓ */}
            <div className="nav-logo-section">
                <img src={logo} alt="Logo" style={{ height: '40px' }} />
            </div>

            {/* KÖZÉP: MENÜ PONTOK */}
            <div className={`nav-links-wrapper ${isOpen ? 'open' : ''}`}>
                <div className="nav-links-container">
                    <Link to="/" className="nav-item text-decoration-none">HOME</Link>
                    <a href="#" className="nav-item text-decoration-none">DOWNLOAD</a>
                    <a href="#" className="nav-item text-decoration-none">UPDATES</a>
                    <a href="#" className="nav-item text-decoration-none">DONATE</a>
                    <a href="#" className="nav-item text-decoration-none">FAQ</a>
                </div>
            </div>

            {/* JOBB OLDAL: LOGIN GOMB (Asztali) */}
            <div className="nav-actions-section desktop-login">
                <LoginButton /> {/* Itt hívjuk meg a gombot! */}
            </div>

            {/* HAMBURGER IKON (Mobil) */}
            <div className="hamburger-icon" onClick={() => setIsOpen(!isOpen)}>
                <div className={`bar ${isOpen ? 'active' : ''} text-decoration-none`}></div>
                <div className={`bar ${isOpen ? 'active' : ''}`}></div>
                <div className={`bar ${isOpen ? 'active' : ''}`}></div>
            </div>
            
        </nav>
    );
}