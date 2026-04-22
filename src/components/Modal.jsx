import { useEffect } from "react";

/**
 * Altalanos modal wrapper (Updates oldal stilusa alapjan).
 * Props:
 *  - open: boolean
 *  - onClose: () => void
 *  - title: string (kis felso cimke)
 *  - children: tartalom
 *  - maxWidth: opcionalis, default 600px
 */
export default function Modal({ open, onClose, title, children, maxWidth = "600px" }) {
    useEffect(() => {
        if (!open) return;
        const handler = (e) => { if (e.key === "Escape") onClose?.(); };
        window.addEventListener("keydown", handler);
        // body scroll lock
        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            window.removeEventListener("keydown", handler);
            document.body.style.overflow = prevOverflow;
        };
    }, [open, onClose]);

    if (!open) return null;

    return (
        <div
            onClick={onClose}
            style={{
                position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
                background: "rgba(0,0,0,0.85)", zIndex: 99999,
                display: "flex", alignItems: "center", justifyContent: "center",
                padding: "20px"
            }}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                style={{
                    background: "rgba(15,15,25,0.97)",
                    backdropFilter: "blur(20px)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    borderRadius: "24px",
                    padding: "40px",
                    maxWidth,
                    width: "100%",
                    maxHeight: "85vh",
                    overflowY: "auto",
                    position: "relative",
                    boxShadow: "0 30px 80px rgba(0,0,0,0.7)",
                    animation: "modalIn 0.2s ease"
                }}
            >
                <style>{`
                    @keyframes modalIn {
                        from { opacity: 0; transform: scale(0.95) translateY(10px); }
                        to   { opacity: 1; transform: scale(1) translateY(0); }
                    }
                `}</style>

                <button
                    onClick={onClose}
                    aria-label="Bezárás"
                    style={{
                        position: "absolute", top: "16px", right: "20px",
                        background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)",
                        color: "white", fontSize: "1.1rem", cursor: "pointer",
                        borderRadius: "50%", width: "36px", height: "36px",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        zIndex: 2
                    }}
                >✕</button>

                {title && (
                    <>
                        <div style={{
                            fontSize: "0.75rem", letterSpacing: "3px",
                            color: "rgba(136,152,240,0.9)", fontWeight: "700",
                            marginBottom: "10px", textTransform: "uppercase",
                            paddingRight: "40px"
                        }}>
                            {title}
                        </div>
                        <div style={{ height: "1px", background: "rgba(255,255,255,0.08)", marginBottom: "20px" }} />
                    </>
                )}

                {children}
            </div>
        </div>
    );
}
