using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Identity;
using CIEM_Nodnettapplikasjon.Server.Database.Models.NodeNetworks;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace CIEM_Nodnettapplikasjon.Server.Database.Models.Nodes
{
    public class NodesModel
    {
        [Key] // Set NodeID to PK
        public int nodeID { get; set; }
        public string name { get; set; }
        public int childID {get; set; }
        public int parentID {get; set; }

        // NetworkID is FK for NodesModel
        [ForeignKey("NodeNetwork")]
        public int networkID {get; set; }



        // Allows NodeNetworkModel to access whole NodeModel, instead of just NetworkID
        [JsonIgnore] // Prevents an infinite loop by not sending NodeNetwork data on API calls
        public NodeNetworksModel NodeNetwork { get; set; }
    }
}
