using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using CIEM_Nodnettapplikasjon.Server.Database.Repositories.InfoControl;
using CIEM_Nodnettapplikasjon.Server.Database.Models.InfoControl;

[ApiController]
[Route("api/[controller]")] // Base route: All dashboard endpoints
public class InfoControlController : ControllerBase
{
    private readonly IInfoControlRepository _infoControl;

    public InfoControlController(IInfoControlRepository infoControl)
    {
        _infoControl = infoControl;
    }

    [HttpGet("retrieveInfoControl")]
    public async Task<ActionResult<IEnumerable<InfoControlModel>>> GetInfoControl()
    {
        var infoControlData = await _infoControl.RetrieveInfoControl();
        return Ok(infoControlData);
    }

}