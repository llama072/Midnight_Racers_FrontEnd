import React, { useState, useEffect } from 'react';
import LoginButton from "./LoginButton";
import logo from "../assets/logo.png";
import { Link, useNavigate } from "react-router-dom";
import { kijelentkezes } from "../../api";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            try { setUser(JSON.parse(storedUser)); }
            catch (error) { console.error("User error:", error); }
        }
    }, []);

    const handleLogout = async () => {
        try { await kijelentkezes(); }
        catch (error) { console.error("Hiba:", error); }
        finally {
            localStorage.removeItem("user");
            setUser(null);
            navigate("/");
            window.location.reload();
        }
    };

    return (
        <nav className="navbar navbar-expand-lg fixed-top px-lg-5 py-1">
            <div className="container-fluid d-flex justify-content-between align-items-center">

                {/* BAL OLDAL: LOGÓ */}
                <div className="col-4 d-flex justify-content-start">
                    <img src={logo} alt="Logo" className="img-fluid" style={{ height: '110px' }} />
                </div>

                {/* MOBIL MENÜ RÉTEG */}
                <div className={`nav-links-wrapper ${isOpen ? 'open' : ''}`}>

                    {/* A BEZÁRÓ X GOMB - Fixált pozícióval, hogy biztosan látszódjon */}
                    <button
                        type="button"
                        className="btn-close btn-close-white d-lg-none shadow-none"
                        style={{
                            position: 'fixed',
                            top: '30px',
                            right: '30px',
                            fontSize: '2rem',
                            zIndex: 3000
                        }}
                        onClick={() => setIsOpen(false)}
                    ></button>

                    <div className="nav-links-container pill-blur d-flex align-items-center shadow-lg">
                        <Link to="/" className="nav-link text-white fw-bold px-3" onClick={() => setIsOpen(false)}>HOME</Link>
                        <Link to="/Download" className="nav-link text-white fw-bold px-3" onClick={() => setIsOpen(false)}>DOWNLOAD</Link>
                        <Link to="/Updates" className="nav-link text-white fw-bold px-3" onClick={() => setIsOpen(false)}>UPDATES</Link>
                        <a href="#" className="nav-link text-white fw-bold px-3" onClick={() => setIsOpen(false)}>DONATE</a>
                        <a href="#" className="nav-link text-white fw-bold px-3" onClick={() => setIsOpen(false)}>FAQ</a>
                    </div>
                </div>

                {/* JOBB OLDAL: USER / LOGIN */}
                <div className="col-4 d-flex justify-content-end align-items-center">
                    {user ? (
                        <div className="dropdown d-none d-lg-block">
                            <button className="btn user-pill-btn dropdown-toggle text-white border-0" type="button" data-bs-toggle="dropdown">
                                {user.name}
                            </button>
                            <ul className="dropdown-menu dropdown-menu-dark dropdown-menu-end custom-black-dropdown shadow">
                                <li><button className="dropdown-item" onClick={() => navigate("/Profile")}>Profile</button></li>
                                <li><hr className="dropdown-divider" /></li>
                                <li><button className="dropdown-item text-danger" onClick={handleLogout}>Logout</button></li>
                            </ul>
                        </div>
                    ) : (
                        <div className="d-none d-lg-block">
                            <LoginButton />
                        </div>
                    )}

                    {/* HAMBURGER GOMB (Nyitáshoz) */}
                    <button className="navbar-toggler border-0 shadow-none" type="button" onClick={() => setIsOpen(true)}>
                        <div className="hamburger-icon d-flex">
                            <span className="bar"></span>
                            <span className="bar"></span>
                            <span className="bar"></span>
                        </div>
                    </button>
                </div>
            </div>
        </nav>
    );
}