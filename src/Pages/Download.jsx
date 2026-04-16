import Card from "../components/Card";
import PageWrapper from "../components/PageWrapper";

export default function Download() {
    return (
        <PageWrapper>
            <div className="container-fluid d-flex flex-grow-1 justify-content-center align-items-center"
                style={{ padding: '20px', minHeight: '80vh' }}>
                <Card title="DOWNLOAD">
                    <div className="d-flex flex-column h-100 text-center">
                        <div className="mb-4">
                            <p style={{ fontSize: '1.1rem', opacity: 0.8 }}>
                                Midnight Racers is currently in early release, but we're excited to finally share it with you.
                                If you run into any bugs or issues, feel free to let us know and help us improve the game.
                            </p>
                        </div>
                        <div className="mt-auto pb-3">
                            <a
                                href="https://drive.google.com/uc?export=download&id=1L0eZibExeAbCgHK7ypPROTz3RcMWIKdD"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-outline-light px-5 py-2 fw-bold"
                                style={{ borderRadius: '10px', letterSpacing: '2px', textDecoration: 'none' }}
                            >
                                DOWNLOAD HERE
                            </a>
                        </div>
                    </div>
                </Card>
            </div>
        </PageWrapper>
    );
}
