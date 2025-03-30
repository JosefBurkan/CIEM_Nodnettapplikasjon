using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;
using CIEM_Nodnettapplikasjon.Server.Database.Repositories.NodeNetworks;
using CIEM_Nodnettapplikasjon.Server.Database.Models.NodeNetworks;

namespace CIEM_Nodnettapplikasjon.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ArchivedNetworksController : ControllerBase
    {
        private readonly INodeNetworkRepository _nodeNetwork;

        public ArchivedNetworksController(INodeNetworkRepository nodeNetwork)
        {
            _nodeNetwork = nodeNetwork;
        }

        // GET: api/ArchivedNetworks
        [HttpGet]
        public async Task<ActionResult<NodeNetworksModel>> GetArchivedNetworks()
        {
            var networks = await _nodeNetwork.GetAllNodeNetworks();
            return Ok(networks);
        }
    }
}
