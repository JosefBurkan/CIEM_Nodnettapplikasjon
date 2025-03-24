using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Identity;

namespace CIEM_Nodnettapplikasjon.Server.Database.Models.NodeNetworks
{
    public class NodeNetworksModel
    {
        [Key] // Set NetworkID to PK
        public int NetworkID { get; set; }
        public string Name { get; set; }
        public DateTimeOffset DateOfCreation {get; set;}
    }
}
