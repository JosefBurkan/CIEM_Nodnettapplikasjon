import React, { useState } from 'react';
import {
  useSearchParams,
  useNavigate,
  Link,
  useLocation,
} from 'react-router-dom';
import styles from './QRAccessPage.module.css';
import logo from '../../../assets/EMKORE.png';

function QRAccessPage() {
  // Get QR parameters from the URL
  const [searchParams] = useSearchParams();
  const parentId = searchParams.get('parentId');
  const token = searchParams.get('token');

  // Initialize useNavigate for programmatic redirect
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    beskrivelse: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      name: formData.name,
      phone: formData.phone,
      beskrivelse: formData.beskrivelse,
      parentId: parseInt(parentId),
      token: token,
    };

    try {
      const res = await fetch('https://localhost:5255/api/qr/add-node', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const result = await res.json();
        // Redirect to SivilSide and pass form data via state
        navigate('/civilianPage', {
          state: {
            name: formData.name,
            beskrivelse: formData.beskrivelse,
            phone: formData.phone,
          },
        });
      } else {
        const errorData = await res.json();
        console.error('Failed to add node:', errorData);
        alert('Noe gikk galt. Prøv igjen.');
      }
    } catch (err) {
      console.error('Error sending request:', err);
      alert('Kunne ikke koble til serveren.');
    }
  };

  if (!parentId || !token) {
    return (
      <div className={styles.error}>
        Mangler nødvendig QR-informasjon.
      </div>
    );
  }

  if (submitted) {
    return (
      <div className={styles.success}>
        <h2>Takk! Du er nå koblet til nettverket.</h2>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Navbar */}
      <nav className={styles.navbar}>
        <img src={logo} alt="Logo" />
        <div className="date-time">
          <p>{new Date().toLocaleDateString()}</p>
          <p>{new Date().toLocaleTimeString()}</p>
        </div>
      </nav>

      {/* Form */}
      <div className={styles.formContainer}>
        <h2>Bli med i nettverket</h2>
        <p>Fyll inn nødvendig informasjon for å få tilgang til nettverket.</p>
        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            name="name"
            type="text"
            placeholder="Navn"
            required
            onChange={handleChange}
          />
          <input
            name="phone"
            type="text"
            placeholder="Telefonnummer"
            required
            onChange={handleChange}
          />
          <textarea
            name="beskrivelse"
            placeholder="Gi en beskrivelse av din rolle i hendelsen"
            required
            onChange={handleChange}
            rows="4"
            style={{
              padding: '0.8rem',
              fontSize: '1rem',
              border: 'none',
              borderRadius: '10px',
              backgroundColor: '#444',
              color: 'white',
              outline: 'none',
              width: '100%',
            }}
          />
          <button type="submit">Koble til Nettverk</button>
        </form>
      </div>
    </div>
  );
}

export default QRAccessPage;
