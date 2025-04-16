using CIEM_Nodnettapplikasjon.Server.Database.Models.SamvirkeNettverk;
using CIEM_Nodnettapplikasjon.Server.Database.Models.Nodes;
using Microsoft.EntityFrameworkCore;

namespace CIEM_Nodnettapplikasjon.Server.Database.Repositories.SamvirkeNettverk
{
    public class QRRepository : IQRRepository
    {
        private readonly ApplicationDbContext _context;

        public QRRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<NodesModel?> AddNodeViaQRAsync(QRNodeDto dto)
        {
            var parentUser = await _context.Users
                .FirstOrDefaultAsync(u => u.qr_token == dto.Token);

            if (parentUser == null) return null;

            var parentNode = await _context.Nodes
                .FirstOrDefaultAsync(n => n.nodeID == dto.ParentId && n.UserID == parentUser.UserID);

            if (parentNode == null) return null;

            var newNode = new NodesModel
            {
                name = dto.Name,
                phone = dto.Phone,
                beskrivelse = dto.Beskrivelse,
                parentID = dto.ParentId,
                networkID = parentNode?.networkID ?? dto.ParentId,
                category = "Frivillige",
                type = "Selvstendig",
                hierarchy_level = "Underaktør"
            };

            _context.Nodes.Add(newNode);
            await _context.SaveChangesAsync();

            return newNode;
        }
    }
}
