import { useState } from "react";
import BackGround from "../assets/Background.png";
import DarkBackGround from "../assets/dark.jpg";
import MoonIcon from "../assets/moon.png";
import SunIcon from "../assets/sun.png";
import Navbar from "../components/Navbar";
import Card from "../components/Card";
import { useTheme } from "../context/ThemeContext";
import 'bootstrap/dist/css/bootstrap.min.css';

const faqs = [
    { q: "What is Midnight Racers?", a: "Midnight Racers is an indie racing game currently in early development. It features night-time street racing with a focus on atmosphere and speed." },
    { q: "Is the game free to play?", a: "Yes! The game is completely free to download and play. We accept donations to help fund further development." },
    { q: "What platforms are supported?", a: "Currently only Windows is supported. Mac and Linux support are planned for future updates." },
    { q: "How do I report a bug?", a: "You can report bugs through our Discord server or by opening an issue on our GitHub page. We appreciate every report!" },
    { q: "How often are updates released?", a: "We aim to release updates every few weeks. You can follow the Updates page to stay informed about new releases." },
    { q: "Can I contribute to the game?", a: "Absolutely! We welcome contributors. Reach out to us via Discord and we'll guide you through the process." },
];

export default function FAQ() {
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const [openIndex, setOpenIndex] = useState(null);
    const { isDarkMode, toggleTheme } = useTheme();

    const handleMouseMove = (e) => {
        const x = (window.innerWidth / 2 - e.pageX) / 70;
        const y = (window.innerHeight / 2 - e.pageY) / 70;
        setOffset({ x, y });
    };

    const toggle = (i) => setOpenIndex(openIndex === i ? null : i);

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
                <div style={{
                    paddingTop: '130px', paddingBottom: '50px',
                    display: 'flex', flexDirection: 'column', alignItems: 'center'
                }}>
                    <h1 style={{
                        fontFamily: "'Orbitron', sans-serif", fontWeight: 900,
                        letterSpacing: '4px', color: 'white', fontSize: '2.5rem',
                        textAlign: 'center', marginBottom: '40px'
                    }}>FAQ</h1>

                    <Card title="FREQUENTLY ASKED" width="750px" height="auto">
                        <div className="px-4 py-3">
                            {faqs.map((item, i) => (
                                <div key={i} style={{
                                    borderBottom: '1px solid rgba(255,255,255,0.1)',
                                    marginBottom: '4px'
                                }}>
                                    <div onClick={() => toggle(i)} style={{
                                        cursor: 'pointer', padding: '14px 4px',
                                        display: 'flex', justifyContent: 'space-between',
                                        alignItems: 'center', userSelect: 'none'
                                    }}>
                                        <span style={{ fontWeight: 'bold', letterSpacing: '1px', fontSize: '0.95rem' }}>
                                            {item.q}
                                        </span>
                                        <span style={{
                                            fontSize: '1.2rem', transition: 'transform 0.3s',
                                            transform: openIndex === i ? 'rotate(45deg)' : 'rotate(0deg)',
                                            display: 'inline-block'
                                        }}>+</span>
                                    </div>
                                    <div style={{
                                        maxHeight: openIndex === i ? '200px' : '0px',
                                        overflow: 'hidden', transition: 'max-height 0.35s ease',
                                    }}>
                                        <p style={{
                                            padding: '0 4px 14px', margin: 0,
                                            color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', lineHeight: '1.6'
                                        }}>
                                            {item.a}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}