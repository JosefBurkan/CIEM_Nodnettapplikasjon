using System.ComponentModel.DataAnnotations;
using CIEM_Nodnettapplikasjon.Server.Database.Models.NodeNetworks;
using CIEM_Nodnettapplikasjon.Server.Database.Models.Nodes;

namespace CIEM_Nodnettapplikasjon.Server.Database.Models.NodeNetworks
{
    // Model for the table "NodeNetworks"
    public class NodeNetworksModel
    {
        [Key] // Set NetworkID to PK
        public int networkID { get; set; }

        public string name { get; set; } = string.Empty;

        public DateTimeOffset time_of_creation {get; set;}

        // Decides whether the network is active or not
        public bool IsArchived { get; set; } 

        // Connects the class to the Nodes table
        public List<NodesModel> Nodes { get; set; } = new();



    }
}
