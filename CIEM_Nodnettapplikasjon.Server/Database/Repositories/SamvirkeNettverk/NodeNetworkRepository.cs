using CIEM_Nodnettapplikasjon.Server.Database.Models.NodeNetworks;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace CIEM_Nodnettapplikasjon.Server.Database.Repositories.NodeNetworks
{
    public class NodeNetworksRepository : INodeNetworkRepository
    {
        private readonly ApplicationDbContext _context;

        public NodeNetworksRepository(ApplicationDbContext context) 
        {
            _context = context;
        }

        // Get all nodenetworks
        public async Task<IEnumerable<NodeNetworksModel>> GetAllNodeNetworks() {

            return await _context.NodeNetworks.ToListAsync();

        }

        // Grab a specific nodenetwork, and only the nodes witch matches the foreign key of Nodes
        public async Task<NodeNetworksModel> GetNodeNetworkByID(int id)
        {
            return await _context.NodeNetworks
                .Where(n => n.networkID == id) 
                .Include(n => n.Nodes) 
                .FirstOrDefaultAsync();
        }


        // Create a new nodenetwork
        public async Task<NodeNetworksModel> CreateNodeNetwork(NodeNetworksModel newNodeNetwork) {

            _context.NodeNetworks.Add(newNodeNetwork);
            await _context.SaveChangesAsync();
            return newNodeNetwork;
        }

        // Delete a nodenetwork
        public async Task DeleteNodeNetwork(int id) {

            var nodeNetwork = await _context.NodeNetworks.FindAsync(id);
            if (nodeNetwork != null)
            {
                _context.NodeNetworks.Remove(nodeNetwork);
                await _context.SaveChangesAsync();
            }
        }
    }
}