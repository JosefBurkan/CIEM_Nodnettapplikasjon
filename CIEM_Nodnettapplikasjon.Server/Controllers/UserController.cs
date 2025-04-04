using CIEM_Nodnettapplikasjon.Server.Services.Users;
using CIEM_Nodnettapplikasjon.Server.Repositories.Users;
using CIEM_Nodnettapplikasjon.Server.Models.Users;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Cors;

namespace CIEM_Nodnettapplikasjon.Server.Controllers
{
    [EnableCors("AllowFrontend")]
    [ApiController]
    [Route("api/user")]
    public class UserController : ControllerBase
    {

        private readonly IUserService _userService;
        private readonly IUserRepository _userRepository;

        public UserController(IUserService userService, IUserRepository userRepository)
        {
            _userService = userService;
            _userRepository = userRepository;
        }

        // Authenticate the login request
        [HttpPost("login")]
        public IActionResult Login([FromBody] CIEM_Nodnettapplikasjon.Server.Models.Users.LoginRequest loginRequest)
        {
            if (_userService.AuthenticateUser(loginRequest.Username, loginRequest.Password))
            {
                return Ok(new { message = "Innlogging lykkes!" });
            }
            else
            {
                return BadRequest(new { message = "Invalid username or password." });
            }

        }

        // Add a new user
        [HttpPost("add")]
        public IActionResult AddUser([FromBody] UserModel user)
        {
            if (user == null)
                return BadRequest("User data is null.");

            _userRepository.AddUser(user.Username, user.Email, user.Phone, user.Password, user.Role);
            return Ok(new { message = "User added successfully!" });
        }

        // Modify an existing user
        [HttpPut("modify/{userId}")]
        public IActionResult ModifyUser(int userId, [FromBody] UserModel user)
        {
            var existingUser = _userRepository.ViewUser(userId);
            if (existingUser == null)
                return NotFound(new { message = "User not found." });

            _userRepository.ModifyUser(userId, user.Username, user.Email, user.Phone, user.Role);
            return Ok(new { message = "User updated successfully!" });
        }

        // Delete a user 
        [HttpDelete("delete/{userId}")]
        public IActionResult DeleteUser(int userId)
        {
            var existingUser = _userRepository.ViewUser(userId);
            if (existingUser == null)
                return NotFound(new { message = "User not found." });

            _userRepository.DeleteUser(userId);
            return Ok(new { message = "User deleted successfully!" });
        }

        // View a user
        [HttpGet("view/{userId}")]
        public IActionResult ViewUser(int userId)
        {
            var user = _userRepository.ViewUser(userId);
            if (user == null)
                return NotFound(new { message = "User not found." });

            return Ok(user);
        }

        [HttpGet("admin")]
        public IActionResult GetAdmin()
        {
            var admin = new AdministratorModel(); // Uses the default values from the Administrator class
            return Ok(admin); // Returns the admin object to test
        }

        [HttpGet("basicuser")]
        public IActionResult GetBasicUser()
        {
            var basicUser = new BasicUserModel(); // Uses the default values from BasicUserModel class
            return Ok(basicUser); // Returns the basic user object to test
        }

        [HttpGet("departmentleader")]
        public IActionResult GetDepartmentLeader()
        {
            var departmentLeader = new DepartmentLeaderModel(); // Use DepartmentLeaderModel here
            return Ok(departmentLeader); // Returns the department leader object to test
        }

    }
}