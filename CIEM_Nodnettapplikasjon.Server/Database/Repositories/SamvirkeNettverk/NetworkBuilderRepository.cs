using System.Threading.Tasks;
using CIEM_Nodnettapplikasjon.Server.Database;
using CIEM_Nodnettapplikasjon.Server.Database.Models.NodeNetworks;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using CIEM_Nodnettapplikasjon.Server.Services.SamvirkeNettverk; 

namespace CIEM_Nodnettapplikasjon.Server.Database.Repositories.SamvirkeNettverk
{
    public class NetworkBuilderRepository : INetworkBuilderRepository
    {
        private readonly ApplicationDbContext _context;

        public NetworkBuilderRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        // Inserts a new node network into the database
        public async Task InsertAsync(NodeNetworksModel network)
        {
            _context.NodeNetworks.Add(network);
            await _context.SaveChangesAsync();
        }

        // Deletes a node network and all associated nodes by network ID
        public async Task<bool> DeleteNetworkAsync(int networkId)
        {
            var network = await _context.NodeNetworks
                .Include(n => n.Nodes)
                .FirstOrDefaultAsync(n => n.networkID == networkId);

            if (network == null)
                return false;

            // First delete the nodes
            _context.Nodes.RemoveRange(network.Nodes);

            // Then delete the network itself
            _context.NodeNetworks.Remove(network);

            await _context.SaveChangesAsync();
            return true;
        }
    }

    [Route("api/samvirkeNettverk")]
    [ApiController]
    public class NetworkBuilderController : ControllerBase
    {
        private readonly INetworkBuilderService _service;

        public NetworkBuilderController(INetworkBuilderService service)
        {
            _service = service;
        }

        // POST: api/samvirkeNettverk/create
        // Creates a new node network
        [HttpPost("create")]
        public async Task<IActionResult> CreateNetwork([FromBody] CreateNetworkDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Name))
                return BadRequest("Name is required.");

            var id = await _service.CreateNetworkAsync(dto.Name);
            return Ok(new { id });
        }
    }
}