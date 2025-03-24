using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Identity;

namespace CIEM_Nodnettapplikasjon.Server.Database.Models.Nodes
{
    public class NodesModel
    {
        [Key] // Set NodeID to PK
        public int NodeID { get; set; }
        public string Name { get; set; }
        public int NetworkID {get; set; }
    }
}
