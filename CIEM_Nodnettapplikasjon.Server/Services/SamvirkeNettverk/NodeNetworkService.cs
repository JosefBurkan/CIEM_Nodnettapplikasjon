using System.Threading.Tasks;
using CIEM_Nodnettapplikasjon.Server.Database.Models.NodeNetworks;
using CIEM_Nodnettapplikasjon.Server.Database.Repositories.NodeNetworks;
using System.Linq;
using Microsoft.EntityFrameworkCore;


namespace CIEM_Nodnettapplikasjon.Server.Services.NodeNetworks
{
    // Is responsible for processing data related to nodenetworks.
    public class NodeNetworksService : INodeNetworksService
    {
        private readonly INodeNetworkRepository _nodeNetworkRepository;

        // Set _nodeNetworkRepository
        public NodeNetworksService(INodeNetworkRepository nodeNetworkRepository)
        {
            _nodeNetworkRepository = nodeNetworkRepository;
        }

        // Creates a network. Calls from the repository
        public async Task<NodeNetworksModel> CreateNetworkAsync(string name)
        {
            var network = new NodeNetworksModel
            {
                name = name,
                time_of_creation = DateTimeOffset.UtcNow
            };

            return await _nodeNetworkRepository.CreateNodeNetwork(network);
        }

        // Retrieves all networks from database. Calls from the repository
        public async Task<IEnumerable<NodeNetworksModel>> RetrieveAllNetworksAsync() 
        {
            return await _nodeNetworkRepository.GetAllNodeNetworks();
        }

        // Deletes a network. Calls from the repository
        public async Task<NodeNetworksModel> GetNetworkByIdAsync(int id)
        {
            return await _nodeNetworkRepository.GetNodeNetworkByID(id);
        }

        // Deletes a selected network
        public async Task<NodeNetworksModel> DeleteNetworkAsync(int id) 
        {

            return await _nodeNetworkRepository.DeleteNodeNetwork(id);
        }
    }
}
