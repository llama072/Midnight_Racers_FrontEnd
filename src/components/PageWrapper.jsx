import { useState } from "react";
import BackGround from "../assets/Background.png";
import DarkBackGround from "../assets/dark.jpg";
import MoonIcon from "../assets/moon.png";
import SunIcon from "../assets/sun.png";
import Navbar from "./Navbar";
import { useTheme } from "../context/ThemeContext";

export default function PageWrapper({ children, scrollClassName = '', scrollStyle = {} }) {
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
                transform: `translate(${offset.x}px, ${offset.y}px)`
            }} />
            <div style={{
                position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                backgroundColor: isDarkMode ? 'transparent' : 'rgba(0,0,0,0.5)',
                zIndex: 1, transition: 'background-color 0.5s ease'
            }} />

            <div
                className="theme-toggle"
                onClick={toggleTheme}
                style={{
                    position: 'fixed', bottom: '30px', left: '30px',
                    zIndex: 9999, cursor: 'pointer', transition: 'transform 0.3s ease',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}
                onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
            >
                <img
                    src={isDarkMode ? SunIcon : MoonIcon}
                    alt="Theme Toggle"
                    style={{ width: '40px', height: '40px', filter: 'invert(1) brightness(2)' }}
                />
            </div>

            <Navbar />

            <div
                className={scrollClassName}
                style={{
                    position: 'relative', zIndex: 2, height: '100vh',
                    overflowY: 'auto', width: '100%',
                    display: 'flex', flexDirection: 'column',
                    ...scrollStyle
                }}
                onScroll={e => window.dispatchEvent(new CustomEvent('pageScroll', { detail: e.currentTarget.scrollTop }))}
            >
                {children}
            </div>
        </div>
    );
}
