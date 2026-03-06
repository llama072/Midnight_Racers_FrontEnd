import { useState } from "react";
import BackGround from "../assets/Background.png";
import Navbar from "../components/Navbar";
import Card from "../components/Card";
import 'bootstrap/dist/css/bootstrap.min.css'

export default function Updates() {
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
            overflow: 'hidden', // A parallax ne lógjon ki
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

            {/* GÖRGETHETŐ RÉTEG */}
            <div style={{
                position: 'relative',
                zIndex: 2,
                height: '100vh', // Ez fogja a görgetést kezelni
                width: '100vw',
                overflowY: 'auto', 
                overflowX: 'hidden'
            }}>
                <Navbar />

                {/* Kártyák konténere */}
                <div className="container-fluid"
                    style={{
                        paddingTop: '120px', // Hely a Navbar-nak és a logónak
                        paddingBottom: '50px',
                        paddingLeft: '150px',
                        paddingRight: '150px',
                        display: 'flex',
                        flexWrap: 'wrap',
                        justifyContent: 'center',
                        gap: '40px', // Kicsit szűkebb gap, hogy több kiférjen
                        minHeight: '100%'
                    }}>

                    {/* Kártyák - Kisebb mérettel, hogy ne legyenek behemótok */}
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9,10,11,12,13].map((i) => (
                        <Card key={i} title="2026-03-05" width="300px" height="320px">
                            <div className="d-flex flex-column h-100 text-center">
                                <div className="mb-4">
                                    <p style={{ fontSize: '0.9rem', opacity: 0.8 }}>
                                        A gyász meg a szenvedés.
                                    </p>
                                </div>
                            </div>
                        </Card>
                    ))}

                </div>
            </div>
        </div>
    );
}