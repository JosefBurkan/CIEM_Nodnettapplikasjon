using Microsoft.AspNetCore.Mvc;
using CIEM_Nodnettapplikasjon.Server.Database;
using CIEM_Nodnettapplikasjon.Server.Database.Models.NodeNetworks;
using CIEM_Nodnettapplikasjon.Server.Database.Repositories.NodeNetworks;
using CIEM_Nodnettapplikasjon.Server.Database.Models.Nodes;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;


// This controller handles API requests for nodes and retrieves data from the "Nodes" table
[ApiController]
[Route("api/[controller]")] 
public class NodesController : ControllerBase
{
    private readonly INodeRepository _nodeRepo;
    private readonly INodeNetworkRepository _nodeNetwork;

    public NodesController(INodeRepository nodeRepo, INodeNetworkRepository nodeNetwork)
    {
        _nodeRepo = nodeRepo;
        _nodeNetwork = nodeNetwork;
    }

    // Creates a new node with input from the front end
    [HttpPost("add")]
    public async Task<IActionResult> AddNode([FromBody] NodeDto dto)
    {
        if (dto == null) return BadRequest("Ugyldig data.");

        var createdNode = await _nodeRepo.AddNodeAsync(dto);
        return Ok(createdNode);
    }

    // Retrieves a single node by associated userID
    [HttpGet("user/{userID}")]
    public async Task<IActionResult> GetNodeByUserId(int userID)
    {
        var node = await _nodeRepo.GetNodeByUserIdAsync(userID);

        if (node == null)
            return NotFound("Ingen node funnet for denne brukeren.");

        return Ok(node);
    }

    // Deletes a node by ID
    [HttpDelete("delete/{nodeID}")]
    public async Task<IActionResult> RemoveNodeByUserId(int nodeID)
    {
        var success = await _nodeRepo.RemoveNodeByIdAsync(nodeID);

        if (!success)
            return NotFound("Ingen node funnet med denne id'en");

        Console.WriteLine("Noden har blitt fjernet!");
        return Ok($"Node med ID {nodeID} ble fjernet.");
    }

    // Save manually created connections between nodes in the nodenetwork
    [HttpPut("connect")]
    public async Task<IActionResult> AddNodeConnection([FromBody] NodeConnection connectionData)
    {
        var saveConnection = await _nodeRepo.SaveNodeConnection(connectionData.NodeID, connectionData.ConnectionID);
        return Ok(saveConnection);
    }
}

