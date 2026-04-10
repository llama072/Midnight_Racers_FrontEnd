import { useState } from "react";
import BackGround from "../assets/Background.png";
import DarkBackGround from "../assets/dark.jpg";
import MoonIcon from "../assets/moon.png";
import SunIcon from "../assets/sun.png";
import Navbar from "../components/Navbar";
import Card from "../components/Card";
import { useTheme } from "../context/ThemeContext";
import 'bootstrap/dist/css/bootstrap.min.css';

const tiers = [
    {
        title: "⚙️ SUPPORTER",
        price: "$3 / mo",
        color: "#8898f0",
        perks: ["Your name in credits", "Supporter badge", "Access to dev logs"]
    },
    {
        title: "🏎️ RACER",
        price: "$10 / mo",
        color: "#f0c040",
        perks: ["Everything in Supporter", "Early access to updates", "Exclusive in-game skin", "Discord role"]
    },
    {
        title: "🏆 LEGEND",
        price: "$25 / mo",
        color: "#f07060",
        perks: ["Everything in Racer", "Vote on new features", "Your name in the game", "1-on-1 dev chat"]
    }
];

export default function Donate() {
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

            <div style={{
                position: 'relative', zIndex: 2, height: '100vh',
                width: '100vw', overflowY: 'auto', display: 'flex', flexDirection: 'column'
            }}>
                <Navbar />
                <div style={{
                    paddingTop: '130px', paddingBottom: '50px',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px'
                }}>
                    <h1 style={{
                        fontFamily: "'Orbitron', sans-serif", fontWeight: 900,
                        letterSpacing: '4px', color: 'white', fontSize: '2.5rem',
                        textAlign: 'center', marginBottom: '10px'
                    }}>SUPPORT THE GAME</h1>
                    <p style={{ color: 'rgba(255,255,255,0.6)', letterSpacing: '1px', marginBottom: '30px' }}>
                        Every contribution helps us keep the servers running and the game growing.
                    </p>
                    <div style={{
                        display: 'flex', flexWrap: 'wrap',
                        justifyContent: 'center', gap: '30px', padding: '0 20px',
                        alignItems: 'stretch'
                    }}>
                        {tiers.map((tier) => (
                            <Card key={tier.title} title={tier.title} width="280px" height="auto">
                                <div className="text-center px-3 pb-3" style={{
                                    display: 'flex', flexDirection: 'column', height: '100%'
                                }}>
                                    <div style={{
                                        fontSize: '2rem', fontWeight: 'bold',
                                        color: tier.color, marginBottom: '16px'
                                    }}>
                                        {tier.price}
                                    </div>
                                    <ul style={{ listStyle: 'none', padding: 0, marginBottom: '20px', flex: 1 }}>
                                        {tier.perks.map((perk) => (
                                            <li key={perk} style={{
                                                padding: '6px 0',
                                                borderBottom: '1px solid rgba(255,255,255,0.08)',
                                                fontSize: '0.9rem', color: 'rgba(255,255,255,0.85)'
                                            }}>
                                                ✓ {perk}
                                            </li>
                                        ))}
                                    </ul>
                                    <button className="btn w-100 fw-bold"
                                        style={{
                                            borderRadius: '10px', letterSpacing: '1px',
                                            backgroundColor: tier.color, border: 'none',
                                            color: 'black', padding: '10px'
                                        }}
                                        onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
                                        onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                                    >
                                        DONATE
                                    </button>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}