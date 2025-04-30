using Microsoft.AspNetCore.Mvc;
using CIEM_Nodnettapplikasjon.Server.Database;
using CIEM_Nodnettapplikasjon.Server.Database.Models.NodeNetworks;
using CIEM_Nodnettapplikasjon.Server.Database.Repositories.NodeNetworks;
using CIEM_Nodnettapplikasjon.Server.Database.Models.Nodes;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;


[ApiController]
[Route("api/[controller]")] // Route base: api/nodes
public class NodesController : ControllerBase
{
    private readonly INodeRepository _nodeRepo;
    private readonly INodeNetworkRepository _nodeNetwork;

    public NodesController(INodeRepository nodeRepo, INodeNetworkRepository nodeNetwork)
    {
        _nodeRepo = nodeRepo;
        _nodeNetwork = nodeNetwork;
    }

    // POST: api/nodes/add (Creates a new node)
    [HttpPost("add")]
    public async Task<IActionResult> AddNode([FromBody] NodeDto dto)
    {
        if (dto == null) return BadRequest("Ugyldig data.");

        var createdNode = await _nodeRepo.AddNodeAsync(dto);
        return Ok(createdNode);
    }

    // GET: api/nodes/user/{userID} (Retrieves a single node by associated userID)
    [HttpGet("user/{userID}")]
    public async Task<IActionResult> GetNodeByUserId(int userID)
    {
        var node = await _nodeRepo.GetNodeByUserIdAsync(userID);

        if (node == null)
            return NotFound("Ingen node funnet for denne brukeren.");

        return Ok(node);
    }

    // DELETE: api/nodes/delete/{nodeID} (Deletes a node by ID)
    [HttpDelete("delete/{nodeID}")]
    public async Task<IActionResult> RemoveNodeByUserId(int nodeID)
    {
        var success = await _nodeRepo.RemoveNodeByIdAsync(nodeID);

        if (!success)
            return NotFound("Ingen node funnet med denne id'en");

        Console.WriteLine("Noden har blitt fjernet!");
        return Ok($"Node med ID {nodeID} ble fjernet.");
    }

    // Save node connections
    [HttpPut("connect")]
    public async Task<IActionResult> AddNodeConnection([FromBody] NodeConnection connectionData)
    {
        var saveConnection = await _nodeRepo.SaveNodeConnection(connectionData.NodeID, connectionData.ConnectionID);
        return Ok(saveConnection);
    }
}

