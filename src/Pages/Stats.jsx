import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PageWrapper from "../components/PageWrapper";
import { toast } from "../components/Toast";
import { getMyStats, getLeaderboard, getMe } from "../../api";

export default function Stats() {
    const [myStats, setMyStats] = useState({ Score: 0 });
    const [leaderboard, setLeaderboard] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        // Auth gate: ha nincs ervenyes session, vissza Login-ra
        let cancelled = false;
        (async () => {
            const me = await getMe();
            if (cancelled) return;
            if (!me) {
                toast.warning("Be kell jelentkezned!");
                navigate("/Login");
                return;
            }
            getMyStats().then(data => { if (!cancelled && data && typeof data.Score !== 'undefined') setMyStats(data); }).catch(() => {});
            getLeaderboard().then(data => { if (!cancelled && Array.isArray(data)) setLeaderboard(data); }).catch(() => {});
        })();
        return () => { cancelled = true; };
    }, [navigate]);

    const glassStyle = {
        background: 'rgba(255,255,255,0.05)',
        backdropFilter: 'blur(15px)',
        WebkitBackdropFilter: 'blur(15px)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '25px',
    };

    return (
        <PageWrapper>
            <div style={{
                display: 'flex', justifyContent: 'center', alignItems: 'center',
                flexGrow: 1, padding: '20px', gap: '30px', flexWrap: 'wrap',
                paddingTop: '130px', paddingBottom: '50px'
            }}>

                {/* STATS KÁRTYA */}
                <div style={{ ...glassStyle, width: 'clamp(260px, 90vw, 400px)', padding: '30px' }}>
                    <h2 style={{
                        textAlign: 'center', color: 'white', fontWeight: '900',
                        letterSpacing: '4px', fontSize: '1.4rem', marginBottom: '30px',
                        fontFamily: "'Orbitron', sans-serif"
                    }}>STATS</h2>

                    {[
                        { label: 'SCORE', value: myStats.Score ?? 0, icon: '🏆' },
                    ].map((stat) => (
                        <div key={stat.label} style={{
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                            padding: '16px 20px', marginBottom: '12px',
                            background: 'rgba(255,255,255,0.05)',
                            border: '1px solid rgba(255,255,255,0.08)',
                            borderRadius: '14px'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <span style={{ fontSize: '1.2rem' }}>{stat.icon}</span>
                                <span style={{
                                    color: 'rgba(255,255,255,0.6)', fontWeight: '600',
                                    letterSpacing: '2px', fontSize: '0.85rem'
                                }}>{stat.label}</span>
                            </div>
                            <span style={{
                                color: 'white', fontWeight: '800',
                                fontSize: '1.2rem', letterSpacing: '1px'
                            }}>{stat.value}</span>
                        </div>
                    ))}
                </div>

                {/* LEADERBOARD KÁRTYA */}
                <div style={{ ...glassStyle, width: 'clamp(260px, 90vw, 480px)', padding: '30px' }}>
                    <h2 style={{
                        textAlign: 'center', color: 'white', fontWeight: '900',
                        letterSpacing: '4px', fontSize: '1.4rem', marginBottom: '30px',
                        fontFamily: "'Orbitron', sans-serif"
                    }}>LEADERBOARD</h2>

                    {leaderboard.length === 0 ? (
                        <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.4)' }}>
                            Még nincs adat.
                        </p>
                    ) : (
                        leaderboard.map((player, index) => (
                            <div key={index} style={{
                                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                padding: '14px 16px', marginBottom: '10px', gap: '12px',
                                background: index === 0 ? 'rgba(240,192,64,0.1)' : index === 1 ? 'rgba(192,192,192,0.08)' : index === 2 ? 'rgba(205,127,50,0.08)' : 'rgba(255,255,255,0.04)',
                                border: `1px solid ${index === 0 ? 'rgba(240,192,64,0.3)' : index === 1 ? 'rgba(192,192,192,0.2)' : index === 2 ? 'rgba(205,127,50,0.2)' : 'rgba(255,255,255,0.06)'}`,
                                borderRadius: '14px'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0, flex: '1 1 auto' }}>
                                    <span style={{
                                        fontSize: '1.1rem', fontWeight: '900', width: '28px', flexShrink: 0,
                                        color: index === 0 ? '#f0c040' : index === 1 ? '#c0c0c0' : index === 2 ? '#cd7f32' : 'rgba(255,255,255,0.4)'
                                    }}>
                                        {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                                    </span>
                                    <span style={{
                                        color: 'white', fontWeight: '700', fontSize: '0.95rem',
                                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                                        minWidth: 0
                                    }}>
                                        {player.User_Name}
                                    </span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexShrink: 0 }}>
                                    <span style={{
                                        color: index === 0 ? '#f0c040' : 'white',
                                        fontWeight: '800', fontSize: '1rem', whiteSpace: 'nowrap'
                                    }}>
                                        {player.Score}
                                    </span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </PageWrapper>
    );
}
