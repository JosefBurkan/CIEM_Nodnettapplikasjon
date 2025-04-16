using Microsoft.AspNetCore.Mvc;
using CIEM_Nodnettapplikasjon.Server.Database.Models.SamvirkeNettverk;
using CIEM_Nodnettapplikasjon.Server.Database.Repositories.SamvirkeNettverk;
using CIEM_Nodnettapplikasjon.Server.Database.Models.Nodes;
using CIEM_Nodnettapplikasjon.Server.Database;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace CIEM_Nodnettapplikasjon.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")] // Route base: api/qr
    public class QRController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IQRRepository _qrRepository;


        public QRController(ApplicationDbContext context, IQRRepository qRRepository)
        {
            _context = context;
            _qrRepository = qRRepository;
        }

        // POST: api/qr/add-node (Creates a new node via QR token authorization)
        [HttpPost("add-node")]
        public async Task<IActionResult> AddNode([FromBody] QRNodeDto dto)
        {
            if (dto == null || dto.ParentId == 0 || string.IsNullOrEmpty(dto.Token))
            {
                return BadRequest("Ugyldig data.");
            }

            var newNode = await _qrRepository.AddNodeViaQRAsync(dto);

            if (newNode == null)
                return Unauthorized("Kunne ikke validere bruker eller node.");

            return Ok(newNode);
        }
    }
}
