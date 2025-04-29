using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using CIEM_Nodnettapplikasjon.Server.Database.Repositories.InfoPanel;
using CIEM_Nodnettapplikasjon.Server.Database.Models.InfoPanel;

[ApiController]
[Route("api/[controller]")] // Base route: All dashboard endpoints
public class InfoPanelController : ControllerBase
{
    private readonly IInfoPanelRepository _InfoPanel;

    public InfoPanelController(IInfoPanelRepository InfoPanel)
    {
        _InfoPanel = InfoPanel;
    }

    [HttpGet("retrieveInfoPanel")]
    public async Task<ActionResult<IEnumerable<InfoPanelModel>>> GetInfoPanel()
    {
        var InfoPanelData = await _InfoPanel.RetrieveInfoPanel();
        return Ok(InfoPanelData);
    }

}