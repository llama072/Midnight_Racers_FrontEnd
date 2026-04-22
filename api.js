// BASE URL kornyezettol fuggoen. Vite .env fajlbol olvassa a VITE_API_BASE-t.
// Ha nincs beallitva, a prod szerverre mutat (biztos-halo).
export const BASE = import.meta.env.VITE_API_BASE || `https://nodejs216.dszcbaross.edu.hu`;

const TOKEN_KEY = 'auth_token';

// ---- TOKEN HELPERS ----
export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (t) => localStorage.setItem(TOKEN_KEY, t);
export const clearToken = () => localStorage.removeItem(TOKEN_KEY);

// Minden auth-os fetch-hez hozzáadja az Authorization headert
const authHeaders = (extra = {}) => {
    const t = getToken();
    const headers = { ...extra };
    if (t) headers['Authorization'] = `Bearer ${t}`;
    return headers;
};

// ---- REGISZTRACIO ----
export const regisztracio = (User_Name, First_Name, Last_Name, Email, Password) =>
    fetch(`${BASE}/regisztracio`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ User_Name, First_Name, Last_Name, Email, Password, Is_Admin: 0 })
    }).then(async r => {
        const data = await r.json();
        return { result: r.ok, ...data };
    });

// ---- BEJELENTKEZES ----
export const bejelentkezes = (User_Name, Password) =>
    fetch(`${BASE}/belepes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ User_Name, Password })
    }).then(async r => {
        const data = await r.json();
        // Ha a backend küldött tokent, mentsük el localStorage-ba
        if (r.ok && data.token) {
            setToken(data.token);
        }
        return { result: r.ok, ...data };
    });

// ---- /me: szerveroldali, megbízható user info (is_admin is innen jön) ----
export const getMe = () =>
    fetch(`${BASE}/me`, {
        credentials: 'include',
        headers: authHeaders()
    }).then(async r => {
        if (!r.ok) return null;
        return r.json();
    }).catch(() => null);

// ---- KIJELENTKEZES ----
export const kijelentkezes = () =>
    fetch(`${BASE}/kijelentkezes`, {
        method: 'POST',
        credentials: 'include',
        headers: authHeaders()
    }).then(r => r.json()).finally(() => {
        clearToken();   // mindenképp töröljük lokálisan
    });

// ---- PROFIL ----
export const getProfilAdatok = () =>
    fetch(`${BASE}/profil-adatok`, {
        credentials: 'include',
        headers: authHeaders()
    }).then(r => r.json());

export const updateProfilAdat = (field, value) =>
    fetch(`${BASE}/profil-update`, {
        method: 'PUT',
        credentials: 'include',
        headers: authHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({ field, value })
    }).then(r => r.json());

export const updatePassword = (currentPassword, newPassword) =>
    fetch(`${BASE}/update-password`, {
        method: 'PUT',
        credentials: 'include',
        headers: authHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({ currentPassword, newPassword })
    }).then(r => r.json());

// ---- FIOK TORLES ----
export const deleteProfile = (currentPassword) =>
    fetch(`${BASE}/profil-delete`, {
        method: 'DELETE',
        credentials: 'include',
        headers: authHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({ currentPassword })
    }).then(r => r.json());

// ---- HOME KÁRTYÁK ----
export const getHomeKartyak = () =>
    fetch(`${BASE}/home-cards`, { credentials: 'include' }).then(r => r.json());

export const updateHomeKartya = (id, tartalom) =>
    fetch(`${BASE}/home-cards/${id}`, {
        method: 'PUT',
        credentials: 'include',
        headers: authHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({ tartalom })
    }).then(r => r.json());

// ---- NEWS ----
export const getNews = () =>
    fetch(`${BASE}/news`, { credentials: 'include' }).then(r => r.json());

export const addNews = (cim, tartalom, datum) =>
    fetch(`${BASE}/news`, {
        method: 'POST',
        credentials: 'include',
        headers: authHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({ cim, tartalom, datum })
    }).then(r => r.json());

export const updateNews = (id, cim, tartalom, datum) =>
    fetch(`${BASE}/news/${id}`, {
        method: 'PUT',
        credentials: 'include',
        headers: authHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({ cim, tartalom, datum })
    }).then(r => r.json());

export const deleteNews = (id) =>
    fetch(`${BASE}/news/${id}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: authHeaders()
    }).then(r => r.json());

// ---- ABOUT GALLERY ----
export const getAboutGallery = () =>
    fetch(`${BASE}/about-gallery`, { credentials: 'include' }).then(r => r.json());

export const addAboutGalleryImage = (url) =>
    fetch(`${BASE}/about-gallery`, {
        method: 'POST',
        credentials: 'include',
        headers: authHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({ url })
    }).then(r => r.json());

export const uploadAboutGalleryImage = (file) => {
    const formData = new FormData();
    formData.append('image', file);
    return fetch(`${BASE}/about-gallery/upload`, {
        method: 'POST',
        credentials: 'include',
        headers: authHeaders(),   // NE adj Content-Type-t multipart-nál!
        body: formData
    }).then(r => r.json());
};

export const deleteAboutGalleryImage = (id) =>
    fetch(`${BASE}/about-gallery/${id}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: authHeaders()
    }).then(r => r.json());

// ---- UPDATES ----
export const getUpdates = () =>
    fetch(`${BASE}/updates`, { credentials: 'include' }).then(r => r.json());

export const addUpdate = (datum, szoveg) =>
    fetch(`${BASE}/updates`, {
        method: 'POST',
        credentials: 'include',
        headers: authHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({ datum, szoveg })
    }).then(r => r.json());

export const deleteUpdate = (id) =>
    fetch(`${BASE}/updates/${id}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: authHeaders()
    }).then(r => r.json());

// ---- STATS ----
export const getMyStats = () =>
    fetch(`${BASE}/my-stats`, {
        credentials: 'include',
        headers: authHeaders()
    }).then(r => r.json());

export const getLeaderboard = () =>
    fetch(`${BASE}/leaderboard`, { credentials: 'include' }).then(r => r.json());
