using CIEM_Nodnettapplikasjon.Server.Database.Models.NodeNetworks;
using CIEM_Nodnettapplikasjon.Server.Database.Models.Nodes;
using System.Threading.Tasks;

namespace CIEM_Nodnettapplikasjon.Server.Database.Repositories.NodeNetworks
{
    public interface IQRRepository
    {
        // Adds a node to the network using QR token validation
        Task<NodesModel?> AddNodeViaQRAsync(QRNodeDto dto);

    }
}
