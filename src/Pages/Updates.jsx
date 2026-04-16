import { useState, useEffect } from "react";
import Card from "../components/Card";
import PageWrapper from "../components/PageWrapper";
import { getUpdates, addUpdate, deleteUpdate } from "../../api";

export default function Updates() {
    const [user, setUser] = useState(null);
    const isAdmin = user?.is_admin === 1;

    const [updates, setUpdates] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [newDatum, setNewDatum] = useState('');
    const [newSzoveg, setNewSzoveg] = useState('');
    const [loading, setLoading] = useState(false);
    const [selectedUpdate, setSelectedUpdate] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            try { setUser(JSON.parse(storedUser)); }
            catch (e) { console.error(e); }
        }

        getUpdates().then(data => {
            if (Array.isArray(data)) setUpdates(data);
        }).catch(() => setUpdates([]));
    }, []);

    // ESC billentyű bezárja a modalt
    useEffect(() => {
        if (!selectedUpdate) return;
        const handler = (e) => { if (e.key === 'Escape') setSelectedUpdate(null); };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [selectedUpdate]);

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
                if (selectedUpdate?.id === id) setSelectedUpdate(null);
            } else {
                alert("Hiba: " + res.message);
            }
        } catch {
            alert("Szerver hiba!");
        }
    };

    const formatDatum = (datum) => datum.slice(0, 10).replace(/-/g, '.');

    return (
        <>
        <PageWrapper scrollClassName="no-scrollbar" scrollStyle={{ overflowX: 'hidden' }}>
            <div className="container-fluid" style={{
                paddingTop: '120px', paddingBottom: '50px',
                paddingLeft: '150px', paddingRight: '150px',
                display: 'flex', flexWrap: 'wrap',
                justifyContent: 'center', gap: '40px', minHeight: '100%'
            }}>

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
                                borderRadius: '20px', padding: '24px',
                                width: '100%', maxWidth: '600px',
                                display: 'flex', flexDirection: 'column', gap: '12px'
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

                {updates.length === 0 ? (
                    <p style={{ color: 'rgba(255,255,255,0.4)', letterSpacing: '2px' }}>
                        Nincsenek még updatek.
                    </p>
                ) : (
                    updates.map((u) => (
                        <div
                            key={u.id}
                            onClick={() => setSelectedUpdate(u)}
                            style={{ cursor: 'pointer' }}
                        >
                            <Card title={formatDatum(u.datum)} width="300px" height="280px">
                                <div className="d-flex flex-column text-center">
                                    <p style={{ fontSize: '0.9rem', opacity: 0.8, whiteSpace: 'pre-wrap' }}>
                                        {u.szoveg}
                                    </p>
                                    {isAdmin && (
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleDelete(u.id); }}
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
                        </div>
                    ))
                )}
            </div>
        </PageWrapper>

        {/* MODAL */}
        {selectedUpdate && (
            <div
                onClick={() => setSelectedUpdate(null)}
                style={{
                    position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
                    background: 'rgba(0,0,0,0.85)', zIndex: 99999,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    padding: '20px'
                }}
            >
                <div
                    onClick={e => e.stopPropagation()}
                    style={{
                        background: 'rgba(15,15,25,0.97)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255,255,255,0.12)',
                        borderRadius: '24px',
                        padding: '40px',
                        maxWidth: '600px',
                        width: '100%',
                        maxHeight: '80vh',
                        overflowY: 'auto',
                        position: 'relative',
                        boxShadow: '0 30px 80px rgba(0,0,0,0.7)',
                        animation: 'modalIn 0.2s ease'
                    }}
                >
                    <style>{`
                        @keyframes modalIn {
                            from { opacity: 0; transform: scale(0.95) translateY(10px); }
                            to   { opacity: 1; transform: scale(1) translateY(0); }
                        }
                    `}</style>

                    {/* Bezárás gomb */}
                    <button
                        onClick={() => setSelectedUpdate(null)}
                        style={{
                            position: 'absolute', top: '16px', right: '20px',
                            background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)',
                            color: 'white', fontSize: '1.1rem', cursor: 'pointer',
                            borderRadius: '50%', width: '36px', height: '36px',
                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}
                    >✕</button>

                    {/* Dátum */}
                    <div style={{
                        fontSize: '0.75rem', letterSpacing: '3px',
                        color: 'rgba(136,152,240,0.9)', fontWeight: '700',
                        marginBottom: '10px', textTransform: 'uppercase'
                    }}>
                        UPDATE — {formatDatum(selectedUpdate.datum)}
                    </div>

                    {/* Divider */}
                    <div style={{
                        height: '1px', background: 'rgba(255,255,255,0.08)',
                        marginBottom: '20px'
                    }} />

                    {/* Szöveg */}
                    <p style={{
                        fontSize: '0.95rem', lineHeight: '1.8',
                        color: 'rgba(255,255,255,0.85)',
                        whiteSpace: 'pre-wrap', margin: 0
                    }}>
                        {selectedUpdate.szoveg}
                    </p>

                    {/* Admin: törlés a modalban is */}
                    {isAdmin && (
                        <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end' }}>
                            <button
                                onClick={() => handleDelete(selectedUpdate.id)}
                                style={{
                                    background: 'rgba(255,100,100,0.15)', border: '1px solid rgba(255,100,100,0.3)',
                                    color: '#ff6b6b', borderRadius: '8px', padding: '6px 16px',
                                    cursor: 'pointer', fontSize: '0.85rem'
                                }}
                            >
                                🗑 Törlés
                            </button>
                        </div>
                    )}
                </div>
            </div>
        )}
        </>
    );
}
