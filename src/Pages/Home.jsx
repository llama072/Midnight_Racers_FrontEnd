import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Card from "../components/Card";
import PageWrapper from "../components/PageWrapper";
import Modal from "../components/Modal";
import { getHomeKartyak, updateHomeKartya, getNews, addNews, updateNews, deleteNews, getAboutGallery, uploadAboutGalleryImage, deleteAboutGalleryImage, getMe, BASE } from "../../api";

const imgSrc = (url) => url?.startsWith('/uploads/') ? `${BASE}${url}` : url;

const inputStyle = {
    width: '100%', background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px',
    color: 'white', padding: '8px 12px', fontSize: '0.85rem',
    outline: 'none', marginBottom: '8px',
    colorScheme: 'dark'
};

export default function Home() {
    const [user, setUser] = useState(null);
    const isAdmin = user?.is_admin === 1;

    const [kartyak, setKartyak] = useState({
        news:  { id: 'news',  tartalom: 'Töltés...' },
        about: { id: 'about', tartalom: 'Töltés...' }
    });

    // News lista
    const [newsList, setNewsList] = useState([]);

    // --- ADMIN MODAL STATE-EK ---
    // News hozzaadas
    const [addNewsOpen, setAddNewsOpen] = useState(false);
    const [form, setForm] = useState({ cim: '', datum: '', tartalom: '' });
    const [formLoading, setFormLoading] = useState(false);
    // News szerkesztes (null vagy egy news item)
    const [editNewsItem, setEditNewsItem] = useState(null);
    const [editForm, setEditForm] = useState({ cim: '', datum: '', tartalom: '' });
    const [editLoading, setEditLoading] = useState(false);
    // About szerkesztes
    const [aboutEditOpen, setAboutEditOpen] = useState(false);
    const [aboutEditText, setAboutEditText] = useState('');
    const [aboutSaving, setAboutSaving] = useState(false);
    // Gallery kezeles
    const [galleryAdminOpen, setGalleryAdminOpen] = useState(false);

    // Gallery (About kártya)
    const [gallery, setGallery] = useState([]);
    const [activeSlide, setActiveSlide] = useState(0);
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [lightboxIndex, setLightboxIndex] = useState(0);
    const [uploadLoading, setUploadLoading] = useState(false);

    useEffect(() => {
        // BIZTONSAG: az is_admin-t csak a szervertol (/me) fogadjuk el. A localStorage-ban
        // barmi lehet, azt nem bizzuk meg. Ha nincs ervenyes session, user = null marad.
        getMe().then(data => {
            if (data) setUser(data);
        });

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

        getNews().then(data => {
            if (Array.isArray(data)) setNewsList(data);
        }).catch(() => {});

        getAboutGallery().then(data => {
            if (Array.isArray(data)) setGallery(data);
        }).catch(() => {});
    }, []);

    // Slideshow auto-rotate (6.5mp)
    useEffect(() => {
        if (gallery.length <= 1) return;
        const interval = setInterval(() => {
            setActiveSlide(prev => (prev + 1) % gallery.length);
        }, 6500);
        return () => clearInterval(interval);
    }, [gallery.length]);

    // Lightbox billentyű navigáció
    useEffect(() => {
        if (!lightboxOpen) return;
        const handler = (e) => {
            if (e.key === 'ArrowRight') setLightboxIndex(p => (p + 1) % gallery.length);
            if (e.key === 'ArrowLeft')  setLightboxIndex(p => (p - 1 + gallery.length) % gallery.length);
            if (e.key === 'Escape')     setLightboxOpen(false);
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [lightboxOpen, gallery.length]);

    // --- ABOUT SZOVEG SZERKESZTES (modal-ban) ---
    const openAboutEdit = () => {
        setAboutEditText(kartyak.about.tartalom || '');
        setAboutEditOpen(true);
    };

    const saveAboutEdit = async () => {
        setAboutSaving(true);
        try {
            const res = await updateHomeKartya(kartyak.about.id, aboutEditText);
            if (res.result) {
                setKartyak(prev => ({ ...prev, about: { ...prev.about, tartalom: aboutEditText } }));
                setAboutEditOpen(false);
            } else alert("Hiba a mentésnél: " + res.message);
        } catch { alert("Szerver hiba!"); }
        setAboutSaving(false);
    };

    // --- NEWS HOZZAADAS ---
    const openAddNews = () => {
        setForm({ cim: '', datum: '', tartalom: '' });
        setAddNewsOpen(true);
    };

    const handleAddNews = async () => {
        if (!form.cim || !form.datum || !form.tartalom) return alert("Töltsd ki az összes mezőt!");
        setFormLoading(true);
        try {
            const res = await addNews(form.cim, form.tartalom, form.datum);
            if (res.result) {
                const fresh = await getNews();
                if (Array.isArray(fresh)) setNewsList(fresh);
                setForm({ cim: '', datum: '', tartalom: '' });
                setAddNewsOpen(false);
            } else alert("Hiba: " + res.message);
        } catch { alert("Szerver hiba!"); }
        setFormLoading(false);
    };

    // --- NEWS SZERKESZTES ---
    const startEditNews = (item) => {
        setEditNewsItem(item);
        setEditForm({ cim: item.cim, datum: item.datum, tartalom: item.tartalom });
    };

    const closeEditNews = () => { setEditNewsItem(null); setEditForm({ cim: '', datum: '', tartalom: '' }); };

    const handleUpdateNews = async () => {
        if (!editNewsItem) return;
        if (!editForm.cim || !editForm.datum || !editForm.tartalom) return alert("Töltsd ki az összes mezőt!");
        setEditLoading(true);
        try {
            const id = editNewsItem.id;
            const res = await updateNews(id, editForm.cim, editForm.tartalom, editForm.datum);
            if (res.result) {
                setNewsList(prev => prev.map(n => n.id === id ? { ...n, ...editForm } : n));
                closeEditNews();
            } else alert("Hiba: " + res.message);
        } catch { alert("Szerver hiba!"); }
        setEditLoading(false);
    };

    const handleUploadImage = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploadLoading(true);
        try {
            const res = await uploadAboutGalleryImage(file);
            if (res.result) {
                const fresh = await getAboutGallery();
                if (Array.isArray(fresh)) setGallery(fresh);
            } else alert("Hiba: " + res.message);
        } catch { alert("Szerver hiba!"); }
        e.target.value = '';
        setUploadLoading(false);
    };

    const handleDeleteGalleryImage = async (id) => {
        if (!window.confirm("Törlöd ezt a képet?")) return;
        try {
            const res = await deleteAboutGalleryImage(id);
            if (res.result) {
                setGallery(prev => {
                    const next = prev.filter(g => g.id !== id);
                    setActiveSlide(0);
                    return next;
                });
            } else alert("Hiba: " + res.message);
        } catch { alert("Szerver hiba!"); }
    };

    const handleDeleteNews = async (id) => {
        if (!window.confirm("Biztosan törlöd ezt a hírt?")) return;
        try {
            const res = await deleteNews(id);
            if (res.result) setNewsList(prev => prev.filter(n => n.id !== id));
            else alert("Hiba: " + res.message);
        } catch { alert("Szerver hiba!"); }
    };

    return (
        <>
        <PageWrapper scrollClassName="no-scrollbar" scrollStyle={{ alignItems: 'center' }}>
            <div style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                marginTop: 'clamp(120px, 15vh, 160px)', width: '100%', flexShrink: 0
            }}>
                <h1 className="home-title display-1 text-white mb-4 text-center" style={{
                    fontFamily: "'Orbitron', sans-serif", fontWeight: '900',
                    letterSpacing: '5px'
                }}>
                    MIDNIGHT RACERS
                </h1>

                <div className="card-container">
                    {/* NEWS KÁRTYA */}
                    <Card title="NEWS">
                        <div className="no-scrollbar" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                            {newsList.length === 0 ? (
                                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem' }}>Még nincs hír.</p>
                            ) : newsList.map(item => (
                                <div key={item.id} style={{
                                    borderBottom: '1px solid rgba(255,255,255,0.08)',
                                    paddingBottom: '10px', marginBottom: '10px'
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                                        <div style={{ minWidth: 0, flex: 1 }}>
                                            <div style={{ fontWeight: '700', fontSize: '0.95rem', letterSpacing: '0.5px', wordBreak: 'break-word' }}>{item.cim}</div>
                                            <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.45)', marginBottom: '4px' }}>{item.datum}</div>
                                            <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.8)', whiteSpace: 'pre-wrap', wordBreak: 'break-word', overflowWrap: 'break-word' }}>{item.tartalom}</div>
                                        </div>
                                        {isAdmin && (
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flexShrink: 0 }}>
                                                <button onClick={() => startEditNews(item)} title="Szerkesztés" style={{
                                                    background: 'rgba(136,152,240,0.2)', border: '1px solid rgba(136,152,240,0.4)',
                                                    color: 'white', borderRadius: '6px', padding: '2px 8px',
                                                    cursor: 'pointer', fontSize: '0.75rem'
                                                }}>✏️</button>
                                                <button onClick={() => handleDeleteNews(item.id)} title="Törlés" style={{
                                                    background: 'rgba(255,80,80,0.15)', border: '1px solid rgba(255,80,80,0.3)',
                                                    color: '#ff6b6b', borderRadius: '6px', padding: '2px 8px',
                                                    cursor: 'pointer', fontSize: '0.75rem'
                                                }}>🗑️</button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {isAdmin && (
                            <div style={{ marginTop: '10px', display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                <button onClick={openAddNews} style={{
                                    background: 'rgba(100,200,100,0.2)', border: '1px solid rgba(100,200,100,0.4)',
                                    color: 'white', borderRadius: '8px', padding: '4px 12px', cursor: 'pointer', fontSize: '0.8rem'
                                }}>＋ Hozzáadás</button>
                            </div>
                        )}
                    </Card>

                    {/* ABOUT KÁRTYA */}
                    <Card title="ABOUT THE GAME">
                        {gallery.length > 0 && (
                            <div
                                onClick={() => { setLightboxIndex(activeSlide); setLightboxOpen(true); }}
                                style={{
                                    position: 'relative', width: '100%', paddingTop: '56.25%',
                                    borderRadius: '10px', overflow: 'hidden', cursor: 'pointer',
                                    marginBottom: '12px', background: 'rgba(0,0,0,0.3)'
                                }}
                            >
                                {gallery.map((img, i) => (
                                    <img key={img.id} src={imgSrc(img.url)} alt=""
                                        style={{
                                            position: 'absolute', top: 0, left: 0,
                                            width: '100%', height: '100%', objectFit: 'cover',
                                            opacity: i === activeSlide ? 1 : 0,
                                            transition: 'opacity 0.8s ease'
                                        }}
                                    />
                                ))}
                                {gallery.length > 1 && (
                                    <div style={{
                                        position: 'absolute', bottom: '8px', left: '50%',
                                        transform: 'translateX(-50%)', display: 'flex', gap: '6px', zIndex: 2
                                    }}>
                                        {gallery.map((_, i) => (
                                            <div key={i} style={{
                                                width: '7px', height: '7px', borderRadius: '50%',
                                                background: i === activeSlide ? 'white' : 'rgba(255,255,255,0.35)',
                                                transition: 'background 0.3s', boxShadow: '0 1px 3px rgba(0,0,0,0.5)'
                                            }} />
                                        ))}
                                    </div>
                                )}
                                <div style={{
                                    position: 'absolute', top: '8px', right: '8px',
                                    background: 'rgba(0,0,0,0.55)', borderRadius: '6px',
                                    padding: '3px 7px', fontSize: '0.7rem', zIndex: 2
                                }}>🔍</div>
                            </div>
                        )}

                        {kartyak.about.tartalom && <p style={{ whiteSpace: 'pre-wrap', marginBottom: '8px' }}>{kartyak.about.tartalom}</p>}

                        {isAdmin && (
                            <div style={{ marginTop: '10px', display: 'flex', gap: '8px', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                                <button onClick={() => setGalleryAdminOpen(true)} style={{
                                    background: 'rgba(200,160,80,0.2)', border: '1px solid rgba(200,160,80,0.4)',
                                    color: 'white', borderRadius: '8px', padding: '4px 12px',
                                    cursor: 'pointer', fontSize: '0.8rem'
                                }}>🖼️ Képek</button>
                                <button onClick={openAboutEdit} style={{
                                    background: 'rgba(136,152,240,0.2)', border: '1px solid rgba(136,152,240,0.4)',
                                    color: 'white', borderRadius: '8px', padding: '4px 12px', cursor: 'pointer', fontSize: '0.8rem'
                                }}>✏️ Szerkesztés</button>
                            </div>
                        )}
                    </Card>
                </div>
            </div>
        </PageWrapper>

        {/* LIGHTBOX */}
        {lightboxOpen && gallery.length > 0 && (
            <div
                onClick={() => setLightboxOpen(false)}
                style={{
                    position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
                    background: 'rgba(0,0,0,0.92)', zIndex: 99999,
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}
            >
                <button
                    onClick={() => setLightboxOpen(false)}
                    style={{
                        position: 'absolute', top: '20px', right: '24px',
                        background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)',
                        color: 'white', fontSize: '1.3rem', cursor: 'pointer',
                        borderRadius: '50%', width: '42px', height: '42px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        zIndex: 2
                    }}
                >✕</button>

                <img
                    src={imgSrc(gallery[lightboxIndex]?.url)} alt=""
                    onClick={e => e.stopPropagation()}
                    style={{
                        maxWidth: '88vw', maxHeight: '82vh',
                        objectFit: 'contain', borderRadius: '10px',
                        boxShadow: '0 0 60px rgba(0,0,0,0.8)'
                    }}
                />

                <div style={{
                    position: 'absolute', bottom: '24px', left: '50%', transform: 'translateX(-50%)',
                    color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem', letterSpacing: '1px'
                }}>
                    {lightboxIndex + 1} / {gallery.length}
                </div>

                {gallery.length > 1 && (
                    <>
                        <button
                            onClick={e => { e.stopPropagation(); setLightboxIndex(p => (p - 1 + gallery.length) % gallery.length); }}
                            style={{
                                position: 'absolute', left: '20px',
                                background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)',
                                color: 'white', fontSize: '2rem', cursor: 'pointer',
                                borderRadius: '50%', width: '52px', height: '52px',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                transition: 'background 0.2s'
                            }}
                            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
                            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                        >‹</button>
                        <button
                            onClick={e => { e.stopPropagation(); setLightboxIndex(p => (p + 1) % gallery.length); }}
                            style={{
                                position: 'absolute', right: '20px',
                                background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)',
                                color: 'white', fontSize: '2rem', cursor: 'pointer',
                                borderRadius: '50%', width: '52px', height: '52px',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                transition: 'background 0.2s'
                            }}
                            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
                            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                        >›</button>
                    </>
                )}
            </div>
        )}

        {/* ======= ADMIN MODALOK ======= */}

        {/* NEWS HOZZAADAS */}
        <Modal open={addNewsOpen} onClose={() => setAddNewsOpen(false)} title="Új hír hozzáadása">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <input
                    placeholder="Cím"
                    value={form.cim}
                    onChange={e => setForm(p => ({ ...p, cim: e.target.value }))}
                    style={modalInputStyle}
                />
                <input
                    type="date"
                    value={form.datum}
                    onChange={e => setForm(p => ({ ...p, datum: e.target.value }))}
                    style={modalInputStyle}
                />
                <textarea
                    placeholder="Tartalom"
                    value={form.tartalom}
                    onChange={e => setForm(p => ({ ...p, tartalom: e.target.value }))}
                    rows={5}
                    style={{ ...modalInputStyle, resize: 'vertical' }}
                />
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '4px' }}>
                    <button onClick={() => setAddNewsOpen(false)} style={modalCancelBtn}>Mégse</button>
                    <button onClick={handleAddNews} disabled={formLoading} style={modalSaveBtn}>
                        {formLoading ? 'Mentés...' : '✔ Közzétesz'}
                    </button>
                </div>
            </div>
        </Modal>

        {/* NEWS SZERKESZTES */}
        <Modal open={!!editNewsItem} onClose={closeEditNews} title="Hír szerkesztése">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <input
                    placeholder="Cím"
                    value={editForm.cim}
                    onChange={e => setEditForm(p => ({ ...p, cim: e.target.value }))}
                    style={modalInputStyle}
                />
                <input
                    type="date"
                    value={editForm.datum}
                    onChange={e => setEditForm(p => ({ ...p, datum: e.target.value }))}
                    style={modalInputStyle}
                />
                <textarea
                    placeholder="Tartalom"
                    value={editForm.tartalom}
                    onChange={e => setEditForm(p => ({ ...p, tartalom: e.target.value }))}
                    rows={5}
                    style={{ ...modalInputStyle, resize: 'vertical' }}
                />
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'space-between', marginTop: '4px', flexWrap: 'wrap' }}>
                    <button
                        onClick={() => { if (editNewsItem) { handleDeleteNews(editNewsItem.id); closeEditNews(); } }}
                        style={modalDeleteBtn}
                    >🗑 Törlés</button>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button onClick={closeEditNews} style={modalCancelBtn}>Mégse</button>
                        <button onClick={handleUpdateNews} disabled={editLoading} style={modalSaveBtn}>
                            {editLoading ? 'Mentés...' : '✔ Mentés'}
                        </button>
                    </div>
                </div>
            </div>
        </Modal>

        {/* ABOUT SZOVEG SZERKESZTES */}
        <Modal open={aboutEditOpen} onClose={() => setAboutEditOpen(false)} title="About szöveg szerkesztése">
            <textarea
                value={aboutEditText}
                onChange={(e) => setAboutEditText(e.target.value)}
                rows={10}
                style={{ ...modalInputStyle, resize: 'vertical', width: '100%' }}
            />
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '12px' }}>
                <button onClick={() => setAboutEditOpen(false)} style={modalCancelBtn}>Mégse</button>
                <button onClick={saveAboutEdit} disabled={aboutSaving} style={modalSaveBtn}>
                    {aboutSaving ? 'Mentés...' : '✔ Mentés'}
                </button>
            </div>
        </Modal>

        {/* GALLERY KEZELES */}
        <Modal open={galleryAdminOpen} onClose={() => setGalleryAdminOpen(false)} title="Képek kezelése" maxWidth="700px">
            {gallery.length === 0 && (
                <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.5)', marginBottom: '12px' }}>Még nincs kép feltöltve.</p>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '50vh', overflowY: 'auto' }}>
                {gallery.map(img => (
                    <div key={img.id} style={{
                        display: 'flex', gap: '12px', alignItems: 'center',
                        background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                        borderRadius: '10px', padding: '8px'
                    }}>
                        <img src={imgSrc(img.url)} alt="" style={{
                            width: '80px', height: '50px', objectFit: 'cover',
                            borderRadius: '6px', flexShrink: 0,
                            background: 'rgba(0,0,0,0.3)'
                        }} onError={e => e.target.style.opacity = '0.3'} />
                        <span style={{
                            flex: 1, fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)',
                            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                        }}>{img.url}</span>
                        <button onClick={() => handleDeleteGalleryImage(img.id)} style={{
                            background: 'rgba(255,80,80,0.15)', border: '1px solid rgba(255,80,80,0.3)',
                            color: '#ff6b6b', borderRadius: '8px', padding: '6px 12px',
                            cursor: 'pointer', fontSize: '0.8rem', flexShrink: 0
                        }}>🗑 Törlés</button>
                    </div>
                ))}
            </div>
            <label style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                gap: '10px', marginTop: '16px', padding: '14px 20px',
                background: uploadLoading ? 'rgba(100,200,100,0.1)' : 'rgba(100,200,100,0.2)',
                border: '1px dashed rgba(100,200,100,0.5)',
                borderRadius: '10px', cursor: uploadLoading ? 'wait' : 'pointer',
                color: 'white', fontSize: '0.9rem', transition: 'background 0.2s'
            }}>
                {uploadLoading ? '⏳ Feltöltés...' : '＋ Új kép feltöltése'}
                <input
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={handleUploadImage}
                    disabled={uploadLoading}
                />
            </label>
        </Modal>
        </>
    );
}

