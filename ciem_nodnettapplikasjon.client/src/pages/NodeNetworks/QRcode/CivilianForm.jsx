import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import styles from './CivilianForm.module.css';
import logo from '../../../assets/EMKORE.png';

function CivilianForm() {
  const [searchParams] = useSearchParams();
  const parentId = searchParams.get('parentId');
  const token = searchParams.get('token');
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    beskrivelse: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();

    const payload = {
      name: formData.name,
      phone: formData.phone,
      beskrivelse: formData.beskrivelse,
      parentId: parseInt(parentId),
      token: token,
    };

    try {
      const res = await fetch('https://ciem-nodnettapplikasjon.onrender.com/api/qr/add-node', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const result = await res.json();
        setSubmitted(true);
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
  }, [formData, parentId, token, navigate]);

  useEffect(() => {
    if (!parentId || !token) {
      console.error('Missing QR parameters');
    }
  }, [parentId, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
      <nav className={styles.navbar}>
        <img src={logo} alt="Logo" />
        <div className="date-time">
          <p>{new Date().toLocaleDateString()}</p>
          <p>{new Date().toLocaleTimeString()}</p>
        </div>
      </nav>

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
          />
          <button type="submit">Koble til Nettverk</button>
        </form>
      </div>
    </div>
  );
}

export default CivilianForm;
