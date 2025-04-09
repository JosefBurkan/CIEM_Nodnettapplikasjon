using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Identity;
using CIEM_Nodnettapplikasjon.Server.Database.Models.NodeNetworks;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using CIEM_Nodnettapplikasjon.Server.Database.Models.Users;

namespace CIEM_Nodnettapplikasjon.Server.Database.Models.Nodes
{
    public class NodesModel
    {
        [Key] // Set NodeID to PK
        public int nodeID { get; set; }

        public string name { get; set; }
        public int parentID {get; set; }
        public string? phone { get; set; }
        public string? beskrivelse { get; set; }
        public string? type { get; set; }
        public string? hierarchy_level { get; set; }
        public string? category { get; set; }

        // NetworkID is FK for NodesModel
        [ForeignKey("NodeNetwork")]
        public int networkID {get; set; }

        // Allows NodeNetworkModel to access whole NodeModel, instead of just NetworkID
        [JsonIgnore] // Prevents an infinite loop by not sending NodeNetwork data on API calls
        public NodeNetworksModel NodeNetwork { get; set; }

        [ForeignKey("User")]
        public int? UserID { get; set; }

        [JsonIgnore]
        public UserModel? User { get; set; }

      
    }
}
