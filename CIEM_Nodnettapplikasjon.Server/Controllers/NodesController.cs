using Microsoft.AspNetCore.Mvc;
using CIEM_Nodnettapplikasjon.Server.Database;
using CIEM_Nodnettapplikasjon.Server.Database.Models.Nodes;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;



[ApiController]
[Route("api/[controller]")]
public class NodesController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public NodesController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpPost("add")]
    public async Task<IActionResult> AddNode([FromBody] NodeDto dto)
    {
        if (dto == null) return BadRequest("Ugyldig data.");

        var newNode = new NodesModel
        {
            name = dto.Name,
            phone = dto.Phone,
            beskrivelse = dto.Beskrivelse,
            parentID = dto.ParentID ?? 0,
            networkID = dto.NetworkID,
            category = dto.Category,
            type = dto.Type,
            hierarchy_level = dto.HierarchyLevel,
        };

        _context.Nodes.Add(newNode);
        await _context.SaveChangesAsync();

        return Ok(newNode);
    }

    [HttpGet("user/{userID}")]
    public async Task<IActionResult> GetNodeByUserId(int UserID)
    {
        var node = await _context.Nodes
            .FirstOrDefaultAsync(n => n.UserID == UserID);

        if (node == null)
            return NotFound("Ingen node funnet for denne brukeren.");

        return Ok(node);
    }

    // Delete a node
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



    public class NodeDto
    {
        public string Name { get; set; }
        public string Phone { get; set; }
        public string Beskrivelse { get; set; }
        public int? ParentID { get; set; }
        public int NetworkID { get; set; }
        public string Category { get; set; }
        public string Type { get; set; }
        public string HierarchyLevel { get; set; }
    }

}