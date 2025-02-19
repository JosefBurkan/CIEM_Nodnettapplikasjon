using Microsoft.AspNetCore.Mvc;

namespace CIEM_Nodnettapplikasjon.Server.Controllers
{
    [ApiController]  // Ensures it's treated as an API controller
    [Route("api/[controller]")] // This makes the endpoint accessible at /api/user
    public class UserController : ControllerBase // Use ControllerBase instead of Controller
    {
        [HttpGet] // Specifies this is a GET request
        public IActionResult GetUsers()
        {
            return Ok(new { message = "API is working!" }); // Returns a test response
        }
    }
}
