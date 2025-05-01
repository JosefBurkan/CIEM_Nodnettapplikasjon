using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using CIEM_Nodnettapplikasjon.Server.Services.NodeNetworks;
using System.Linq;
using Microsoft.EntityFrameworkCore;


// This controller handles API requests for the node networks and retrieves data from the "NodeNetworks" table.
[Route("api/[controller]")]
[ApiController] 
public class NetworkBuilderController : ControllerBase
{

    private readonly INodeNetworksService _service;

    public NetworkBuilderController(INodeNetworksService service)
    {
        _service = service;
    }

    // Creates a new network by name, using input data from the front end
    [HttpPost("create")]
    public async Task<IActionResult> CreateNetworkAsync([FromBody] CreateNetworkDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Name))
            return BadRequest("Name is required.");

        var id = await _service.CreateNetworkAsync(dto.Name);
        return Ok(new { id });
    }


    // Gets all networks stored in the archived table
    [HttpGet("archived")]
    public async Task<IActionResult> GetAllArchivedNetworks()
    {
        var networks = await _service.RetrieveAllNetworksAsync(); // gets all non-archived

        var archivedNetworks = networks; // Filter out the archived networks
        return Ok(archivedNetworks);
    }


    // Deletes an existing network by ID
    [HttpDelete("delete/{id}")]
    public async Task<IActionResult> DeleteNetwork(int id)
    {
        var deleted = await _service.DeleteNetworkAsync(id);
        if (deleted == null)
            return NotFound();

        return NoContent();
    }
}