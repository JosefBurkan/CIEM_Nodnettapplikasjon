using System;
using System.Threading.Tasks;
using CIEM_Nodnettapplikasjon.Server.Database.Models.NodeNetworks;
using CIEM_Nodnettapplikasjon.Server.Database.Repositories.KHN;


namespace CIEM_Nodnettapplikasjon.Server.Services.KHN
{

    public class NetworkBuilderService : INetworkBuilderService
    {
        private readonly INetworkBuilderRepository _repository;

        public NetworkBuilderService(INetworkBuilderRepository repository)
        {
            _repository = repository;
        }

        public async Task<int> CreateNetworkAsync(string name)
        {
            var network = new NodeNetworksModel
            {
                name = name,
                time_of_creation = DateTimeOffset.UtcNow
            };

            await _repository.InsertAsync(network);
            return network.networkID;
        }

        public async Task<bool> DeleteNetworkAsync(int networkId)
        {
            return await _repository.DeleteNetworkAsync(networkId);
        }

    }
}