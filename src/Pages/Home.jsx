import { useState } from "react";
import BackGround from "../assets/Background.png";
import Navbar from "../components/Navbar";
import Card from "../components/Card";
import 'bootstrap/dist/css/bootstrap.min.css'


export default function Mouse() {
    const [offset, setOffset] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e) => {
        const x = (window.innerWidth / 2 - e.pageX) / 70;
        const y = (window.innerHeight / 2 - e.pageY) / 70;
        setOffset({ x, y });
    };

    return (
        <div onMouseMove={handleMouseMove} style={{
            height: '100vh',
            width: '100vw',
            position: 'relative',
            overflow: 'hidden',
            backgroundColor: 'black'
        }}>
            {/* Parallax Háttér */}
            <div style={{
                backgroundImage: `url(${BackGround})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                position: 'absolute',
                top: '-5%',
                left: '-5%',
                width: '110%',
                height: '110%',
                zIndex: 0,
                transform: `translate(${offset.x}px, ${offset.y}px)`
            }} />

            {/* Sötétítő réteg */}
            <div style={{
                position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1
            }} />

            {/* --- EZ A FŐ KONTÉNER, AMI GÖRDÜL --- */}
            <div className="no-scrollbar" style={{
                position: 'relative',
                zIndex: 2,
                height: '100vh',
                overflowY: 'auto',
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
            }}>
                <Navbar />

                {/* Tartalom blokk */}
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    marginTop: '15vh',
                    width: '100%',
                    flexShrink: 0
                }}>
                    <h1 className="display-1 text-white mb-5 text-center"
                        style={{
                            fontFamily: "'Orbitron', sans-serif", // Itt váltod a betűtípust
                            fontWeight: '900',
                            letterSpacing: '5px',
                            fontSize: '65px'
                        }}>
                        MIDNIGHT RACERS
                    </h1>

                    {/* A kártyák most már BENNE vannak a görgethető div-ben */}
                    <div className="card-container" style={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: '40px',
                        width: '100%',
                        padding: '0 20px'
                    }}>
                        <Card title="NEWS">
                            <p>Hamarosan érkeznek a friss hírek...</p>
                        </Card>
                        <Card title="ABOUT THE GAME">
                            <p>JAP</p>
                        </Card>
                    </div>
                </div>

                {/* Kell a hely az alján, hogy ne vágja le a kártyát görgetésnél */}
                <div style={{ height: '100px', width: '100%', flexShrink: 0 }}></div>
            </div>
        </div>
    );
}