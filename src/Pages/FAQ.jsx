import { useState } from "react";
import Card from "../components/Card";
import PageWrapper from "../components/PageWrapper";

const faqs = [
    { q: "What is Midnight Racers?", a: "Midnight Racers is an indie racing game currently in early development. It features night-time street racing with a focus on atmosphere and speed." },
    { q: "Is the game free to play?", a: "Yes! The game is completely free to download and play. We accept donations to help fund further development." },
    { q: "What platforms are supported?", a: "Currently only Windows is supported. Mac and Linux support are planned for future updates." },
    { q: "How do I report a bug?", a: "You can report bugs through our Discord server or by opening an issue on our GitHub page. We appreciate every report!" },
    { q: "How often are updates released?", a: "We aim to release updates every few weeks. You can follow the Updates page to stay informed about new releases." },
    { q: "Can I contribute to the game?", a: "Absolutely! We welcome contributors. Reach out to us via Discord and we'll guide you through the process." },
];

export default function FAQ() {
    const [openIndex, setOpenIndex] = useState(null);
    const toggle = (i) => setOpenIndex(openIndex === i ? null : i);

    return (
        <PageWrapper>
            <div style={{
                paddingTop: '130px', paddingBottom: '50px',
                display: 'flex', flexDirection: 'column', alignItems: 'center'
            }}>
                <h1 style={{
                    fontFamily: "'Orbitron', sans-serif", fontWeight: 900,
                    letterSpacing: '4px', color: 'white', fontSize: '2.5rem',
                    textAlign: 'center', marginBottom: '40px'
                }}>FAQ</h1>

                <Card title="FREQUENTLY ASKED" width="750px" height="auto">
                    <div className="px-4 py-3">
                        {faqs.map((item, i) => (
                            <div key={i} style={{
                                borderBottom: '1px solid rgba(255,255,255,0.1)',
                                marginBottom: '4px'
                            }}>
                                <div onClick={() => toggle(i)} style={{
                                    cursor: 'pointer', padding: '14px 4px',
                                    display: 'flex', justifyContent: 'space-between',
                                    alignItems: 'center', userSelect: 'none'
                                }}>
                                    <span style={{ fontWeight: 'bold', letterSpacing: '1px', fontSize: '0.95rem' }}>
                                        {item.q}
                                    </span>
                                    <span style={{
                                        fontSize: '1.2rem', transition: 'transform 0.3s',
                                        transform: openIndex === i ? 'rotate(45deg)' : 'rotate(0deg)',
                                        display: 'inline-block'
                                    }}>+</span>
                                </div>
                                <div style={{
                                    maxHeight: openIndex === i ? '200px' : '0px',
                                    overflow: 'hidden', transition: 'max-height 0.35s ease',
                                }}>
                                    <p style={{
                                        padding: '0 4px 14px', margin: 0,
                                        color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', lineHeight: '1.6'
                                    }}>
                                        {item.a}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </PageWrapper>
    );
}
