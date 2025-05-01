using CIEM_Nodnettapplikasjon.Server.Database.Models.NodeNetworks;
using CIEM_Nodnettapplikasjon.Server.Database.Models.Nodes;
using System.Threading.Tasks;

namespace CIEM_Nodnettapplikasjon.Server.Database.Repositories.NodeNetworks
{
    // INodeRepository defines the contract for node-related operations 
    public interface INodeRepository
    {
        // Adds a new node to the network
        Task<NodesModel> AddNodeAsync(NodeDto dto);

        // Retrieves a node by the associated user ID
        Task<NodesModel?> GetNodeByUserIdAsync(int userId);

        // Removes a node from the network by its ID
        Task<bool> RemoveNodeByIdAsync(int nodeId);

        // Saves the connection between two nodes in the network
        Task<NodesModel> SaveNodeConnection(int selectedNodeID, int connectionIDs);
    }
}
