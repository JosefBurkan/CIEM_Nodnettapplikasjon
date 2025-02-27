using CIEM_Nodnettapplikasjon.Server.Services;
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
        private readonly ApplicationDbContext _context;

        public UserController(IUserService userService, ApplicationDbContext context) 
        {
            _userService = userService;
            _context = context;

        }

        [HttpGet]
        public async Task<IActionResult> GetUsers()
        {
            var users = await _context.Users.ToListAsync();
            return Ok(users);
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginRequest loginRequest)
        {
            if (_userService.AuthenticateUser(loginRequest.Email, loginRequest.Password))
            {
                GetUsers();
                return Ok( new {message = "Innlogging lykkes!"});
            }
            else
            {
                return BadRequest();
            }
            
        }


    }
}