// --- Modal belso stilusok ---
const modalInputStyle = {
    width: '100%',
    background: 'rgba(255,255,255,0.08)',
    border: '1px solid rgba(255,255,255,0.2)',
    borderRadius: '10px',
    color: 'white',
    padding: '10px 14px',
    fontSize: '0.9rem',
    outline: 'none',
    colorScheme: 'dark',
    fontFamily: 'inherit'
};
const modalCancelBtn = {
    background: 'rgba(255,100,100,0.15)',
    border: '1px solid rgba(255,100,100,0.3)',
    color: 'white', borderRadius: '10px',
    padding: '8px 20px', cursor: 'pointer', fontSize: '0.9rem'
};
const modalSaveBtn = {
    background: 'rgba(100,200,100,0.15)',
    border: '1px solid rgba(100,200,100,0.3)',
    color: 'white', borderRadius: '10px',
    padding: '8px 20px', cursor: 'pointer',
    fontSize: '0.9rem', fontWeight: '600'
};
const modalDeleteBtn = {
    background: 'rgba(255,80,80,0.15)',
    border: '1px solid rgba(255,80,80,0.3)',
    color: '#ff6b6b', borderRadius: '10px',
    padding: '8px 16px', cursor: 'pointer', fontSize: '0.85rem'
};
