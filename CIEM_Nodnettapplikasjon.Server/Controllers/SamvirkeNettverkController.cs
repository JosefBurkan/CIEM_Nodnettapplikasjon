using CIEM_Nodnettapplikasjon.Server.Database.Repositories.NodeNetworks;
using CIEM_Nodnettapplikasjon.Server.Database.Models.NodeNetworks;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;


// This controller handles API requests for nodes and retrieves data from the "Nodes" table.
[ApiController]
[Route("api/NodeNetworks")] 
public class NodeNetworksController : ControllerBase
{
    private readonly INodeNetworkRepository _nodeNetwork;

    public NodeNetworksController(INodeNetworkRepository nodeNetwork)
    {
        _nodeNetwork = nodeNetwork;
    }

    // Get a specific node network
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

    // Retrieves all live situations
    [HttpGet("situations")]
    public async Task<IActionResult> GetAllSituations()
    {
        var situations = await _nodeNetwork.GetAllNodeNetworks();

        // "result" should be handled inside a service file, not controller
        var result = situations
            .Select(s => new
            {
                Title = s.name,
                NetworkId = s.networkID,
            })
            .ToList();

        return Ok(result);
    }

    // Archives a node network by ID
    [HttpPost("archive/{id}")]
    public async Task<IActionResult> ArchiveNetwork(int id)
    {
        var success = await _nodeNetwork.ArchiveNetwork(id);

        if (success == null)
            return NotFound($"No network found with ID {id}");

        return Ok("Network archived successfully");
    }

    // Deletes a node network by ID
    [HttpDelete("delete/{id}")]
    public async Task<IActionResult> DeleteNetwork(int id)
    {
        await _nodeNetwork.DeleteNodeNetwork(id);
        return Ok("Network deleted successfully");
    }

    // Used by dashboard.jsx to fetch all live node networks
    [HttpGet("all-situations")]
    public async Task<IActionResult> GetAllSituationsDashboard()
    {
        var situations = await _nodeNetwork.GetAllNodeNetworks();

        // "result" should be handled inside a service file, not controller
        var result = situations
            .Where(s => !s.IsArchived)
            .Select(s => new
            {
                Title = s.name,
                NetworkId = s.networkID,
            })
            .ToList();

        return Ok(result);
    }
}
