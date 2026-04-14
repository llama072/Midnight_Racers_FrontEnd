import { useState, useRef } from "react";

// Fontos: a useState-nek a függvényen BELÜL kell lennie!
export default function Card({ title, children, width = '400px', height = 'clamp(320px, 50vh, 450px)' }) {
    const [isScrolling, setIsScrolling] = useState(false);
    const scrollTimeout = useRef(null);
    const isAutoHeight = height === 'auto';

    const handleScroll = () => {
        setIsScrolling(true);
        clearTimeout(scrollTimeout.current);
        scrollTimeout.current = setTimeout(() => {
            setIsScrolling(false);
        }, 1000);
    };

    return (
        <div
            className="card text-white border-white border-opacity-10 shadow-lg"
            style={{
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(15px)',
                WebkitBackdropFilter: 'blur(15px)',
                width: `clamp(300px, 95vw, ${width})`,
                height: isAutoHeight ? 'auto' : height,
                borderRadius: '25px',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                position: 'relative'
            }}
        >
            <div className="card-header border-bottom border-white border-opacity-10 bg-transparent py-3">
                <h2 className="text-center m-0 fw-bold ls-widest uppercase"
                    style={{ fontSize: '1.8rem', letterSpacing: '3px' }}>
                    {title}
                </h2>
            </div>

            <div
                className={`card-body p-4 custom-scroll ${isScrolling ? 'scrolling' : ''}`}
                onScroll={handleScroll}
                style={{
                    overflowY: isAutoHeight ? 'visible' : 'auto',
                    flex: isAutoHeight ? 'none' : 1
                }}
            >
                {children}
                {!isAutoHeight && <div style={{ height: '30px' }}></div>}
            </div>

            {/* Fade réteg – csak fix magasságú kártyáknál */}
            {!isAutoHeight && (
                <div style={{
                    position: 'absolute',
                    bottom: 0, left: 0,
                    width: '100%', height: '50px',
                    background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 100%)',
                    pointerEvents: 'none',
                    borderRadius: '0 0 25px 25px',
                    zIndex: 10
                }} />
            )}
        </div>
    );
}