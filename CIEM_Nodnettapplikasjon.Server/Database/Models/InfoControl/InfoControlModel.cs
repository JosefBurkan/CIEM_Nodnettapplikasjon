using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Identity;

namespace CIEM_Nodnettapplikasjon.Server.Database.Models.InfoPanel 
{
    public class InfoPanelModel
    {
        [Key] // Declare primary key
        public int id { get; set; }

        public string eventName {get; set; }
        public string exactPosition { get; set; }
        public string level { get; set; }
        public int injured {get; set; }
        public int evacuated {get; set; }
        public int remaining {get; set; }
        public int missing {get; set; }
        public int areaLevel {get; set; }
        public int structure {get; set; }
        public int escalation {get; set; }
        public int vehicles {get; set; }
        public int drones {get; set; }
        public int searchDogs {get; set; }
        public int deceased {get; set; }
        public int? uninjured {get; set; }
        public int? unknownStatus {get; set; }
        public string? eventDescription {get; set; }
    
    }

}