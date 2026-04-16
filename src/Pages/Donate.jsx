import Card from "../components/Card";
import PageWrapper from "../components/PageWrapper";

const tiers = [
    {
        title: "⚙️ SUPPORTER",
        price: "$3 / mo",
        amount: 3,
        color: "#8898f0",
        perks: ["Your name in credits", "Supporter badge", "Access to dev logs"]
    },
    {
        title: "🏎️ RACER",
        price: "$10 / mo",
        amount: 10,
        color: "#f0c040",
        perks: ["Everything in Supporter", "Early access to updates", "Exclusive in-game skin", "Discord role"]
    },
    {
        title: "🏆 LEGEND",
        price: "$25 / mo",
        amount: 25,
        color: "#f07060",
        perks: ["Everything in Racer", "Vote on new features", "Your name in the game", "1-on-1 dev chat"]
    }
];

export default function Donate() {
    return (
        <PageWrapper>
            <div style={{
                paddingTop: '130px', paddingBottom: '50px',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px'
            }}>
                <h1 style={{
                    fontFamily: "'Orbitron', sans-serif", fontWeight: 900,
                    letterSpacing: '4px', color: 'white', fontSize: '2.5rem',
                    textAlign: 'center', marginBottom: '10px'
                }}>SUPPORT THE GAME</h1>
                <p style={{
                    color: 'rgba(255,255,255,0.6)', letterSpacing: '1px',
                    marginBottom: '30px', textAlign: 'center',
                    padding: '0 24px', maxWidth: '460px'
                }}>
                    Every contribution helps us keep the servers running and the game growing.
                </p>
                <div style={{
                    display: 'flex', flexWrap: 'wrap',
                    justifyContent: 'center', gap: '30px', padding: '0 20px',
                    alignItems: 'stretch'
                }}>
                    {tiers.map((tier) => (
                        <Card key={tier.title} title={tier.title} width="280px" height="auto">
                            <div className="text-center px-3 pb-3" style={{
                                display: 'flex', flexDirection: 'column', height: '100%'
                            }}>
                                <div style={{
                                    fontSize: '2rem', fontWeight: 'bold',
                                    color: tier.color, marginBottom: '16px'
                                }}>
                                    {tier.price}
                                </div>
                                <ul style={{ listStyle: 'none', padding: 0, marginBottom: '20px', flex: 1 }}>
                                    {tier.perks.map((perk) => (
                                        <li key={perk} style={{
                                            padding: '6px 0',
                                            borderBottom: '1px solid rgba(255,255,255,0.08)',
                                            fontSize: '0.9rem', color: 'rgba(255,255,255,0.85)'
                                        }}>
                                            ✓ {perk}
                                        </li>
                                    ))}
                                </ul>
                                <a
                                    href={`https://www.paypal.com/donate?business=teofilpap6@gmail.com&currency_code=USD&item_name=Midnight+Racers&amount=${tier.amount}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn w-100 fw-bold"
                                    style={{
                                        borderRadius: '10px', letterSpacing: '1px',
                                        backgroundColor: tier.color, border: 'none',
                                        color: 'black', padding: '10px',
                                        textDecoration: 'none', display: 'block'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
                                    onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                                >
                                    DONATE
                                </a>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </PageWrapper>
    );
}
