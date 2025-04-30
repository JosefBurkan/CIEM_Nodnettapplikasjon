using System.Threading.Tasks;
using CIEM_Nodnettapplikasjon.Server.Database.Models.NodeNetworks;

namespace CIEM_Nodnettapplikasjon.Server.Database.Repositories.NodeNetworks
{
    public interface INetworkBuilderRepository
    {
        // Inserts a new network into the database
        Task InsertAsync(NodeNetworksModel network);

        // Deletes a network from the database by its ID
        Task<bool> DeleteNetworkAsync(int networkId);
    }
}