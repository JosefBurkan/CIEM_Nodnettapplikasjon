using CIEM_Nodnettapplikasjon.Server.Database.Models.SamvirkeNettverk;
using CIEM_Nodnettapplikasjon.Server.Database.Models.Nodes;
using System.Threading.Tasks;

namespace CIEM_Nodnettapplikasjon.Server.Database.Repositories.SamvirkeNettverk
{
    public interface INodeRepository
    {
        // Adds a new node to the network
        Task<NodesModel> AddNodeAsync(NodeDto dto);

        Task<NodesModel?> GetNodeByUserIdAsync(int userId);

        Task<bool> RemoveNodeByIdAsync(int nodeId);

        Task<NodesModel> SaveNodeConnection(int selectedNodeID, int connectionIDs);
    }
}
