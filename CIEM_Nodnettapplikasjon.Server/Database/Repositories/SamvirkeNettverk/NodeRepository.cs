using CIEM_Nodnettapplikasjon.Server.Database.Models.Nodes;
using CIEM_Nodnettapplikasjon.Server.Database.Models.NodeNetworks;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;


namespace CIEM_Nodnettapplikasjon.Server.Database.Repositories.NodeNetworks
{
    // NodeRepository handles database operations related to nodes
    public class NodeRepository : INodeRepository
    {
        private readonly ApplicationDbContext _context;

        public NodeRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        // Adds a new node to the database based on the provided NodeDto
        public async Task<NodesModel> AddNodeAsync(NodeDto dto)
        {
            var newNode = new NodesModel
            {
                name = dto.Name,
                phone = dto.Phone,
                beskrivelse = dto.Beskrivelse,
                parentID = dto.ParentID ?? 0, // If parentID is null, default is 0
                networkID = dto.NetworkID,
                category = dto.Category,
                type = dto.Type,
                hierarchy_level = dto.HierarchyLevel
            };

            _context.Nodes.Add(newNode);
            await _context.SaveChangesAsync();

            return newNode;
        }

        // Retrieves a node based on the userID. If no node is found, returns null
        public async Task<NodesModel?> GetNodeByUserIdAsync(int userId)
        {
            return await _context.Nodes.FirstOrDefaultAsync(n => n.UserID == userId);
        }

        // Removes a node by its ID
        public async Task<bool> RemoveNodeByIdAsync(int nodeId)
        {
            var node = await _context.Nodes.FirstOrDefaultAsync(n => n.nodeID == nodeId);
            if (node == null)
                return false;

            _context.Nodes.Remove(node);
            await _context.SaveChangesAsync();
            return true;
        }

        // Save manually created connections between nodes
        public async Task<NodesModel> SaveNodeConnection(int selectedNodeID, int connectionIDs)
        {
            var node = await _context.Nodes.FindAsync(selectedNodeID);

            if (node == null)
            {
                return null; 
            }

            // If the conectionID list is not reinitialized here, it only overrides the current list
            if (node.connectionID == null)
            {
                node.connectionID = new List<int>();
            }

            node.connectionID.Add(connectionIDs);

            await _context.SaveChangesAsync();

            return node;
        }
    }
}
