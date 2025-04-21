using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CIEM_Nodnettapplikasjon.Server.Database.Models.Archive
{
    public class ArchivedNetworksModel
    {
        [Key]
        public int ArchivedNetworkID { get; set; }

        public string name { get; set; }

        [Column("created_at")]
        public DateTimeOffset time_of_creation { get; set; }

    }
}