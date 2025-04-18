using CIEM_Nodnettapplikasjon.Server.Database.Repositories.NodeNetworks;
using CIEM_Nodnettapplikasjon.Server.Database.Models.NodeNetworks;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace CIEM_Nodnettapplikasjon.Server.Controllers
{
    [ApiController]
    [Route("api/samvirkeNettverk")] // Route base: api/samvirkeNettverk
    public class SamvirkeNettverkController : ControllerBase
    {
        private readonly INodeNetworkRepository _nodeNetwork;

        public SamvirkeNettverkController(INodeNetworkRepository nodeNetwork)
        {
            _nodeNetwork = nodeNetwork;
        }

       // GET: api/samvirkeNettverk/GetNodeNetwork/{id} (Retrieves a single node network by ID including its related nodes)
        [HttpGet("GetNodeNetwork/{id}")]
        public async Task<ActionResult<NodeNetworksModel>> GetNodeNetwork(int id)
        {
            var nodeNetwork = await _nodeNetwork.GetNodeNetworkByID(id);
            if (nodeNetwork == null)
            {
                return NotFound($"No network found with ID {id}");
            }

            return Ok(nodeNetwork);
        }

       // GET: api/samvirkeNettverk/situations (Retrieves all live situations)
        [HttpGet("situations")]
        public async Task<IActionResult> GetAllSituations()
        {
            var situations = await _nodeNetwork.GetAllNodeNetworks();

            var result = situations
                .Select(s => new
                {
                    Title = s.name,
                    NetworkId = s.networkID,
                    Status = s.Status
                });

            return Ok(result);
        }

       // POST: api/samvirkeNettverk/archive/{id} (Archives a given node network by ID)
        [HttpPost("archive/{id}")]
        public async Task<IActionResult> ArchiveNetwork(int id)
        {
            var success = await _nodeNetwork.ArchiveNetwork(id);

            if (!success)
                return NotFound($"No network found with ID {id}");

            return Ok("Network archived successfully");
        }

        // DELETE: api/samvirkeNettverk/delete({id} (Deletes a node network by ID)
        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> DeleteNetwork(int id)
        {
            await _nodeNetwork.DeleteNodeNetwork(id);
            return Ok("Network deleted successfully");
        }

       // GET: api/samvirkeNettverk/all-situations (Used by dashboard.jsx to dynamically fetch all live node networks)
        [HttpGet("all-situations")]
        public async Task<IActionResult> GetAllSituationsWithStatus()
        {
            var situations = await _nodeNetwork.GetAllNodeNetworks();

            var result = situations.Select(s => new
            {
                Title = s.name,
                NetworkId = s.networkID,
                Status = s.Status
            });

            return Ok(result);
        }
    }
}