using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using CIEM_Nodnettapplikasjon.Server.Services.SamvirkeNettverk;

namespace CIEM_Nodnettapplikasjon.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController] // Base route: api/NetworkBuilder
    public class NetworkBuilderController : ControllerBase
    {
        private readonly INetworkBuilderService _service;

        public NetworkBuilderController(INetworkBuilderService service)
        {
            _service = service;
        }

        // POST: api/NetworkBuilder/create (Creates a new network by name)
        [HttpPost("create")]
        public async Task<IActionResult> CreateNetwork([FromBody] CreateNetworkDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Name))
                return BadRequest("Name is required.");

            var id = await _service.CreateNetworkAsync(dto.Name);
            return Ok(new { id });
        }

        // DELETE: api/NetworkBuilder/delete/{id} (Deletes an existing network by ID)
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