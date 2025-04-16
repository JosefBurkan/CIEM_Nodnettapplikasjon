using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;

[ApiController]
[Route("api/dashboard")] // Base route: All dashboard endpoints
public class DashboardController : ControllerBase
{

    // GET: api/dashboard/active-actors (Returns the count of currently active actors)
    [HttpGet("active-actors")]
    public IActionResult GetActiveActors()
    {
        return Ok(new { count = (int?)null }); 
    }

    // GET: api/dashboard/critical-info (Returns critical system issues and warnings)
    [HttpGet("critical-info")]
    public IActionResult GetCriticalInfo()
    {
        return Ok(new { issues = (int?)null, warnings = (int?)null });
    }

    // GET: api/dashboard/live-network (Simulates status and latency of the live network)
    [HttpGet("live-network")]
    public IActionResult GetLiveNetworkStatus()
    {
        return Ok(new { status = (string?)null, latency = (string?)null });
    }

    // GET: api/dashboard/updates (Fetches a list of recent updates/notifications)
    [HttpGet("updates")]
    public IActionResult GetUpdates()
    {
        return Ok(new List<object>()); 
    }
}
