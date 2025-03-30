using System.Threading.Tasks;

namespace CIEM_Nodnettapplikasjon.Server.Services.KHN
{
    public interface INetworkBuilderService
    {
        Task<int> CreateNetworkAsync(string name);

        Task<bool> DeleteNetworkAsync(int networkId);

    }
}