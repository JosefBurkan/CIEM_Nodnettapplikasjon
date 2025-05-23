using CIEM_Nodnettapplikasjon.Server.Database.Repositories.NodeNetworks;
using CIEM_Nodnettapplikasjon.Server.Database.Models.NodeNetworks;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace CIEM_Nodnettapplikasjon.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class KHNController : ControllerBase
    {
        private readonly INodeNetworkRepository _nodeNetwork;

        public KHNController(INodeNetworkRepository nodeNetwork)
        {
            _nodeNetwork = nodeNetwork;
        }

        [HttpGet("GetNodeNetwork")]
        public async Task<ActionResult<NodeNetworksModel>> GetNodeNetwork(int networkID)
        {
            var nodeNetwork = await _nodeNetwork.GetNodeNetworkByID(networkID);
            return Ok(nodeNetwork);
        }
    }

}