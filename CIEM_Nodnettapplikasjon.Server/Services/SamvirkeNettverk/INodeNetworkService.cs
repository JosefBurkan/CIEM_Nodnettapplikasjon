using System.Threading.Tasks;
using CIEM_Nodnettapplikasjon.Server.Database.Models.NodeNetworks;
using System.Linq;
using Microsoft.EntityFrameworkCore;


namespace CIEM_Nodnettapplikasjon.Server.Services.NodeNetworks
{
    public interface INodeNetworksService
    {
        // Create a network
        Task<NodeNetworksModel> CreateNetworkAsync(string name);

        // Retrieve all networks
        Task<IEnumerable<NodeNetworksModel>> RetrieveAllNetworksAsync(); 

        // Get a specific network by ID
        Task<NodeNetworksModel> GetNetworkByIdAsync(int id);

        // Delete a selected network by ID
        Task<NodeNetworksModel> DeleteNetworkAsync(int id);
    }
}
