import { useState, useEffect } from "react";
import BackGround from "../assets/Background.png";
import DarkBackGround from "../assets/dark.jpg";
import MoonIcon from "../assets/moon.png";
import SunIcon from "../assets/sun.png";
import Navbar from "../components/Navbar";
import Card from "../components/Card";
import { useTheme } from "../context/ThemeContext";
import { getHomeKartyak, updateHomeKartya } from "../../api";
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Home() {
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const { isDarkMode, toggleTheme } = useTheme();
    const [user, setUser] = useState(null);
    const isAdmin = user?.is_admin === 1;

    const [kartyak, setKartyak] = useState({
        news: { id: 'news', tartalom: 'Töltés...' },
        about: { id: 'about', tartalom: 'Töltés...' }
    });
    const [editing, setEditing] = useState(null); // 'news' vagy 'about'
    const [editText, setEditText] = useState('');

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            try { setUser(JSON.parse(storedUser)); }
            catch (e) { console.error(e); }
        }

        getHomeKartyak().then(data => {
            if (data) {
                setKartyak({
                    news:  { id: data.news?.id  || 'news',  tartalom: data.news?.tartalom  || '' },
                    about: { id: data.about?.id || 'about', tartalom: data.about?.tartalom || '' }
                });
            }
        }).catch(() => {
            setKartyak({
                news:  { id: 'news',  tartalom: 'Nincs adat.' },
                about: { id: 'about', tartalom: 'Nincs adat.' }
            });
        });
    }, []);

    const handleMouseMove = (e) => {
        const x = (window.innerWidth / 2 - e.pageX) / 70;
        const y = (window.innerHeight / 2 - e.pageY) / 70;
        setOffset({ x, y });
    };

    const startEdit = (mezo) => {
        setEditing(mezo);
        setEditText(kartyak[mezo].tartalom);
    };

    const saveEdit = async (mezo) => {
        try {
            const res = await updateHomeKartya(kartyak[mezo].id, editText);
            if (res.result) {
                setKartyak(prev => ({
                    ...prev,
                    [mezo]: { ...prev[mezo], tartalom: editText }
                }));
                setEditing(null);
            } else {
                alert("Hiba a mentésnél: " + res.message);
            }
        } catch {
            alert("Szerver hiba!");
        }
    };

    const AdminEditBar = ({ mezo }) => (
        <div style={{ marginTop: '10px', display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
            {editing === mezo ? (
                <>
                    <button onClick={() => setEditing(null)} style={{
                        background: 'rgba(255,100,100,0.2)', border: '1px solid rgba(255,100,100,0.4)',
                        color: 'white', borderRadius: '8px', padding: '4px 12px', cursor: 'pointer', fontSize: '0.8rem'
                    }}>✕ Mégse</button>
                    <button onClick={() => saveEdit(mezo)} style={{
                        background: 'rgba(100,200,100,0.2)', border: '1px solid rgba(100,200,100,0.4)',
                        color: 'white', borderRadius: '8px', padding: '4px 12px', cursor: 'pointer', fontSize: '0.8rem'
                    }}>✔ Mentés</button>
                </>
            ) : (
                <button onClick={() => startEdit(mezo)} style={{
                    background: 'rgba(136,152,240,0.2)', border: '1px solid rgba(136,152,240,0.4)',
                    color: 'white', borderRadius: '8px', padding: '4px 12px', cursor: 'pointer', fontSize: '0.8rem',
                    letterSpacing: '0.5px'
                }}>✏️ Szerkesztés</button>
            )}
        </div>
    );

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
                transition: 'background-image 0.5s ease-in-out',
                transform: `translate(${offset.x}px, ${offset.y}px)`
            }} />
            <div style={{
                position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                backgroundColor: isDarkMode ? 'transparent' : 'rgba(0,0,0,0.5)',
                zIndex: 1, transition: 'background-color 0.5s ease'
            }} />

            <div onClick={toggleTheme} style={{
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

            <div className="no-scrollbar" style={{
                position: 'relative', zIndex: 2, height: '100vh',
                overflowY: 'auto', width: '100%',
                display: 'flex', flexDirection: 'column', alignItems: 'center'
            }}>
                <Navbar />

                <div style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center',
                    marginTop: '15vh', width: '100%', flexShrink: 0
                }}>
                    <h1 className="display-1 text-white mb-5 text-center" style={{
                        fontFamily: "'Orbitron', sans-serif", fontWeight: '900',
                        letterSpacing: '5px', fontSize: '65px',
                        textShadow: isDarkMode ? '0 0 20px rgba(255,255,255,0.2)' : 'none'
                    }}>
                        MIDNIGHT RACERS
                    </h1>

                    <div className="card-container" style={{
                        display: 'flex', justifyContent: 'center',
                        gap: '40px', width: '100%', padding: '0 20px'
                    }}>
                        {/* NEWS KÁRTYA */}
                        <Card title="NEWS">
                            {editing === 'news' ? (
                                <textarea
                                    value={editText}
                                    onChange={(e) => setEditText(e.target.value)}
                                    style={{
                                        width: '100%', minHeight: '150px', background: 'rgba(255,255,255,0.05)',
                                        border: '1px solid rgba(255,255,255,0.2)', borderRadius: '10px',
                                        color: 'white', padding: '10px', resize: 'vertical', fontSize: '0.9rem'
                                    }}
                                />
                            ) : (
                                <p style={{ whiteSpace: 'pre-wrap' }}>{kartyak.news.tartalom}</p>
                            )}
                            {isAdmin && <AdminEditBar mezo="news" />}
                        </Card>

                        {/* ABOUT KÁRTYA */}
                        <Card title="ABOUT THE GAME">
                            {editing === 'about' ? (
                                <textarea
                                    value={editText}
                                    onChange={(e) => setEditText(e.target.value)}
                                    style={{
                                        width: '100%', minHeight: '150px', background: 'rgba(255,255,255,0.05)',
                                        border: '1px solid rgba(255,255,255,0.2)', borderRadius: '10px',
                                        color: 'white', padding: '10px', resize: 'vertical', fontSize: '0.9rem'
                                    }}
                                />
                            ) : (
                                <p style={{ whiteSpace: 'pre-wrap' }}>{kartyak.about.tartalom}</p>
                            )}
                            {isAdmin && <AdminEditBar mezo="about" />}
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}