using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Identity;
using CIEM_Nodnettapplikasjon.Server.Database.Models.Nodes;



namespace CIEM_Nodnettapplikasjon.Server.Database.Models.NodeNetworks
{
    public class NodeNetworksModel
    {
        [Key] // Set NetworkID to PK
        public int networkID { get; set; }

        public string name { get; set; } = string.Empty;

        public DateTimeOffset time_of_creation {get; set;}

        public string Status { get; set; } = "Live";

        // Connects the class to the Nodes table
        public List<NodesModel> Nodes { get; set; } = new();

        public bool IsArchived { get; set; } = false;


    }
}
