using CIEM_Nodnettapplikasjon.Server.Database.Repositories.NodeNetworks;
using CIEM_Nodnettapplikasjon.Server.Database.Models.NodeNetworks;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace CIEM_Nodnettapplikasjon.Server.Controllers
{
    [ApiController]
    [Route("api/samvirkeNettverk")]
    public class SamvirkeNettverkController : ControllerBase
    {
        private readonly INodeNetworkRepository _nodeNetwork;

        public SamvirkeNettverkController(INodeNetworkRepository nodeNetwork)
        {
            _nodeNetwork = nodeNetwork;
        }

        // 1. GET a specific SamvirkeNettverk by networkId (used in detail view)
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

        // 2. GET all SamvirkeNettverk (used for the grid overview)
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

        // 3. Archive a specific Samvirke Nettverk and move it to ArchivedNetworks
        [HttpPost("archive/{id}")]
        public async Task<IActionResult> ArchiveNetwork(int id)
        {
            var success = await _nodeNetwork.ArchiveNetwork(id);

            if (!success)
                return NotFound($"No network found with ID {id}");

            return Ok("Network archived successfully");
        }


        // Delete network
        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> DeleteNetwork(int id)
        {
            await _nodeNetwork.DeleteNodeNetwork(id);
            return Ok("Network deleted successfully");
        }


        // Used by Dashboard.jsx for dynamic logic
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