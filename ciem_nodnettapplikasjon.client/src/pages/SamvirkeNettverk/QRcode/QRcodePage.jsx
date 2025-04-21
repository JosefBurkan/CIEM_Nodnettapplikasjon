import React, { useEffect, useState } from 'react';
import QRCode from 'react-qr-code';

function QRcodePage() {
    const storedUser = localStorage.getItem('user');
    const user = storedUser ? JSON.parse(storedUser) : null;
    const qrToken = user?.qr_token;
    const userId = user?.userID;

    const [userNode, setUserNode] = useState(null);
    const [error, setError] = useState('');


    useEffect(() => {
        const fetchUserNode = async () => {
            try {
                const res = await fetch(
                    `https://localhost:5255/api/nodes/user/${userId}`
                );
                if (!res.ok) {
                    const msg = await res.text();
                    throw new Error(msg || 'Feil ved henting av kode.');
                }
                const data = await res.json();
                setUserNode(data);
            } catch (err) {
                console.error('Feil ved henting av node:', err);
                setError('F�r ikke opp tilknyttet kode til denne brukeren.');
            }
        };

        fetchUserNode();
    }, [userId]);

    if (!qrToken || !userNode) {
        return <p>{error || 'Laster QR-kode...'}</p>;
    }

    const qrCodeLink = `https://localhost:5173/#/qr-access?parentId=${userNode.nodeID}&token=${user.qr_token}`;

    return (
        <div style={{ textAlign: 'center', marginTop: '4rem' }}>
            <h2>QR-kode for midlertidig tilgang</h2>
            <p>
                Vis denne QR-koden til personer som skal kobles til nettverket.
            </p>
            <div
                style={{
                    background: 'white',
                    padding: '16px',
                    display: 'inline-block',
                }}
            >
                <QRCode value={qrCodeLink} size={256} />
            </div>
            <p style={{ marginTop: '1rem' }}>{qrCodeLink}</p>
        </div>
    );
}

export default QRcodePage;

