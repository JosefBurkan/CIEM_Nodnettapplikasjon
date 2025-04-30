using CIEM_Nodnettapplikasjon.Server.Database.Models.SamvirkeNettverk;
using System.Collections.Generic;
using System.Threading.Tasks;
using CIEM_Nodnettapplikasjon.Server.Database.Repositories.SamvirkeNettverk;

namespace CIEM_Nodnettapplikasjon.Server.Database.Repositories.SamvirkeNettverk
{
    public interface INodeNetworkRepository
    {
        // Retrieves all node networks that are not archived
        Task<IEnumerable<NodeNetworksModel>> GetAllNodeNetworks();

        // Retrieves a specific node network by its ID
        Task<NodeNetworksModel> GetNodeNetworkByID(int id);

        // Creates and saves a new node network to the database
        Task<NodeNetworksModel> CreateNodeNetwork(NodeNetworksModel newNodeNetwork);

        // Deletes a node network by its ID
        Task DeleteNodeNetwork(int id);

        // Archives a network by its ID
        Task<bool> ArchiveNetwork(int id);


    }
}