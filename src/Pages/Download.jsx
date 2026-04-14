import { useState } from "react";
import BackGround from "../assets/Background.png";
import DarkBackGround from "../assets/dark.jpg";
import MoonIcon from "../assets/moon.png";
import SunIcon from "../assets/sun.png";
import Navbar from "../components/Navbar";
import Card from "../components/Card";
import { useTheme } from "../context/ThemeContext";
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Download() {
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const { isDarkMode, toggleTheme } = useTheme();

    const handleMouseMove = (e) => {
        const x = (window.innerWidth / 2 - e.pageX) / 70;
        const y = (window.innerHeight / 2 - e.pageY) / 70;
        setOffset({ x, y });
    };

    return (
        <div onMouseMove={handleMouseMove} style={{
            height: '100vh', width: '100vw',
            position: 'relative', overflow: 'hidden', backgroundColor: 'black'
        }}>
            <div style={{
                backgroundImage: `url(${isDarkMode ? DarkBackGround : BackGround})`,
                backgroundSize: 'cover', backgroundPosition: 'center',
                position: 'absolute', top: '-5%', left: '-5%',
                width: '110%', height: '110%', zIndex: 0,
                transition: 'background-color 0.5s ease',
                transform: `translate(${offset.x}px, ${offset.y}px)`
            }} />
            <div style={{
                position: 'absolute', top: 0, left: 0,
                width: '100%', height: '100%',
                backgroundColor: isDarkMode ? 'transparent' : 'rgba(0,0,0,0.5)',
                zIndex: 1, transition: 'background-color 0.5s ease'
            }} />

            <div className="theme-toggle" onClick={toggleTheme} style={{
                position: 'fixed', bottom: '30px', left: '30px',
                zIndex: 9999, cursor: 'pointer', transition: 'transform 0.3s ease',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
                <img src={isDarkMode ? SunIcon : MoonIcon} alt="Theme Toggle"
                    style={{ width: '40px', height: '40px', filter: 'invert(1) brightness(2)' }} />
            </div>

            {/* Navbar iOS Safari fix */}
            <Navbar />

            <div style={{
                position: 'relative', zIndex: 2, height: '100vh',
                width: '100vw', overflowY: 'auto', display: 'flex', flexDirection: 'column'
            }} onScroll={(e) => window.dispatchEvent(new CustomEvent('pageScroll', { detail: e.currentTarget.scrollTop }))}>
                <div className="container-fluid d-flex flex-grow-1 justify-content-center align-items-center"
                    style={{ padding: '20px', minHeight: '80vh' }}>
                    <Card title="DOWNLOAD">
                        <div className="d-flex flex-column h-100 text-center">
                            <div className="mb-4">
                                <p style={{ fontSize: '1.1rem', opacity: 0.8 }}>
                                    Midnight Racers SUPER BETA ALPHA EARLY RELASE 0.000001
                                </p>
                            </div>
                            <div className="mt-auto pb-3">
                                <a
                                    href="https://drive.google.com/uc?export=download&id=1L0eZibExeAbCgHK7ypPROTz3RcMWIKdD"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn btn-outline-light px-5 py-2 fw-bold"
                                    style={{ borderRadius: '10px', letterSpacing: '2px', textDecoration: 'none' }}
                                >
                                    DOWNLOAD HERE
                                </a>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}