using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using CIEM_Nodnettapplikasjon.Server.Database.Repositories.InfoPanel;
using CIEM_Nodnettapplikasjon.Server.Database.Models.InfoPanel;

namespace CIEM_Nodnettapplikasjon.Server.Controllers.InfoPanel
 {

    // This controller handles API requests for the info panel and retrieves data from the "InfoPanel" table.
    [ApiController]
    [Route("api/[controller]")] // Base route: All dashboard endpoints
    public class InfoPanelController : ControllerBase
    {
        private readonly IInfoPanelRepository _InfoPanel;

        public InfoPanelController(IInfoPanelRepository InfoPanel)
        {
            _InfoPanel = InfoPanel;
        }

        // Retrieves all info in the infopanel as a list
        [HttpGet("retrieveInfoPanel")]
        public async Task<ActionResult<IEnumerable<InfoPanelModel>>> GetInfoPanel()
        {
            var InfoPanelData = await _InfoPanel.RetrieveInfoPanel();
            return Ok(InfoPanelData);
        }

    }
}