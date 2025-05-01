import React, { useState, useEffect, useCallback } from 'react';
import QRCode from 'react-qr-code';

// Main QRcodePage component to display a QR code for temporary access
function QRcodePage() {
    const storedUser = localStorage.getItem('user'); // Retrieves the user from localStorage
    const user = storedUser ? JSON.parse(storedUser) : null; // Parses the user data
    const qrToken = user?.qr_token; // Extracts the QR token from the user data
    const userId = user?.userID; // Extracts the user ID from the user data

    const [userNode, setUserNode] = useState(null); // State to store the fetched user node
    const [error, setError] = useState(''); // State to store error messages

    // Memoized function to fetch the user node data from the API
    const fetchUserNode = useCallback(async () => {
        if (!userId) {
            setError('Bruker-ID mangler.'); // Sets an error if userId is not available
            return;
        }

        try {
            const res = await fetch(`https://localhost:5255/api/nodes/user/${userId}`);
            if (!res.ok) {
                const msg = await res.text();
                throw new Error(msg || 'Feil ved henting av kode.'); // Throws an error if the response is not OK
            }
            const data = await res.json();
            setUserNode(data); // Updates the state with the fetched user node data
        } catch (err) {
            console.error('Feil ved henting av node:', err); // Logs the error
            setError('Får ikke opp tilknyttet kode til denne brukeren.'); // Sets an error message
        }
    }, []);

    // Use useEffect to call fetchUserNode only once when the component mounts or `userId` changes
    useEffect(() => {
        fetchUserNode();
    }, [fetchUserNode]); // Dependency ensures this runs only when `fetchUserNode` changes

    // If the QR token or user node is not available, display an error or loading message
    if (!qrToken || !userNode) {
        return <p>{error || 'Laster QR-kode...'}</p>;
    }

    // Constructs the QR code link
    const qrCodeLink = `https://localhost:5173/#/civilianForm?parentId=${userNode.nodeID}&token=${user.qr_token}`;

    return (
        <div style={{ textAlign: 'center', marginTop: '4rem' }}>
            <h2>QR-kode for midlertidig tilgang</h2>
            <p>Vis denne QR-koden til personer som skal kobles til nettverket.</p>
            <div
                style={{
                    background: 'white',
                    padding: '16px',
                    display: 'inline-block',
                }}
            >
                <QRCode value={qrCodeLink} size={256} /> {/* Displays the QR code */}
            </div>
            <p style={{ marginTop: '1rem' }}>{qrCodeLink}</p> {/* Displays the QR code link */}
        </div>
    );
}

export default QRcodePage;

