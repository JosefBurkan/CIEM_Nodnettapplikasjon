using CIEM_Nodnettapplikasjon.Server.Database.Repositories.NodeNetworks;
using CIEM_Nodnettapplikasjon.Server.Database.Models.NodeNetworks;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace CIEM_Nodnettapplikasjon.Server.Controllers
{
    [ApiController]
    [Route("api/NodeNetworks")] // Route base: api/NodeNetworks
    public class NodeNetworksController : ControllerBase
    {
        private readonly INodeNetworkRepository _nodeNetwork;

        public NodeNetworksController(INodeNetworkRepository nodeNetwork)
        {
            _nodeNetwork = nodeNetwork;
        }

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

        // GET: api/NodeNetworks/situations (Retrieves all live situations)
        [HttpGet("situations")]
        public async Task<IActionResult> GetAllSituations()
        {
            var situations = await _nodeNetwork.GetAllNodeNetworks();

            var result = situations
                .Select(s => new
                {
                    Title = s.name,
                    NetworkId = s.networkID,
                })
                   .ToList();

            return Ok(result);
        }

        // POST: api/NodeNetworks/archive/{id} (Archives a given node network by ID)
        [HttpPost("archive/{id}")]
        public async Task<IActionResult> ArchiveNetwork(int id)
        {
            var success = await _nodeNetwork.ArchiveNetwork(id);

            if (!success)
                return NotFound($"No network found with ID {id}");

            return Ok("Network archived successfully");
        }

        // DELETE: api/NodeNetworks/delete({id} (Deletes a node network by ID)
        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> DeleteNetwork(int id)
        {
            await _nodeNetwork.DeleteNodeNetwork(id);
            return Ok("Network deleted successfully");
        }

        // GET: api/NodeNetworks/all-situations (Used by dashboard.jsx to dynamically fetch all live node networks)
        [HttpGet("all-situations")]
        public async Task<IActionResult> GetAllSituationsDashboard()
        {
            var situations = await _nodeNetwork.GetAllNodeNetworks();

            var result = situations
                .Where(s => !s.isArchived)
                .Select(s => new
                {
                    Title = s.name,
                    NetworkId = s.networkID,
                })
                .ToList();

            return Ok(result);
        }
    }
}
