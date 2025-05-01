import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTemplateNodes } from '../../../components/TemplateHandler';

function NewNetwork() {
  const [networkName, setNetworkName] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const templates = [
    { name: 'Trafikkulykke', value: 'trafikkulykke' },
    { name: 'Brann', value: 'brann' },
    { name: 'Flom', value: 'flom' }
  ];
  

  const handleCreate = async () => {
    if (!networkName.trim()) {
      setErrorMessage('Skriv inn et gyldig navn.');
      return;
    }

    const newNetwork = {
      name: networkName,
        template: selectedTemplate,
      isArchived: false,
    };

    try {
      const response = await fetch('https://localhost:5255/api/NetworkBuilder/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newNetwork),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Created network:", data);
        navigate(`/sn/${data.id}`);
      } else {
        setErrorMessage('Feil ved oppretting.');
      }
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage('En feil oppstod. Prøv igjen.');
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Opprett nytt nettverk</h2>
      <input
        type="text"
        placeholder="Nettverksnavn"
        value={networkName}
        onChange={(e) => setNetworkName(e.target.value)}
        style={{ padding: '0.5rem', width: '300px', marginBottom: '1rem' }}
      />
      <br />

      <select
        value={selectedTemplate}
        onChange={(e) => setSelectedTemplate(e.target.value)}
        style={{ padding: '0.5rem', width: '320px', marginBottom: '1rem' }}
      >
        <option value="">Velg en mal (valgfritt)</option>
        {templates.map((template) => (
          <option key={template.value} value={template.value}>
            {template.name}
          </option>
        ))}
      </select>

      {errorMessage && (
        <div style={{ color: 'red', marginBottom: '1rem' }}>
          <strong>{errorMessage}</strong>
        </div>
      )}

      <br />
      <button onClick={handleCreate}>Opprett nettverk</button>
    </div>
  );
}

export default NewNetwork;
