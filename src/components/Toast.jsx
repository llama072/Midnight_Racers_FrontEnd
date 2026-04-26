import { useState, useEffect, useRef } from "react";
import { subscribe } from "./toastStore";

// Re-export hogy a meglevo `import { toast } from "./Toast"` kodok is mukodjenek.
// eslint-disable-next-line react-refresh/only-export-components
export { toast } from "./toastStore";

const TYPE_STYLES = {
    success: {
        accent: "rgba(80, 220, 130, 0.9)",
        bg:     "rgba(20, 50, 30, 0.92)",
        icon:   "✓"
    },
    error: {
        accent: "rgba(255, 100, 100, 0.9)",
        bg:     "rgba(50, 20, 25, 0.92)",
        icon:   "✕"
    },
    warning: {
        accent: "rgba(240, 192, 64, 0.9)",
        bg:     "rgba(50, 40, 18, 0.92)",
        icon:   "!"
    },
    info: {
        accent: "rgba(136, 152, 240, 0.9)",
        bg:     "rgba(20, 25, 50, 0.92)",
        icon:   "i"
    }
};

function ToastItem({ t, onDismiss }) {
    const styles = TYPE_STYLES[t.type] || TYPE_STYLES.info;
    const [leaving, setLeaving] = useState(false);
    const timer = useRef(null);

    useEffect(() => {
        timer.current = setTimeout(() => {
            setLeaving(true);
            setTimeout(() => onDismiss(t.id), 220);
        }, t.duration);
        return () => clearTimeout(timer.current);
    }, [t.id, t.duration, onDismiss]);

    const handleClick = () => {
        clearTimeout(timer.current);
        setLeaving(true);
        setTimeout(() => onDismiss(t.id), 220);
    };

    return (
        <div
            onClick={handleClick}
            style={{
                pointerEvents: "auto",
                minWidth: "260px",
                maxWidth: "380px",
                padding: "14px 18px 14px 16px",
                borderRadius: "14px",
                background: styles.bg,
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                border: `1px solid ${styles.accent}`,
                color: "white",
                fontSize: "0.9rem",
                lineHeight: "1.45",
                cursor: "pointer",
                boxShadow: "0 12px 32px rgba(0,0,0,0.55)",
                display: "flex",
                gap: "12px",
                alignItems: "flex-start",
                animation: leaving
                    ? "toastOut 0.22s ease forwards"
                    : "toastIn 0.28s cubic-bezier(.2,.8,.2,1)",
                position: "relative",
                overflow: "hidden"
            }}
        >
            <div style={{
                flexShrink: 0,
                width: "28px", height: "28px",
                borderRadius: "50%",
                background: styles.accent,
                color: "rgba(0,0,0,0.85)",
                fontWeight: "800",
                fontSize: "0.9rem",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: "'Orbitron', sans-serif",
                letterSpacing: "0.5px"
            }}>{styles.icon}</div>
            <div style={{
                flex: 1,
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
                paddingTop: "4px"
            }}>{t.message}</div>
            <div style={{
                position: "absolute",
                bottom: 0, left: 0,
                height: "2px",
                width: "100%",
                background: styles.accent,
                transformOrigin: "left center",
                animation: `toastProgress ${t.duration}ms linear forwards`
            }} />
        </div>
    );
}

export default function ToastContainer() {
    const [toasts, setToasts] = useState([]);

    useEffect(() => {
        const unsub = subscribe((t) => setToasts((prev) => [...prev, t]));
        return unsub;
    }, []);

    const dismiss = (id) => setToasts((prev) => prev.filter((x) => x.id !== id));

    return (
        <>
            <style>{`
                @keyframes toastIn {
                    from { opacity: 0; transform: translateY(-30px) scale(0.96); }
                    to   { opacity: 1; transform: translateY(0) scale(1); }
                }
                @keyframes toastOut {
                    from { opacity: 1; transform: translateY(0) scale(1); }
                    to   { opacity: 0; transform: translateY(-30px) scale(0.96); }
                }
                @keyframes toastProgress {
                    from { transform: scaleX(1); }
                    to   { transform: scaleX(0); }
                }
                @media (max-width: 600px) {
                    .toast-container {
                        top: 16px !important;
                        left: 12px !important;
                        right: 12px !important;
                        transform: none !important;
                        align-items: stretch !important;
                        max-width: none !important;
                    }
                }
            `}</style>
            <div
                className="toast-container"
                style={{
                    position: "fixed",
                    top: "24px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    zIndex: 100000,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "10px",
                    pointerEvents: "none",
                    maxWidth: "calc(100vw - 48px)"
                }}
            >
                {toasts.map((t) => (
                    <ToastItem key={t.id} t={t} onDismiss={dismiss} />
                ))}
            </div>
        </>
    );
}
