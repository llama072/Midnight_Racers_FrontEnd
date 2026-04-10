import { useState, useEffect } from "react";
import BackGround from "../assets/Background.png";
import DarkBackGround from "../assets/dark.jpg";
import MoonIcon from "../assets/moon.png";
import SunIcon from "../assets/sun.png";
import Navbar from "../components/Navbar";
import { useTheme } from "../context/ThemeContext";
import { getMyStats, getLeaderboard } from "../../api";
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Stats() {
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const { isDarkMode, toggleTheme } = useTheme();
    const [myStats, setMyStats] = useState({ Score: 0, Lvl: 0, Gametime: 0 });
    const [leaderboard, setLeaderboard] = useState([]);

    useEffect(() => {
        getMyStats().then(data => { if (data) setMyStats(data); }).catch(() => { });
        getLeaderboard().then(data => { if (Array.isArray(data)) setLeaderboard(data); }).catch(() => { });
    }, []);

    const handleMouseMove = (e) => {
        const x = (window.innerWidth / 2 - e.pageX) / 70;
        const y = (window.innerHeight / 2 - e.pageY) / 70;
        setOffset({ x, y });
    };

    const formatGametime = (minutes) => {
        if (!minutes) return '0m';
        const h = Math.floor(minutes / 60);
        const m = minutes % 60;
        return h > 0 ? `${h}h ${m}m` : `${m}m`;
    };

    const glassStyle = {
        background: 'rgba(255,255,255,0.05)',
        backdropFilter: 'blur(15px)',
        WebkitBackdropFilter: 'blur(15px)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '25px',
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
                width: '100vw', overflowY: 'auto',
                display: 'flex', flexDirection: 'column'
            }}>
                <Navbar />

                <div style={{
                    display: 'flex', justifyContent: 'center', alignItems: 'center',
                    flexGrow: 1, padding: '20px', gap: '30px', flexWrap: 'wrap',
                    paddingTop: '130px', paddingBottom: '50px'
                }}>

                    {/* STATS KÁRTYA */}
                    <div style={{ ...glassStyle, width: 'clamp(380px, 35vw, 380px)', padding: '30px' }}>
                        <h2 style={{
                            textAlign: 'center', color: 'white', fontWeight: '900',
                            letterSpacing: '4px', fontSize: '1.4rem', marginBottom: '30px',
                            fontFamily: "'Orbitron', sans-serif"
                        }}>STATS</h2>

                        {[
                            { label: 'SCORE', value: myStats.Score ?? 0, icon: '🏆' },
                        ].map((stat) => (
                            <div key={stat.label} style={{
                                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                padding: '16px 20px', marginBottom: '12px',
                                background: 'rgba(255,255,255,0.05)',
                                border: '1px solid rgba(255,255,255,0.08)',
                                borderRadius: '14px'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <span style={{ fontSize: '1.2rem' }}>{stat.icon}</span>
                                    <span style={{
                                        color: 'rgba(255,255,255,0.6)', fontWeight: '600',
                                        letterSpacing: '2px', fontSize: '0.85rem'
                                    }}>{stat.label}</span>
                                </div>
                                <span style={{
                                    color: 'white', fontWeight: '800',
                                    fontSize: '1.2rem', letterSpacing: '1px'
                                }}>{stat.value}</span>
                            </div>
                        ))}
                    </div>

                    {/* LEADERBOARD KÁRTYA */}
                    <div style={{ ...glassStyle, width: 'clamp(280px, 40vw, 480px)', padding: '30px' }}>
                        <h2 style={{
                            textAlign: 'center', color: 'white', fontWeight: '900',
                            letterSpacing: '4px', fontSize: '1.4rem', marginBottom: '30px',
                            fontFamily: "'Orbitron', sans-serif"
                        }}>LEADERBOARD</h2>

                        {leaderboard.length === 0 ? (
                            <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.4)' }}>
                                Még nincs adat.
                            </p>
                        ) : (
                            leaderboard.map((player, index) => (
                                <div key={index} style={{
                                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                    padding: '14px 20px', marginBottom: '10px',
                                    background: index === 0 ? 'rgba(240,192,64,0.1)' : index === 1 ? 'rgba(192,192,192,0.08)' : index === 2 ? 'rgba(205,127,50,0.08)' : 'rgba(255,255,255,0.04)',
                                    border: `1px solid ${index === 0 ? 'rgba(240,192,64,0.3)' : index === 1 ? 'rgba(192,192,192,0.2)' : index === 2 ? 'rgba(205,127,50,0.2)' : 'rgba(255,255,255,0.06)'}`,
                                    borderRadius: '14px'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                                        <span style={{
                                            fontSize: '1.1rem', fontWeight: '900', width: '28px',
                                            color: index === 0 ? '#f0c040' : index === 1 ? '#c0c0c0' : index === 2 ? '#cd7f32' : 'rgba(255,255,255,0.4)'
                                        }}>
                                            {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                                        </span>
                                        <span style={{ color: 'white', fontWeight: '700', fontSize: '0.95rem' }}>
                                            {player.User_Name}
                                        </span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                        <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', letterSpacing: '1px' }}>
                                            LVL {player.Lvl ?? 0}
                                        </span>
                                        <span style={{
                                            color: index === 0 ? '#f0c040' : 'white',
                                            fontWeight: '800', fontSize: '1rem'
                                        }}>
                                            {player.Score}
                                        </span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}