using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Identity;

namespace CIEM_Nodnettapplikasjon.Server.Database.Models.QRCode 
{
    public class QRNodeDto
    {
        [Key] // Declare primary key
        public string Name { get; set; }

        public string Phone { get; set; }
        public int ParentId { get; set; }
        public string Token { get; set; }
        public string Beskrivelse { get; set; }
    }

}