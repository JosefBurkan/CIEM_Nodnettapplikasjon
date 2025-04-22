using Microsoft.AspNetCore.Mvc;
using CIEM_Nodnettapplikasjon.Server.Database.Models.Nodes;
using CIEM_Nodnettapplikasjon.Server.Database;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace CIEM_Nodnettapplikasjon.Server.Database.Models.QRCode
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
                .FirstOrDefaultAsync(u => u.qr_token == dto.Token);

            if (parentUser == null)
            {
                return Unauthorized("Ugyldig token eller parentID.");
            }

            var parentNode = await _context.Nodes
                .FirstOrDefaultAsync(n => n.nodeID == dto.ParentId && n.UserID == parentUser.UserID);

            if (parentNode == null)
            {
                return BadRequest("Kunne ikke finne noden til tilh�rende bruker.");
            }


            // Create and add new node
            var newNode = new NodesModel
            {
                name = dto.Name,
                phone = dto.Phone,
                beskrivelse = dto.Beskrivelse,
                parentID = dto.ParentId,
                networkID = parentNode?.networkID ?? dto.ParentId, // fallback to parentId

            // Auto filling the rest
            category = "Frivillige",
            type = "Selvstendig",
            hierarchy_level = "Underakt�r"
            };

            _context.Nodes.Add(newNode);
            await _context.SaveChangesAsync();

            return Ok(newNode);
        }
    }
}