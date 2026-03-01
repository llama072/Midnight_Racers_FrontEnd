export default function Card({ title, children, width = '400px', height = '450px' }) {
    return (
        <div 
            className="card text-white border-white border-opacity-10 shadow-lg"
            style={{
                // Az üveg hatást és a pontos méretet még meg kell hagyni inline, 
                // mert a Bootstrapnek nincs alapból "blur" osztálya
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(15px)',
                WebkitBackdropFilter: 'blur(15px)',
                width: `clamp(300px, 90vw, ${width})`,
                height: height,
                borderRadius: '25px',
            }}
        >
            {/* Kártya fejléce */}
            <div className="card-header border-bottom border-white border-opacity-10 bg-transparent py-3">
                <h2 className="text-center m-0 fw-bold ls-widest uppercase" 
                    style={{ fontSize: '1.8rem', letterSpacing: '3px' }}>
                    {title}
                </h2>
            </div>

            {/* Kártya tartalma */}
            <div className="card-body p-4 d-flex flex-column">
                {children}
            </div>
        </div>
    );
}