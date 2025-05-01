using CIEM_Nodnettapplikasjon.Server.Database.Models.NodeNetworks;
using CIEM_Nodnettapplikasjon.Server.Database.Models.Nodes;
using Microsoft.EntityFrameworkCore;

namespace CIEM_Nodnettapplikasjon.Server.Database.Repositories.QRCode
{
    public class QRRepository : IQRRepository
    {
        private readonly ApplicationDbContext _context;

        public QRRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        // Adds a new node using QR token validation
        public async Task<NodesModel?> AddNodeViaQRAsync(QRNodeDto dto)
        {
            var parentUser = await _context.Users
                .FirstOrDefaultAsync(u => u.qr_token == dto.Token);

            if (parentUser == null) return null;

            var parentNode = await _context.Nodes
                .FirstOrDefaultAsync(n => n.nodeID == dto.ParentId && n.UserID == parentUser.UserID);

            if (parentNode == null) return null;

            // Create a new child node with default values for some properties
            var newNode = new NodesModel
            {
                name = dto.Name,
                phone = dto.Phone,
                beskrivelse = dto.Beskrivelse,
                parentID = dto.ParentId,
                networkID = parentNode?.networkID ?? dto.ParentId,
                category = "Frivillige", // Default 
                type = "Selvstendig", // Default
                hierarchy_level = "Underakt�r" // Default
            };

            _context.Nodes.Add(newNode);
            await _context.SaveChangesAsync();

            return newNode;
        }
    }
}