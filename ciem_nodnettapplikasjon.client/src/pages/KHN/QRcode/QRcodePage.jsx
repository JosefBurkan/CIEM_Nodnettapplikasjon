import React from "react";
// import QRCode from "qrcode.react";

function QRcodePage() {
    const storedUser = localStorage.getItem("user");
    const user = storedUser ? JSON.parse(storedUser) : null;
    const qrToken = user?.qr_token; 

    if (!qrToken) {
        return <p>QR-token ikke tilgjengelig.</p>;
    }

    const qrCodeLink = `https://localhost:5173/qr-access?token=${qrToken}`;

    return (
        <div style={{ textAlign: "center", marginTop: "4rem" }}>
            <h2>QR-kode for midlertidig tilgang</h2>
            <p>Vis denne QR-koden til personer som skal kobles til nettverket.</p>
            <div style={{ background: "white", padding: "16px", display: "inline-block" }}>
                <QRCode value={qrCodeLink} size={256} />
            </div>
            <p style={{ marginTop: "1rem" }}>{qrCodeLink}</p>
        </div>
    );
}

export default QRcodePage;
