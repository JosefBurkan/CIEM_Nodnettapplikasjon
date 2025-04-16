using System.Threading.Tasks;
using CIEM_Nodnettapplikasjon.Server.Database.Models.NodeNetworks;

namespace CIEM_Nodnettapplikasjon.Server.Database.Repositories.SamvirkeNettverk
{
    public interface INetworkBuilderRepository
    {
        Task InsertAsync(NodeNetworksModel network);

        Task<bool> DeleteNetworkAsync(int networkId);
    }
}