using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using CIEM_Nodnettapplikasjon.Server.Services.SamvirkeNettverk;

namespace CIEM_Nodnettapplikasjon.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NetworkBuilderController : ControllerBase
    {
        private readonly INetworkBuilderService _service;

        public NetworkBuilderController(INetworkBuilderService service)
        {
            _service = service;
        }

        [HttpPost("create")]
        public async Task<IActionResult> CreateNetwork([FromBody] CreateNetworkDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Name))
                return BadRequest("Name is required.");

            var id = await _service.CreateNetworkAsync(dto.Name);
            return Ok(new { id });
        }

        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> DeleteNetwork(int id)
        {
            var deleted = await _service.DeleteNetworkAsync(id);
            if (!deleted)
                return NotFound();

            return NoContent();
        }
    }
}