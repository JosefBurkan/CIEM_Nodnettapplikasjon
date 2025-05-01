using Microsoft.AspNetCore.Mvc;
using CIEM_Nodnettapplikasjon.Server.Database.Models.NodeNetworks;
using CIEM_Nodnettapplikasjon.Server.Database.Repositories.NodeNetworks;
using CIEM_Nodnettapplikasjon.Server.Database.Models.Nodes;
using CIEM_Nodnettapplikasjon.Server.Database;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using CIEM_Nodnettapplikasjon.Server.Database.Repositories.QRCode;

namespace CIEM_Nodnettapplikasjon.Server.Controllers
{
    // This controller handles API requests for the QR code
    [ApiController]
    [Route("api/[controller]")]
    public class QRController : ControllerBase
    {
        private readonly IQRRepository _qrRepository;

        
        public QRController(IQRRepository qRRepository)
        {
            _qrRepository = qRRepository;
        }

        // Creates a new node via QR token authorization
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
