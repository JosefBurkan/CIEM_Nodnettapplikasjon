using System;
using System.Threading.Tasks;
using CIEM_Nodnettapplikasjon.Server.Database.Models.NodeNetworks;
using CIEM_Nodnettapplikasjon.Server.Database.Repositories.NodeNetworks;

namespace CIEM_Nodnettapplikasjon.Server.Services.SamvirkeNettverk
{
    public class SamvirkeNettverkService : ISamvirkeNettverkService
    {
        private readonly INodeNetworkRepository _nodeNetworkRepository;

        public SamvirkeNettverkService(INodeNetworkRepository nodeNetworkRepository)
        {
            _nodeNetworkRepository = nodeNetworkRepository;
        }

        public async Task<NodeNetworksModel> CreateNetworkAsync(NodeNetworksModel newNetwork)
        {
            newNetwork.time_of_creation = DateTimeOffset.UtcNow;

            return await _nodeNetworkRepository.CreateNodeNetwork(newNetwork);
        }

        public async Task<NodeNetworksModel> GetNetworkByIdAsync(int id)
        {
            return await _nodeNetworkRepository.GetNodeNetworkByID(id);
        }
    }
}
