using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;

[ApiController]
[Route("api/dashboard")]
public class DashboardController : ControllerBase
{
    [HttpGet("active-actors")]
    public IActionResult GetActiveActors()
    {
        return Ok(new { count = (int?)null }); 
    }

    [HttpGet("critical-info")]
    public IActionResult GetCriticalInfo()
    {
        return Ok(new { issues = (int?)null, warnings = (int?)null });
    }

    [HttpGet("live-network")]
    public IActionResult GetLiveNetworkStatus()
    {
        return Ok(new { status = (string?)null, latency = (string?)null });
    }

    [HttpGet("updates")]
    public IActionResult GetUpdates()
    {
        return Ok(new List<object>()); 
    }
}
