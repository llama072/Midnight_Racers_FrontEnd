import { useState } from "react";
import BackGround from "../assets/Background.png";
import Navbar from "../components/Navbar";
import Card from "../components/Card";
import 'bootstrap/dist/css/bootstrap.min.css'


export default function Download() {
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
            {/* Sötétítő réteg marad */}
            <div style={{
                position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1
            }} />

            {/* A fő tartalom rétege */}
            <div style={{
                position: 'relative',
                zIndex: 2,
                height: '100vh',
                width: '100vw',
                overflowY: 'auto', // Itt engedjük a függőleges görgetést
                display: 'flex',
                flexDirection: 'column'
            }}>
                <Navbar />

                <div className="container-fluid d-flex flex-grow-1 justify-content-center align-items-center"
                    style={{
                        padding: '20px',
                        minHeight: '80vh' // Biztosítja a függőleges középre igazítást
                    }}>

                    <Card title="DOWNLOAD">
                        <div className="d-flex flex-column h-100 text-center">
                            {/* Felső tartalom */}
                            <div className="mb-4">
                                <p style={{ fontSize: '1.1rem', opacity: 0.8 }}>
                                    Midnight Racers SUPER BETA ALPHA EARLY RELASE 0.000001
                                </p>
                            </div>

                            {/* Ez a div és a gomb az aljára kerül */}
                            <div className="mt-auto pb-3">
                                <button className="btn btn-outline-light px-5 py-2 fw-bold"
                                    style={{ borderRadius: '10px', letterSpacing: '2px' }}>
                                    DOWNLOAD HERE
                                </button>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>


        </div>
    );
}