import React, { useState, useEffect } from 'react';
import LoginButton from "./LoginButton";
import logo from "../assets/Logo.png";
import MoonIcon from "../assets/moon.png";
import SunIcon from "../assets/sun.png";
import { Link, useNavigate } from "react-router-dom";
import { kijelentkezes, getMe } from "../../api";
import { useTheme } from "../context/ThemeContext";

export default function Navbar({ onMenuToggle }) {
    const [isOpen, setIsOpen] = useState(false);
    const [user, setUser] = useState(null);
    const [showMenu, setShowMenu] = useState(false);
    const [profileExpanded, setProfileExpanded] = useState(false);
    const [isHidden, setIsHidden] = useState(false);
    const lastScrollRef = React.useRef(0);
    const userMenuRef = React.useRef(null);
    const navigate = useNavigate();
    const { isDarkMode, toggleTheme } = useTheme();

    // User dropdown: click-outside vagy Escape -> bezar
    useEffect(() => {
        if (!showMenu) return;
        const handleClick = (e) => {
            if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
                setShowMenu(false);
            }
        };
        const handleKey = (e) => { if (e.key === 'Escape') setShowMenu(false); };
        document.addEventListener('mousedown', handleClick);
        document.addEventListener('keydown', handleKey);
        return () => {
            document.removeEventListener('mousedown', handleClick);
            document.removeEventListener('keydown', handleKey);
        };
    }, [showMenu]);

    // Hide navbar on scroll down, show on scroll up
    useEffect(() => {
        const handler = (e) => {
            if (isOpen) return; // ne rejtse el ha a menü nyitva van
            const current = e.detail;
            const prev = lastScrollRef.current;
            if (current > prev && current > 80) {
                setIsHidden(true);
            } else if (current < prev - 5 || current <= 30) {
                setIsHidden(false);
            }
            lastScrollRef.current = current;
        };
        window.addEventListener('pageScroll', handler);
        return () => window.removeEventListener('pageScroll', handler);
    }, [isOpen]);

    useEffect(() => {
        // Gyors UI megjelenites cache-bol (csak 'name' van tarolva), aztan frissitjuk a szerverrol
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            try { setUser(JSON.parse(storedUser)); }
            catch (error) { console.error("User error:", error); }
        }
        // BIZTONSAG: a valos identitast a szerver /me-bol kerjuk le
        getMe().then(data => {
            if (data) {
                setUser(data);
                localStorage.setItem("user", JSON.stringify({ name: data.name }));
            } else {
                // nincs ervenyes session -> takaritunk
                localStorage.removeItem("user");
                setUser(null);
            }
        });
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

    const openMenu = () => { setIsOpen(true); onMenuToggle?.(true); document.body.classList.add('menu-open'); };
    const closeMenu = () => {
        setIsOpen(false);
        onMenuToggle?.(false);
        document.body.classList.remove('menu-open');
        setProfileExpanded(false);
    };

    return (
        <nav
            className="navbar navbar-expand-lg fixed-top px-lg-5 py-1"
            style={{
                zIndex: isOpen ? 10000 : 1030,
                transform: isHidden ? 'translateY(-100%)' : 'translateY(0)',
                transition: 'transform 0.35s ease'
            }}
        >
            <div className="container-fluid d-flex justify-content-between align-items-center">

                {/* BAL OLDAL: LOGÓ */}
                <div className="col-4 d-flex justify-content-start">
                    <img src={logo} alt="Logo" className="img-fluid navbar-logo" style={{ height: 'var(--navbar-logo-h, 110px)' }} />
                </div>

                {/* KÖZÉPSŐ MENÜ */}
                <div className={`nav-links-wrapper ${isOpen ? 'open' : ''}`}>
                    <button
                        type="button"
                        className="btn-close btn-close-white d-lg-none shadow-none"
                        style={{ position: 'fixed', top: '30px', right: '30px', fontSize: '2rem', zIndex: 3000 }}
                        onClick={closeMenu}
                    ></button>

                    <div className="nav-links-container pill-blur d-flex align-items-center shadow-lg">
                        {!user && (
                            <Link to="/Login" className="nav-link text-white fw-bold px-3 d-lg-none" onClick={closeMenu}>
                                LOGIN / REGISTER
                            </Link>
                        )}
                        <Link to="/"         className="nav-link text-white fw-bold px-3" onClick={closeMenu}>HOME</Link>

                        {/* PROFILE - csak mobilon, ha be van jelentkezve */}
                        {user && (
                            <div className="d-lg-none mobile-profile-section">
                                <button
                                    type="button"
                                    onClick={() => setProfileExpanded(prev => !prev)}
                                    className="nav-link text-white fw-bold px-3 mobile-profile-toggle"
                                    style={{
                                        background: 'none', border: 'none',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        gap: '12px', fontFamily: 'inherit', cursor: 'pointer',
                                        width: '100%'
                                    }}
                                >
                                    PROFILE
                                    <span style={{
                                        fontSize: '0.9rem',
                                        transition: 'transform 0.3s',
                                        transform: profileExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                                        display: 'inline-block'
                                    }}>▼</span>
                                </button>
                                {profileExpanded && (
                                    <div className="mobile-profile-submenu" style={{
                                        display: 'flex', flexDirection: 'column',
                                        alignItems: 'center', gap: '18px',
                                        marginTop: '18px'
                                    }}>
                                        <Link
                                            to="/Profile"
                                            onClick={closeMenu}
                                            className="nav-link text-white fw-bold"
                                            style={{ fontSize: '1.4rem', opacity: 0.85 }}
                                        >
                                            ACCOUNT
                                        </Link>
                                        <Link
                                            to="/Stats"
                                            onClick={closeMenu}
                                            className="nav-link text-white fw-bold"
                                            style={{ fontSize: '1.4rem', opacity: 0.85 }}
                                        >
                                            STATS
                                        </Link>
                                        <button
                                            type="button"
                                            onClick={() => { closeMenu(); handleLogout(); }}
                                            className="nav-link fw-bold"
                                            style={{
                                                background: 'none', border: 'none',
                                                color: '#ff6b6b', fontSize: '1.4rem',
                                                cursor: 'pointer', fontFamily: 'inherit',
                                                letterSpacing: '1.5px'
                                            }}
                                        >
                                            LOG OUT
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}

                        <Link to="/Download" className="nav-link text-white fw-bold px-3" onClick={closeMenu}>DOWNLOAD</Link>
                        <Link to="/Updates"  className="nav-link text-white fw-bold px-3" onClick={closeMenu}>UPDATES</Link>
                        <Link to="/Donate"   className="nav-link text-white fw-bold px-3" onClick={closeMenu}>DONATE</Link>
                        <Link to="/FAQ"      className="nav-link text-white fw-bold px-3" onClick={closeMenu}>FAQ</Link>

                        {/* TEMA VALTÓ - csak mobilon */}
                        <button
                            onClick={toggleTheme}
                            className="d-lg-none"
                            style={{
                                background: 'none', border: 'none', cursor: 'pointer',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                gap: '14px', color: 'white', fontWeight: 'bold',
                                fontSize: '1.6rem', letterSpacing: '2px',
                                padding: '0 12px', fontFamily: 'inherit'
                            }}
                        >
                            <img
                                src={isDarkMode ? SunIcon : MoonIcon}
                                alt="theme"
                                style={{ width: '30px', filter: 'invert(1) brightness(2)' }}
                            />
                            {isDarkMode ? 'LIGHT MODE' : 'DARK MODE'}
                        </button>
                    </div>
                </div>

                {/* JOBB OLDAL: USER / LOGIN */}
                <div className="col-4 d-flex justify-content-end align-items-center">
                    {user ? (
                        <div className="d-none d-lg-block position-relative" ref={userMenuRef}>
                            <div
                                onClick={() => setShowMenu(prev => !prev)}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '10px',
                                    background: 'rgba(255,255,255,0.08)',
                                    backdropFilter: 'blur(12px)',
                                    border: '1px solid rgba(255,255,255,0.15)',
                                    borderRadius: '50px', padding: '8px 18px',
                                    cursor: 'pointer', transition: 'all 0.3s ease',
                                    userSelect: 'none'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
                                onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
                            >
                                <span style={{ color: 'white', fontWeight: '600', fontSize: '0.9rem', letterSpacing: '0.5px' }}>
                                    {user.name}
                                </span>
                                <span style={{
                                    color: 'rgba(255,255,255,0.6)', fontSize: '0.7rem',
                                    transition: 'transform 0.3s',
                                    transform: showMenu ? 'rotate(180deg)' : 'rotate(0deg)',
                                    display: 'inline-block'
                                }}>▼</span>
                            </div>

                            {showMenu && (
                                <div style={{
                                    position: 'absolute', top: 'calc(100% + 12px)', right: 0,
                                    background: 'rgba(10,10,20,0.95)',
                                    backdropFilter: 'blur(20px)',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: '16px', padding: '8px',
                                    minWidth: '180px', zIndex: 5000,
                                    boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
                                    animation: 'fadeInDown 0.2s ease'
                                }}>
                                    <style>{`
                                        @keyframes fadeInDown {
                                            from { opacity: 0; transform: translateY(-8px); }
                                            to   { opacity: 1; transform: translateY(0); }
                                        }
                                        .user-menu-item {
                                            display: flex; align-items: center; gap: 10px;
                                            padding: 10px 14px; border-radius: 10px;
                                            cursor: pointer; color: white;
                                            font-size: 0.9rem; font-weight: 500;
                                            transition: background 0.2s; border: none;
                                            background: transparent; width: 100%;
                                            text-align: left; letter-spacing: 0.3px;
                                        }
                                        .user-menu-item:hover { background: rgba(255,255,255,0.08); }
                                        .user-menu-item.danger { color: #ff6b6b; }
                                        .user-menu-item.danger:hover { background: rgba(255,107,107,0.1); }
                                        .menu-divider { height: 1px; background: rgba(255,255,255,0.08); margin: 6px 0; }
                                    `}</style>

                                    <div style={{
                                        padding: '8px 14px 12px',
                                        borderBottom: '1px solid rgba(255,255,255,0.08)',
                                        marginBottom: '6px'
                                    }}>
                                        <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', letterSpacing: '1px', marginBottom: '2px' }}>
                                            SIGNED IN AS
                                        </div>
                                        <div style={{ fontWeight: '700', fontSize: '0.95rem', color: 'white' }}>
                                            {user.name}
                                        </div>
                                    </div>

                                    <button className="user-menu-item" onClick={() => { navigate("/Profile"); setShowMenu(false); }}>
                                        <span>👤</span> Profile
                                    </button>
                                    <button className="user-menu-item" onClick={() => { navigate("/Stats"); setShowMenu(false); }}>
                                        <span>🎮</span> Stats
                                    </button>
                                    <div className="menu-divider" />
                                    <button className="user-menu-item danger" onClick={handleLogout}>
                                        <span>🚪</span> Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="d-none d-lg-block">
                            <LoginButton />
                        </div>
                    )}

                    {/* HAMBURGER */}
                    <button className="navbar-toggler border-0 shadow-none" type="button" onClick={openMenu}>
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