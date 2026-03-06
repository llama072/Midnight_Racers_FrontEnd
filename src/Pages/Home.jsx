import { useState } from "react";
import BackGround from "../assets/Background.png";
import DarkBackGround from "../assets/dark.jpg";
import MoonIcon from "../assets/moon.png"; 
import SunIcon from "../assets/sun.png"; 

import Navbar from "../components/Navbar";
import Card from "../components/Card";
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Mouse() {
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const [isDarkMode, setIsDarkMode] = useState(false);

    const handleMouseMove = (e) => {
        const x = (window.innerWidth / 2 - e.pageX) / 70;
        const y = (window.innerHeight / 2 - e.pageY) / 70;
        setOffset({ x, y });
    };

    const toggleTheme = () => {
        setIsDarkMode(!isDarkMode);
    };

    return (
        <div onMouseMove={handleMouseMove} style={{
            height: '100vh',
            width: '100vw',
            position: 'relative',
            overflow: 'hidden',
            backgroundColor: 'black'
        }}>
            {/* Parallax Háttér */}
            <div style={{
                backgroundImage: `url(${isDarkMode ? DarkBackGround : BackGround})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                position: 'absolute',
                top: '-5%',
                left: '-5%',
                width: '110%',
                height: '110%',
                zIndex: 0,
                transition: 'background-image 0.5s ease-in-out',
                transform: `translate(${offset.x}px, ${offset.y}px)`
            }} />

            {/* Sötétítő réteg */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundColor: isDarkMode ? 'transparent' : 'rgba(0,0,0,0.5)',
                zIndex: 1,
                transition: 'background-color 0.5s ease'
            }} />

            {/* Ikon Gomb a bal alsó sarokban */}
            <div 
                onClick={toggleTheme}
                style={{
                    position: 'fixed',
                    bottom: '30px',
                    left: '30px',
                    zIndex: 9999,
                    cursor: 'pointer',
                    transition: 'transform 0.3s ease, filter 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
                <img 
                    src={isDarkMode ? SunIcon : MoonIcon} 
                    alt="Theme Toggle" 
                    style={{
                        width: '40px',
                        height: '40px',
                        filter: isDarkMode ? 'drop-shadow(0 0 10px gold)' : 'drop-shadow(0 0 10px white)',
                        filter: 'invert(1) brightness(2)' 
                    }}
                />
            </div>

            <div className="no-scrollbar" style={{
                position: 'relative',
                zIndex: 2,
                height: '100vh',
                overflowY: 'auto',
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
            }}>
                <Navbar />

                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    marginTop: '15vh',
                    width: '100%',
                    flexShrink: 0
                }}>
                    <h1 className="display-1 text-white mb-5 text-center"
                        style={{
                            fontFamily: "'Orbitron', sans-serif",
                            fontWeight: '900',
                            letterSpacing: '5px',
                            fontSize: '65px',
                            textShadow: isDarkMode ? '0 0 20px rgba(255,255,255,0.2)' : 'none'
                        }}>
                        MIDNIGHT RACERS
                    </h1>

                    <div className="card-container" style={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: '40px',
                        width: '100%',
                        padding: '0 20px'
                    }}>
                        <Card title="NEWS">
                            <p>ASD</p>
                        </Card>
                        <Card title="ABOUT THE GAME">
                            <p>ASD</p>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}