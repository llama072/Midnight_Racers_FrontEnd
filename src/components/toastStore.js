// Egyszeru pub/sub a toast uzenetekhez. Kulon fileban van, hogy a Toast.jsx
// csak a komponenst exportalja (Vite/React fast-refresh megelegedett ezzel).

let listeners = [];
let nextId = 0;

export function subscribe(fn) {
    listeners.push(fn);
    return () => { listeners = listeners.filter((x) => x !== fn); };
}

function emit(t) {
    listeners.forEach((l) => l(t));
    return t.id;
}

/**
 * Imperativ API barhol a kodbol:
 *   import { toast } from "../components/toastStore";
 *   toast("Sikeres belepes!");          // info
 *   toast.success("Mentve!");           // zold
 *   toast.error("Hiba tortent!");       // piros
 *   toast.warning("Hianyos adat!");     // sarga
 */
export function toast(message, type = "info", duration = 3500) {
    nextId += 1;
    return emit({ id: nextId, message: String(message ?? ""), type, duration });
}
toast.success = (msg, dur) => toast(msg, "success", dur);
toast.error   = (msg, dur) => toast(msg, "error",   dur ?? 4500);
toast.warning = (msg, dur) => toast(msg, "warning", dur);
toast.info    = (msg, dur) => toast(msg, "info",    dur);
