using CIEM_Nodnettapplikasjon.Server.Database.Models.NodeNetworks;
using CIEM_Nodnettapplikasjon.Server.Database.Models.Archive;
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

         return await _context.NodeNetworks
         .Where(n => !n.IsArchived)
         .ToListAsync();

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

        // Get all Archived Networks
        public async Task<IEnumerable<ArchivedNetworksModel>> GetAllArchivedNetworks()
        {
            return await _context.ArchivedNetworks.ToListAsync();
        }

        public async Task<bool> ArchiveNetwork(int id)
        {
            var network = await _context.NodeNetworks.FindAsync(id);

            if (network == null)
                return false;

            var existingArchived = await _context.ArchivedNetworks.FindAsync(id);

            if (existingArchived == null)
            {
                var archivedNetwork = new ArchivedNetworksModel
                {
                    name = network.name,
                    time_of_creation = network.time_of_creation,
                    ArchivedNetworkID = network.networkID // Re-use the same ID for reference
                };

                _context.ArchivedNetworks.Add(archivedNetwork);
            }
            // Instead of deleting:
            network.IsArchived = true;

            await _context.SaveChangesAsync();

            return true;
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