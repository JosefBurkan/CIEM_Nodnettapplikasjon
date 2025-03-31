using System.Threading.Tasks;
using CIEM_Nodnettapplikasjon.Server.Database.Models.NodeNetworks;

namespace CIEM_Nodnettapplikasjon.Server.Database.Repositories.KHN
{
    public interface INetworkBuilderRepository
    {
        Task InsertAsync(NodeNetworksModel network);

        Task<bool> DeleteNetworkAsync(int networkId);

    }
}