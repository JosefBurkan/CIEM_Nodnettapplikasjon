using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using CIEM_Nodnettapplikasjon.Server.Database.Models.Nodes;
using CIEM_Nodnettapplikasjon.Server.Database.Models.NodeNetworks;
using CIEM_Nodnettapplikasjon.Server.Database;
using System.Linq;
using Microsoft.EntityFrameworkCore;


namespace CIEM_Nodnettapplikasjon.Server.Database.Repositories.NodeNetworks
{
    // NodeNetworksRepository handles the implementation of node network-related database operation
    public class NodeNetworksRepository : INodeNetworkRepository
    {
        private readonly ApplicationDbContext _context;

        public NodeNetworksRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        // Retrieves all node networks that are not archived
        public async Task<IEnumerable<NodeNetworksModel>> GetAllNodeNetworks()
        {

            return await _context.NodeNetworks
            .Where(n => !n.IsArchived)
            .ToListAsync();

        }

        // Retrieves a specific node network, and only the nodes witch matches the foreign key of Nodes
        public async Task<NodeNetworksModel> GetNodeNetworkByID(int id)
        {
            return await _context.NodeNetworks
                .Where(n => n.networkID == id)
                .Include(n => n.Nodes)
                .FirstOrDefaultAsync();
        }


        // Create a new node network and saves it to the database
        public async Task<NodeNetworksModel> CreateNodeNetwork(NodeNetworksModel newNodeNetwork)
        {

            _context.NodeNetworks.Add(newNodeNetwork);
            await _context.SaveChangesAsync();
            return newNodeNetwork;
        }


        // Archive a network by setting isArchived = true
        public async Task<NodeNetworksModel> ArchiveNetwork(int id)
        {
            var network = await _context.NodeNetworks.FindAsync(id);

            if (network == null)
                return null;

            network.IsArchived = false; // Just marks it as archived

            await _context.SaveChangesAsync();
            return null;
        }


        // Delete a node network by its ID
        public async Task<NodeNetworksModel> DeleteNodeNetwork(int id)
        {

            var nodeNetwork = await _context.NodeNetworks.FindAsync(id);
            if (nodeNetwork != null)
            {
                _context.NodeNetworks.Remove(nodeNetwork);
                await _context.SaveChangesAsync();
                return null;
            }

            return null;
        }
    }
}