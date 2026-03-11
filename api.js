const BASE = 'http://localhost:3000';

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

export const bejelentkezes = (User_Name, Password) =>
    fetch(`${BASE}/belepes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ User_Name, Password })
    }).then(async r => {
        const data = await r.json();
        return { result: r.ok, ...data };
    });

export const kijelentkezes = () =>
    fetch(`${BASE}/kijelentkezes`, {
        method: 'POST',
        credentials: 'include'
    }).then(r => r.json());

export const getProfilAdatok = () =>
    fetch(`${BASE}/profil-adatok`, {
        credentials: 'include'
    }).then(r => r.json());

export const updateProfilAdat = (field, value) =>
    fetch(`${BASE}/profil-update`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ field, value })
    }).then(r => r.json());

export const updatePassword = (currentPassword, newPassword) =>
    fetch(`${BASE}/update-password`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ currentPassword, newPassword })
    }).then(r => r.json());

// HOME KÁRTYÁK
export const getHomeKartyak = () =>
    fetch(`${BASE}/home-cards`, {
        credentials: 'include'
    }).then(r => r.json());

export const updateHomeKartya = (id, tartalom) =>
    fetch(`${BASE}/home-cards/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ tartalom })
    }).then(r => r.json());

// NEWS
export const getNews = () =>
    fetch(`${BASE}/news`, {
        credentials: 'include'
    }).then(r => r.json());

export const addNews = (cim, tartalom, datum) =>
    fetch(`${BASE}/news`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ cim, tartalom, datum })
    }).then(r => r.json());

export const deleteNews = (id) =>
    fetch(`${BASE}/news/${id}`, {
        method: 'DELETE',
        credentials: 'include'
    }).then(r => r.json());

// UPDATES
export const getUpdates = () =>
    fetch(`${BASE}/updates`, {
        credentials: 'include'
    }).then(r => r.json());

export const addUpdate = (datum, szoveg) =>
    fetch(`${BASE}/updates`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ datum, szoveg })
    }).then(r => r.json());

export const deleteUpdate = (id) =>
    fetch(`${BASE}/updates/${id}`, {
        method: 'DELETE',
        credentials: 'include'
    }).then(r => r.json());