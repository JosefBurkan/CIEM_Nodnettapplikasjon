using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Identity;

namespace CIEM_Nodnettapplikasjon.Server.Database.Models.InfoControl 
{
    public class InfoControlModel
    {
        [Key] // Declare primary key
        public int id { get; set; }

        public string eventName {get; set; }
        public string exactPosition { get; set; }
        public string level { get; set; }
        public int patients {get; set; }
        public int evacuated {get; set; }
        public int areaLevel {get; set; }
        public int structure {get; set; }
        public int escalation {get; set; }
        public int searchDogs {get; set; }
        public int missing {get; set; }
        public int remaining {get; set; }
        public int vehicles {get; set; }
        public int drones {get; set; }
    
    }

}