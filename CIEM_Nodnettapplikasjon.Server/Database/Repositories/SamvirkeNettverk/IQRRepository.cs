using CIEM_Nodnettapplikasjon.Server.Database.Models.SamvirkeNettverk;
using CIEM_Nodnettapplikasjon.Server.Database.Models.Nodes;
using System.Threading.Tasks;

namespace CIEM_Nodnettapplikasjon.Server.Database.Repositories.SamvirkeNettverk
{
    public interface IQRRepository
    {
        // Adds a node to the network using QR token validation
        Task<NodesModel?> AddNodeViaQRAsync(QRNodeDto dto);
    }
}
