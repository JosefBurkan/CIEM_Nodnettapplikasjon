using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;
using CIEM_Nodnettapplikasjon.Server.Database;
using CIEM_Nodnettapplikasjon.Server.Database.Models; 

namespace CIEM_Nodnettapplikasjon.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ArchivedNetworksController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ArchivedNetworksController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/ArchivedNetworks
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ArchivedNetwork>>> GetArchivedNetworks()
        {
            var networks = await _context.ArchivedNetworks.ToListAsync();
            return Ok(networks);
        }

        // GET: api/ArchivedNetworks/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ArchivedNetwork>> GetArchivedNetwork(int id)
        {
            var network = await _context.ArchivedNetworks.FindAsync(id);

            if (network == null)
                return NotFound();

            return Ok(network);
        }

        // POST: api/ArchivedNetworks
        [HttpPost]
        public async Task<ActionResult<ArchivedNetwork>> CreateArchivedNetwork([FromBody] ArchivedNetwork newNetwork)
        {
            
            newNetwork.CreatedAt = System.DateTime.UtcNow;

            _context.ArchivedNetworks.Add(newNetwork);
            await _context.SaveChangesAsync();

            
            return CreatedAtAction(nameof(GetArchivedNetwork),
                                   new { id = newNetwork.id },
                                   newNetwork);
        }

     
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateArchivedNetwork(int id, [FromBody] ArchivedNetwork updatedNetwork)
        {
            if (id != updatedNetwork.id)
                return BadRequest("ID not found");

           
            _context.Entry(updatedNetwork).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
               
                if (!ArchivedNetworkExists(id))
                    return NotFound();
                else
                    throw;
            }

            return NoContent();
        }

        // DELETE: api/ArchivedNetworks/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteArchivedNetwork(int id)
        {
            var network = await _context.ArchivedNetworks.FindAsync(id);
            if (network == null)
                return NotFound();

            _context.ArchivedNetworks.Remove(network);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ArchivedNetworkExists(int id)
        {
            return _context.ArchivedNetworks.Any(e => e.id == id);
        }
    }
}
