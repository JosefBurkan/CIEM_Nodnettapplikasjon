using CIEM_Nodnettapplikasjon.Server.Database.Models.NodeNetworks;
using CIEM_Nodnettapplikasjon.Server.Database.Models.Archive;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace CIEM_Nodnettapplikasjon.Server.Database.Repositories.NodeNetworks
{
    public interface INodeNetworkRepository
    {
        Task<IEnumerable<NodeNetworksModel>> GetAllNodeNetworks();
        Task<NodeNetworksModel> GetNodeNetworkByID(int id);
        Task<NodeNetworksModel> CreateNodeNetwork(NodeNetworksModel newNodeNetwork);
        Task DeleteNodeNetwork(int id);
        Task<IEnumerable<ArchivedNetworksModel>> GetAllArchivedNetworks();
        Task<bool> ArchiveNetwork(int id);


    }
}
