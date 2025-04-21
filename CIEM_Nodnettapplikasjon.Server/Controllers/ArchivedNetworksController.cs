using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;
using CIEM_Nodnettapplikasjon.Server.Database.Repositories.NodeNetworks;
using CIEM_Nodnettapplikasjon.Server.Database.Models.NodeNetworks;
using CIEM_Nodnettapplikasjon.Server.Database.Models.Archive;


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
        public async Task<ActionResult<ArchivedNetworksModel>> GetArchivedNetworks()
        {
            var networks = await _nodeNetwork.GetAllArchivedNetworks();
            return Ok(networks);
        }
    }
}
