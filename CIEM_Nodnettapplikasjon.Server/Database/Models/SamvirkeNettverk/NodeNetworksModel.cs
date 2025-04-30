using System.ComponentModel.DataAnnotations;
using CIEM_Nodnettapplikasjon.Server.Database.Models.SamvirkeNettverk;

namespace CIEM_Nodnettapplikasjon.Server.Database.Models.SamvirkeNettverk
{
    public class NodeNetworksModel
    {
        [Key] // Set NetworkID to PK
        public int networkID { get; set; }

        public string name { get; set; } = string.Empty;

        public DateTimeOffset time_of_creation {get; set;}

        // Connects the class to the Nodes table
        public List<NodesModel> Nodes { get; set; } = new();

        public bool isArchived { get; set; } = false;


    }
}
