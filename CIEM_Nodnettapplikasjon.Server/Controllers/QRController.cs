using Microsoft.AspNetCore.Mvc;
using CIEM_Nodnettapplikasjon.Server.Database.Models.Nodes;
using CIEM_Nodnettapplikasjon.Server.Database;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace CIEM_Nodnettapplikasjon.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class QRController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public QRController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpPost("add-node")]
        public async Task<IActionResult> AddNode([FromBody] QRNodeDto dto)
        {
            if (dto == null || dto.ParentId == 0 || string.IsNullOrEmpty(dto.Token))
            {
                return BadRequest("Ugyldig data.");
            }

            // Validate the token from the user
            var parentUser = await _context.Users
                .FirstOrDefaultAsync(u => u.UserID == dto.ParentId && u.qr_token == dto.Token);

            if (parentUser == null)
            {
                return Unauthorized("Ugyldig token eller parentID.");
            }

            // Optionally: Find the active network for the parent user (if needed)
            var parentNode = await _context.Nodes
                .FirstOrDefaultAsync(n => n.parentID == parentUser.UserID);

            // Create and add new node
            var newNode = new NodesModel
            {
                name = dto.Name,
                phone = dto.Phone,
                profession = dto.Profession,
                parentID = dto.ParentId,
                networkID = parentNode?.networkID ?? dto.ParentId, // fallback to parentId
            };

            _context.Nodes.Add(newNode);
            await _context.SaveChangesAsync();

            return Ok(newNode);
        }
    }

    public class QRNodeDto
    {
        public string Name { get; set; }
        public string Phone { get; set; }
        public string Profession { get; set; }
        public int ParentId { get; set; }
        public string Token { get; set; }
    }
}
