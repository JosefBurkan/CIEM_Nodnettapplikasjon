using CIEM_Nodnettapplikasjon.Server.Database.Models.Nodes;
using CIEM_Nodnettapplikasjon.Server.Database.Models.SamvirkeNettverk;
using System.Threading.Tasks;

namespace CIEM_Nodnettapplikasjon.Server.Database.Repositories.SamvirkeNettverk
{
    public class NodeRepository : INodeRepository
    {
        private readonly ApplicationDbContext _context;

        public NodeRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<NodesModel> AddNodeAsync(NodeDto dto)
        {
            var newNode = new NodesModel
            {
                name = dto.Name,
                phone = dto.Phone,
                beskrivelse = dto.Beskrivelse,
                parentID = dto.ParentID ?? 0,
                networkID = dto.NetworkID,
                category = dto.Category,
                type = dto.Type,
                hierarchy_level = dto.HierarchyLevel
            };

            _context.Nodes.Add(newNode);
            await _context.SaveChangesAsync();

            return newNode;
        }
    }
}
