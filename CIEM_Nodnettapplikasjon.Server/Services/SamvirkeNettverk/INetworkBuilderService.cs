using System.Threading.Tasks;

namespace CIEM_Nodnettapplikasjon.Server.Services.NodeNetworks
{
    public interface INetworkBuilderService
    {
        Task<int> CreateNetworkAsync(string name);
        Task<bool> DeleteNetworkAsync(int networkId);
    }
}