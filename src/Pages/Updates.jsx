import { useState, useEffect } from "react";
import BackGround from "../assets/Background.png";
import DarkBackGround from "../assets/dark.jpg";
import MoonIcon from "../assets/moon.png";
import SunIcon from "../assets/sun.png";
import Navbar from "../components/Navbar";
import Card from "../components/Card";
import { useTheme } from "../context/ThemeContext";
import { getUpdates, addUpdate, deleteUpdate } from "../../api";
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Updates() {
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const { isDarkMode, toggleTheme } = useTheme();
    const [user, setUser] = useState(null);
    const isAdmin = user?.is_admin === 1;

    const [updates, setUpdates] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [newDatum, setNewDatum] = useState('');
    const [newSzoveg, setNewSzoveg] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            try { setUser(JSON.parse(storedUser)); }
            catch (e) { console.error(e); }
        }

        getUpdates().then(data => {
            if (Array.isArray(data)) {
                setUpdates(data);
            }
        }).catch(() => setUpdates([]));
    }, []);

    const handleMouseMove = (e) => {
        const x = (window.innerWidth / 2 - e.pageX) / 70;
        const y = (window.innerHeight / 2 - e.pageY) / 70;
        setOffset({ x, y });
    };

    const handleAdd = async () => {
        if (!newDatum || !newSzoveg) {
            alert("Töltsd ki a dátumot és a szöveget!");
            return;
        }
        setLoading(true);
        try {
            const res = await addUpdate(newDatum, newSzoveg);
            if (res.result) {
                const ujUpdate = { id: res.id, datum: newDatum, szoveg: newSzoveg };
                setUpdates(prev => [ujUpdate, ...prev]);
                setNewDatum('');
                setNewSzoveg('');
                setShowForm(false);
            } else {
                alert("Hiba: " + res.message);
            }
        } catch {
            alert("Szerver hiba!");
        }
        setLoading(false);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Biztosan törlöd ezt az update-et?")) return;
        try {
            const res = await deleteUpdate(id);
            if (res.result) {
                setUpdates(prev => prev.filter(u => u.id !== id));
            } else {
                alert("Hiba: " + res.message);
            }
        } catch {
            alert("Szerver hiba!");
        }
    };

    const formatDatum = (datum) => {
        return datum.slice(0, 10).replace(/-/g, '.');
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

            <div style={{
                position: 'relative', zIndex: 2,
                height: '100vh', width: '100vw',
                overflowY: 'auto', overflowX: 'hidden'
            }}>
                <Navbar />

                <div className="container-fluid" style={{
                    paddingTop: '120px', paddingBottom: '50px',
                    paddingLeft: '150px', paddingRight: '150px',
                    display: 'flex', flexWrap: 'wrap',
                    justifyContent: 'center', gap: '40px', minHeight: '100%'
                }}>

                    {/* ADMIN: ÚJ UPDATE GOMB */}
                    {isAdmin && (
                        <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginBottom: '10px' }}>
                            {!showForm ? (
                                <button
                                    onClick={() => setShowForm(true)}
                                    style={{
                                        background: 'rgba(136,152,240,0.15)',
                                        border: '1px solid rgba(136,152,240,0.4)',
                                        color: 'white', borderRadius: '50px',
                                        padding: '10px 30px', cursor: 'pointer',
                                        fontSize: '1rem', fontWeight: '600',
                                        letterSpacing: '1px', transition: 'all 0.3s',
                                        backdropFilter: 'blur(10px)'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(136,152,240,0.3)'}
                                    onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(136,152,240,0.15)'}
                                >
                                    ＋ Új Update
                                </button>
                            ) : (
                                <div style={{
                                    background: 'rgba(255,255,255,0.05)',
                                    backdropFilter: 'blur(15px)',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: '20px',
                                    padding: '24px',
                                    width: '100%',
                                    maxWidth: '600px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '12px'
                                }}>
                                    <h5 style={{ color: 'white', margin: 0, letterSpacing: '2px', fontWeight: '700' }}>
                                        ÚJ UPDATE
                                    </h5>
                                    <input
                                        type="date"
                                        value={newDatum}
                                        onChange={(e) => setNewDatum(e.target.value)}
                                        style={{
                                            background: 'rgba(255,255,255,0.08)',
                                            border: '1px solid rgba(255,255,255,0.2)',
                                            borderRadius: '10px', color: 'white',
                                            padding: '10px 14px', fontSize: '0.9rem',
                                            colorScheme: 'dark'
                                        }}
                                    />
                                    <textarea
                                        placeholder="Mit tartalmaz ez az update?"
                                        value={newSzoveg}
                                        onChange={(e) => setNewSzoveg(e.target.value)}
                                        rows={4}
                                        style={{
                                            background: 'rgba(255,255,255,0.08)',
                                            border: '1px solid rgba(255,255,255,0.2)',
                                            borderRadius: '10px', color: 'white',
                                            padding: '10px 14px', fontSize: '0.9rem',
                                            resize: 'vertical'
                                        }}
                                    />
                                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                                        <button onClick={() => { setShowForm(false); setNewDatum(''); setNewSzoveg(''); }} style={{
                                            background: 'rgba(255,100,100,0.15)', border: '1px solid rgba(255,100,100,0.3)',
                                            color: 'white', borderRadius: '10px', padding: '8px 20px',
                                            cursor: 'pointer', fontSize: '0.9rem'
                                        }}>Mégse</button>
                                        <button onClick={handleAdd} disabled={loading} style={{
                                            background: 'rgba(100,200,100,0.15)', border: '1px solid rgba(100,200,100,0.3)',
                                            color: 'white', borderRadius: '10px', padding: '8px 20px',
                                            cursor: 'pointer', fontSize: '0.9rem', fontWeight: '600'
                                        }}>{loading ? 'Mentés...' : '✔ Közzétesz'}</button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* UPDATE KÁRTYÁK */}
                    {updates.length === 0 ? (
                        <p style={{ color: 'rgba(255,255,255,0.4)', letterSpacing: '2px' }}>
                            Nincsenek még updatek.
                        </p>
                    ) : (
                        updates.map((u) => (
                            <Card key={u.id} title={formatDatum(u.datum)} width="300px" height="280px">
                                <div className="d-flex flex-column text-center">
                                    <p style={{ fontSize: '0.9rem', opacity: 0.8, whiteSpace: 'pre-wrap' }}>
                                        {u.szoveg}
                                    </p>
                                    {isAdmin && (
                                        <button
                                            onClick={() => handleDelete(u.id)}
                                            style={{
                                                background: 'rgba(255,100,100,0.15)',
                                                border: '1px solid rgba(255,100,100,0.3)',
                                                color: '#ff6b6b', borderRadius: '8px',
                                                padding: '4px 12px', cursor: 'pointer',
                                                fontSize: '0.8rem', marginTop: '8px', alignSelf: 'center'
                                            }}
                                        >
                                            🗑 Törlés
                                        </button>
                                    )}
                                </div>
                            </Card>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}