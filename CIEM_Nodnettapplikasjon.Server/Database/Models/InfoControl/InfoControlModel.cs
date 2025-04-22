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
        public string security { get; set; }
        public string patients {get; set; }
        public string evacuation {get; set; }
    }

}