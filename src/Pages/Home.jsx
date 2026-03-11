import { useState, useEffect } from "react";
import BackGround from "../assets/Background.png";
import DarkBackGround from "../assets/dark.jpg";
import MoonIcon from "../assets/moon.png";
import SunIcon from "../assets/sun.png";
import Navbar from "../components/Navbar";
import Card from "../components/Card";
import { useTheme } from "../context/ThemeContext";
import { getHomeKartyak, updateHomeKartya, getNews, addNews, deleteNews } from "../../api";
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Home() {
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const { isDarkMode, toggleTheme } = useTheme();
    const [user, setUser] = useState(null);
    const isAdmin = user?.is_admin === 1;

    // ABOUT kártya
    const [about, setAbout] = useState({ id: 'about', tartalom: 'Töltés...' });
    const [editingAbout, setEditingAbout] = useState(false);
    const [aboutText, setAboutText] = useState('');

    // NEWS
    const [newsList, setNewsList] = useState([]);
    const [showNewsForm, setShowNewsForm] = useState(false);
    const [newCim, setNewCim] = useState('');
    const [newTartalom, setNewTartalom] = useState('');
    const [newDatum, setNewDatum] = useState('');
    const [newsLoading, setNewsLoading] = useState(false);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            try { setUser(JSON.parse(storedUser)); }
            catch (e) { console.error(e); }
        }

        // ABOUT betöltés
        getHomeKartyak().then(data => {
            if (data?.about) {
                setAbout({ id: data.about.id, tartalom: data.about.tartalom });
                setAboutText(data.about.tartalom);
            }
        }).catch(() => setAbout({ id: 'about', tartalom: 'Nincs adat.' }));

        // NEWS betöltés
        getNews().then(data => {
            if (Array.isArray(data)) setNewsList(data);
        }).catch(() => setNewsList([]));
    }, []);

    const handleMouseMove = (e) => {
        const x = (window.innerWidth / 2 - e.pageX) / 70;
        const y = (window.innerHeight / 2 - e.pageY) / 70;
        setOffset({ x, y });
    };

    const saveAbout = async () => {
        try {
            const res = await updateHomeKartya(about.id, aboutText);
            if (res.result) {
                setAbout(prev => ({ ...prev, tartalom: aboutText }));
                setEditingAbout(false);
            } else {
                alert("Hiba: " + res.message);
            }
        } catch {
            alert("Szerver hiba!");
        }
    };

    const handleAddNews = async () => {
        if (!newCim || !newTartalom || !newDatum) {
            alert("Töltsd ki az összes mezőt!");
            return;
        }
        setNewsLoading(true);
        try {
            const res = await addNews(newCim, newTartalom, newDatum);
            if (res.result) {
                const formatDatum = newDatum.replace(/-/g, '.');
                setNewsList(prev => [{ id: res.id, cim: newCim, tartalom: newTartalom, datum: formatDatum }, ...prev]);
                setNewCim('');
                setNewTartalom('');
                setNewDatum('');
                setShowNewsForm(false);
            } else {
                alert("Hiba: " + res.message);
            }
        } catch {
            alert("Szerver hiba!");
        }
        setNewsLoading(false);
    };

    const handleDeleteNews = async (id) => {
        if (!window.confirm("Biztosan törlöd ezt a hírt?")) return;
        try {
            const res = await deleteNews(id);
            if (res.result) {
                setNewsList(prev => prev.filter(n => n.id !== id));
            } else {
                alert("Hiba: " + res.message);
            }
        } catch {
            alert("Szerver hiba!");
        }
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
                            {/* Admin: új hír gomb */}
                            {isAdmin && (
                                <div style={{ marginBottom: '12px' }}>
                                    {!showNewsForm ? (
                                        <button
                                            onClick={() => setShowNewsForm(true)}
                                            style={{
                                                width: '100%',
                                                background: 'rgba(136,152,240,0.15)',
                                                border: '1px solid rgba(136,152,240,0.4)',
                                                color: 'white', borderRadius: '10px',
                                                padding: '7px', cursor: 'pointer',
                                                fontSize: '0.85rem', fontWeight: '600',
                                                letterSpacing: '1px'
                                            }}
                                            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(136,152,240,0.3)'}
                                            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(136,152,240,0.15)'}
                                        >
                                            ＋ Új hír
                                        </button>
                                    ) : (
                                        <div style={{
                                            background: 'rgba(255,255,255,0.05)',
                                            border: '1px solid rgba(255,255,255,0.1)',
                                            borderRadius: '12px', padding: '12px',
                                            display: 'flex', flexDirection: 'column', gap: '8px'
                                        }}>
                                            <input
                                                type="text"
                                                placeholder="Cím"
                                                value={newCim}
                                                onChange={(e) => setNewCim(e.target.value)}
                                                style={{
                                                    background: 'rgba(255,255,255,0.08)',
                                                    border: '1px solid rgba(255,255,255,0.2)',
                                                    borderRadius: '8px', color: 'white',
                                                    padding: '8px 12px', fontSize: '0.85rem'
                                                }}
                                            />
                                            <textarea
                                                placeholder="Tartalom"
                                                value={newTartalom}
                                                onChange={(e) => setNewTartalom(e.target.value)}
                                                rows={3}
                                                style={{
                                                    background: 'rgba(255,255,255,0.08)',
                                                    border: '1px solid rgba(255,255,255,0.2)',
                                                    borderRadius: '8px', color: 'white',
                                                    padding: '8px 12px', fontSize: '0.85rem',
                                                    resize: 'vertical'
                                                }}
                                            />
                                            <input
                                                type="date"
                                                value={newDatum}
                                                onChange={(e) => setNewDatum(e.target.value)}
                                                style={{
                                                    background: 'rgba(255,255,255,0.08)',
                                                    border: '1px solid rgba(255,255,255,0.2)',
                                                    borderRadius: '8px', color: 'white',
                                                    padding: '8px 12px', fontSize: '0.85rem',
                                                    colorScheme: 'dark'
                                                }}
                                            />
                                            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                                <button onClick={() => { setShowNewsForm(false); setNewCim(''); setNewTartalom(''); setNewDatum(''); }} style={{
                                                    background: 'rgba(255,100,100,0.15)', border: '1px solid rgba(255,100,100,0.3)',
                                                    color: 'white', borderRadius: '8px', padding: '5px 14px',
                                                    cursor: 'pointer', fontSize: '0.8rem'
                                                }}>Mégse</button>
                                                <button onClick={handleAddNews} disabled={newsLoading} style={{
                                                    background: 'rgba(100,200,100,0.15)', border: '1px solid rgba(100,200,100,0.3)',
                                                    color: 'white', borderRadius: '8px', padding: '5px 14px',
                                                    cursor: 'pointer', fontSize: '0.8rem', fontWeight: '600'
                                                }}>{newsLoading ? '...' : '✔ Mentés'}</button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Hírek listája */}
                            {newsList.length === 0 ? (
                                <p style={{ color: 'rgba(255,255,255,0.4)', textAlign: 'center', fontSize: '0.9rem' }}>
                                    Még nincs hír.
                                </p>
                            ) : (
                                newsList.map((news) => (
                                    <div key={news.id} style={{
                                        background: 'rgba(255,255,255,0.05)',
                                        border: '1px solid rgba(255,255,255,0.08)',
                                        borderRadius: '12px', padding: '12px',
                                        marginBottom: '10px'
                                    }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                                            <span style={{ fontWeight: '700', fontSize: '0.95rem', letterSpacing: '0.5px' }}>
                                                {news.cim}
                                            </span>
                                            <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', whiteSpace: 'nowrap', marginLeft: '8px' }}>
                                                {news.datum}
                                            </span>
                                        </div>
                                        <p style={{ fontSize: '0.85rem', opacity: 0.75, margin: 0, lineHeight: '1.5' }}>
                                            {news.tartalom}
                                        </p>
                                        {isAdmin && (
                                            <button
                                                onClick={() => handleDeleteNews(news.id)}
                                                style={{
                                                    marginTop: '8px',
                                                    background: 'rgba(255,100,100,0.1)',
                                                    border: '1px solid rgba(255,100,100,0.2)',
                                                    color: '#ff6b6b', borderRadius: '6px',
                                                    padding: '2px 10px', cursor: 'pointer',
                                                    fontSize: '0.75rem'
                                                }}
                                            >
                                                🗑 Törlés
                                            </button>
                                        )}
                                    </div>
                                ))
                            )}
                        </Card>

                        {/* ABOUT KÁRTYA */}
                        <Card title="ABOUT THE GAME">
                            {editingAbout ? (
                                <textarea
                                    value={aboutText}
                                    onChange={(e) => setAboutText(e.target.value)}
                                    style={{
                                        width: '100%', minHeight: '150px',
                                        background: 'rgba(255,255,255,0.05)',
                                        border: '1px solid rgba(255,255,255,0.2)',
                                        borderRadius: '10px', color: 'white',
                                        padding: '10px', resize: 'vertical', fontSize: '0.9rem'
                                    }}
                                />
                            ) : (
                                <p style={{ whiteSpace: 'pre-wrap' }}>{about.tartalom}</p>
                            )}
                            {isAdmin && (
                                <div style={{ marginTop: '10px', display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                    {editingAbout ? (
                                        <>
                                            <button onClick={() => setEditingAbout(false)} style={{
                                                background: 'rgba(255,100,100,0.2)', border: '1px solid rgba(255,100,100,0.4)',
                                                color: 'white', borderRadius: '8px', padding: '4px 12px',
                                                cursor: 'pointer', fontSize: '0.8rem'
                                            }}>✕ Mégse</button>
                                            <button onClick={saveAbout} style={{
                                                background: 'rgba(100,200,100,0.2)', border: '1px solid rgba(100,200,100,0.4)',
                                                color: 'white', borderRadius: '8px', padding: '4px 12px',
                                                cursor: 'pointer', fontSize: '0.8rem'
                                            }}>✔ Mentés</button>
                                        </>
                                    ) : (
                                        <button onClick={() => setEditingAbout(true)} style={{
                                            background: 'rgba(136,152,240,0.2)', border: '1px solid rgba(136,152,240,0.4)',
                                            color: 'white', borderRadius: '8px', padding: '4px 12px',
                                            cursor: 'pointer', fontSize: '0.8rem', letterSpacing: '0.5px'
                                        }}>✏️ Szerkesztés</button>
                                    )}
                                </div>
                            )}
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}