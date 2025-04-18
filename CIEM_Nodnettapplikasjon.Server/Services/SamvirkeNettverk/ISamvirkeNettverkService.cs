using System.Threading.Tasks;
using CIEM_Nodnettapplikasjon.Server.Database.Models.NodeNetworks;

namespace CIEM_Nodnettapplikasjon.Server.Services.SamvirkeNettverk
{
    public interface ISamvirkeNettverkService
    {
        Task<NodeNetworksModel> CreateNetworkAsync(NodeNetworksModel newNetwork);
        Task<NodeNetworksModel> GetNetworkByIdAsync(int id);
    }
}
