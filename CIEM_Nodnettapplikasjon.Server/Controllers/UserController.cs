using CIEM_Nodnettapplikasjon.Server.Services;
using CIEM_Nodnettapplikasjon.Server.Models;
using CIEM_Nodnettapplikasjon.Server.Repositories;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;

namespace CIEM_Nodnettapplikasjon.Server.Controllers
{
    [ApiController]
    [Route("api/user")]
    public class UserController : ControllerBase
    {

        private readonly IUserService _userService;
        private readonly IUserInterface _userRepository;
        
        public UserController(IUserService userService, IUserInterface userRepository) 
        {
            _userService = userService;
            _userRepository = userRepository;
        }

        // User Authentication
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

        // Add User
        [HttpPost("add")]
        public async Task<IActionResult> AddUser([FromBody] UserModel user)
        {
            if (user == null)
                return BadRequest("User data is missing");

            await _userRepository.AddUser(user);
            return Ok(new { message = "User added successfully" });
        }

        // Modify User
        [HttpPut("modify/{id}")]
        public async Task<IActionResult> ModifyUser(int id, [FromBody] UserModel updatedUser)
        {
            var result = await _userRepository.ModifyUser(id, updatedUser);
            if (result == null)
                return NotFound(new { message = "User not found" });

            return Ok(new { message = "User updated successfully", user = result });
        }

        // Delete User
        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var success = await _userRepository.DeleteUser(id);
            if (!success)
                return NotFound(new { message = "User not found" });

            return Ok(new { message = "User deleted successfully" });
        }

        // View User
        [HttpGet("view/{id}")]
        public async Task<IActionResult> ViewUser(int id)
        {
            var user = await _userRepository.ViewUser(id);
            if (user == null)
                return NotFound(new { message = "User not found" });

            return Ok(user);
        }


    }
}
