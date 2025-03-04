using CIEM_Nodnettapplikasjon.Server.Services;
using CIEM_Nodnettapplikasjon.Server.Repositories;
using CIEM_Nodnettapplikasjon.Server.Models;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CIEM_Nodnettapplikasjon.Server.Controllers
{
    [ApiController]
    [Route("api/user")]
    public class UserController : ControllerBase
    {

        private readonly IUserService _userService;
        private readonly IUserRepository _userRepository;
        private readonly ApplicationDbContext _context;

        public UserController(IUserService userService, ApplicationDbContext context) 
        {
            _userService = userService;
            _context = context;

        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginRequest loginRequest)
        {
            var user = _userService.AuthenticateUser(loginRequest.Email).Result;

            if (user.name == loginRequest.Email)
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
