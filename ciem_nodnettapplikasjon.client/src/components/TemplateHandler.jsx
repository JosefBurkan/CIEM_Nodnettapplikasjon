// TemplateHandler.js

export function guessTemplateFromName(name) {
    if (!name) return null;
    
    const loweredName = name.toLowerCase();
  
    if (loweredName.includes("trafikk") || loweredName.includes("ulykke")) return "trafikkulykke";
    if (loweredName.includes("flom") || loweredName.includes("oversvømmelse") || loweredName.includes("vann")) return "flom";
    if (loweredName.includes("brann") || loweredName.includes("skogbrann")) return "brann";
  
    return null;
  }
  
  export function getTemplateNodes(templateName) {
    switch (templateName) {
      case "trafikkulykke":
        return [
          { id: '1', data: { label: 'Politi' } },
          { id: '2', data: { label: 'Ambulanse' } },
          { id: '3', data: { label: 'Brannvesen' } },
          { id: '4', data: { label: 'Redningssentral' } },
          { id: '5', data: { label: 'Sykehus' } },
          { id: '6', data: { label: 'Vegvesen' } },
        ];
      case "flom":
        return [
          { id: '1', data: { label: 'Redningstjeneste' } },
          { id: '2', data: { label: 'Forsvaret' } },
          { id: '3', data: { label: 'Sivilforsvaret' } },
          { id: '4', data: { label: 'Kommunal beredskap' } },
          { id: '5', data: { label: 'NVE (Vassdrags- og energidirektoratet)' } },
          { id: '6', data: { label: 'Meteorologisk Institutt' } },
        ];
      case "brann":
        return [
          { id: '1', data: { label: 'Brannvesen' } },
          { id: '2', data: { label: 'Politi' } },
          { id: '3', data: { label: 'Helsepersonell' } },
          { id: '4', data: { label: 'Kriseledelse' } },
          { id: '5', data: { label: 'Skogmyndigheter' } },
          { id: '6', data: { label: 'Frivillige organisasjoner' } },
        ];
      default:
        return [];
    }
  }
  