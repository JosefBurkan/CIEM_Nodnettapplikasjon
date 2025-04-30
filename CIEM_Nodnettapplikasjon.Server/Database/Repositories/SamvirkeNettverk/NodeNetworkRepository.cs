using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using CIEM_Nodnettapplikasjon.Server.Database.Models.Nodes;
using CIEM_Nodnettapplikasjon.Server.Database.Models.SamvirkeNettverk;
using CIEM_Nodnettapplikasjon.Server.Database;


namespace CIEM_Nodnettapplikasjon.Server.Database.Repositories.SamvirkeNettverk
{
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

        // Grabs a specific nodenetwork, and only the nodes witch matches the foreign key of Nodes
        public async Task<NodeNetworksModel> GetNodeNetworkByID(int id)
        {
            return await _context.NodeNetworks
                .Where(n => n.networkID == id)
                .Include(n => n.Nodes)
                .FirstOrDefaultAsync();
        }


        // Create a new node network
        public async Task<NodeNetworksModel> CreateNodeNetwork(NodeNetworksModel newNodeNetwork)
        {

            _context.NodeNetworks.Add(newNodeNetwork);
            await _context.SaveChangesAsync();
            return newNodeNetwork;
        }


        // Archive a network by setting isArchived = true
        public async Task<bool> ArchiveNetwork(int id)
        {
            var network = await _context.NodeNetworks.FindAsync(id);

            if (network == null)
                return false;

            network.IsArchived = true; // Just marks it as archived

            await _context.SaveChangesAsync();
            return true;
        }


        // Delete a nodenetwork
        public async Task DeleteNodeNetwork(int id)
        {

            var nodeNetwork = await _context.NodeNetworks.FindAsync(id);
            if (nodeNetwork != null)
            {
                _context.NodeNetworks.Remove(nodeNetwork);
                await _context.SaveChangesAsync();
            }
        }
    }
}