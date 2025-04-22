using Microsoft.AspNetCore.Mvc;
using CIEM_Nodnettapplikasjon.Server.Database;
using CIEM_Nodnettapplikasjon.Server.Database.Models.SamvirkeNettverk;
using CIEM_Nodnettapplikasjon.Server.Database.Repositories.SamvirkeNettverk;
using CIEM_Nodnettapplikasjon.Server.Database.Models.Nodes;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;


[ApiController]
[Route("api/[controller]")] // Route base: api/nodes
public class NodesController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly INodeRepository _nodeRepo;

    public NodesController(ApplicationDbContext context, INodeRepository nodeRepo)
    {
        _context = context;
        _nodeRepo = nodeRepo;
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
    public async Task<IActionResult> GetNodeByUserId(int UserID)
    {
        var node = await _context.Nodes
            .FirstOrDefaultAsync(n => n.UserID == UserID);

        if (node == null)
            return NotFound("Ingen node funnet for denne brukeren.");

        return Ok(node);
    }

    // DELETE: api/nodes/delete/{nodeID} (Deletes a node by ID)
    [HttpDelete("delete/{nodeID}")]
    public async Task<IActionResult> RemoveNodeByUserId(int nodeID)
    {
        var node = await _context.Nodes
            .FirstOrDefaultAsync(n => n.nodeID == nodeID);
        
        if (node == null) 
        {
            return NotFound("Ingen node funnet med denne id'en");
        }
        else
        {
            Console.WriteLine("Noden har blitt fjernet!");
            _context.Nodes.Remove(node);
            await _context.SaveChangesAsync();
        }

        return Ok(node);
    }

    // Save node connections
    [HttpPut("connect")]
    public async Task<IActionResult> AddNodeConnection([FromBody] NodeConnection connectionData)
    {
        var saveConnection = await _nodeRepo.SaveNodeConnection(connectionData.NodeID, connectionData.ConnectionID);
        return Ok(saveConnection);
    }
}
