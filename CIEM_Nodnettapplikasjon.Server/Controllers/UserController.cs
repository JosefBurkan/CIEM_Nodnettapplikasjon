using CIEM_Nodnettapplikasjon.Server.Services;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;

namespace CIEM_Nodnettapplikasjon.Server.Controllers
{
    [ApiController]
    [Route("api/user")]
    public class UserController : ControllerBase
    {

        private readonly IUserService _userService;
        public UserController(IUserService userService) 
        {
            _userService = userService;
        }


        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginRequest loginRequest)
        {
            if (_userService.AuthenticateUser(loginRequest.Email, loginRequest.Password))
            {
                return Ok( new {message = "Innlogging lykkes!"});
            }
            else
            {
                return BadRequest();
            }
        }
    }
}
