using CIEM_Nodnettapplikasjon.Server.Services.Users;
using CIEM_Nodnettapplikasjon.Server.Database.Repositories.Users;
using CIEM_Nodnettapplikasjon.Server.Database.Models.Users;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Cors;
using Microsoft.EntityFrameworkCore;


namespace CIEM_Nodnettapplikasjon.Server.Controllers
{
    [EnableCors("AllowFrontend")]
    [ApiController]
    [Route("api/user")] // Route base: api/user
    public class UserController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IUserService _userService;
        private readonly IUserRepository _userRepository;

        public UserController(
            ApplicationDbContext context,
            IUserService userService, 
            IUserRepository userRepository)
        {
            _context = context;
            _userService = userService;
            _userRepository = userRepository;
        }

        // POST: api/user/login (Validates login credentials and returns user data if valid)
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] CIEM_Nodnettapplikasjon.Server.Database.Models.Users.LoginRequest loginRequest)
        {
            if (!_userService.AuthenticateUser(loginRequest.Username, loginRequest.Password))
            {
                return BadRequest(new { message = "Invalid username or password." });
            }
            var user = await _userRepository.GetUserByUsernameAsync(loginRequest.Username);

            if (user == null)
            {
                return BadRequest(new { message = "User not found after authentication." });
            }

            return Ok(new
            {
                UserID = user.UserID,
                Username = user.Username,
                qr_token = user.qr_token ?? ""
            });
        }

        // GET: api/user/current/{username} (Returns the full user object based on username)
        [HttpGet("current/{username}")]
        public async Task<IActionResult> GetCurrentUser(string username)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == username);

            if (user == null)
                return NotFound();

            return Ok(user);
        }

        // POST: api/user/add (Adds a new user to the system)
        [HttpPost("add")]
        public IActionResult AddUser([FromBody] UserModel user)
        {
            if (user == null)
                return BadRequest("User data is null.");

            _userRepository.AddUser(user.Username, user.Email, user.Phone, user.Password, user.Role);
            return Ok(new { message = "User added successfully!" });
        }

       // PUT: api/user/modify/{userID} (Updates an existing user's details)
        [HttpPut("modify/{userId}")]
        public IActionResult ModifyUser(int userId, [FromBody] UserModel user)
        {
            var existingUser = _userRepository.ViewUser(userId);
            if (existingUser == null)
                return NotFound(new { message = "User not found." });

            _userRepository.ModifyUser(userId, user.Username, user.Email, user.Phone, user.Role);
            return Ok(new { message = "User updated successfully!" });
        }

        // DELETE: api/user/delete/{userID} (Deletes a user by ID)
        [HttpDelete("delete/{userId}")]
        public IActionResult DeleteUser(int userId)
        {
            var existingUser = _userRepository.ViewUser(userId);
            if (existingUser == null)
                return NotFound(new { message = "User not found." });

            _userRepository.DeleteUser(userId);
            return Ok(new { message = "User deleted successfully!" });
        }

        // GET: api/user/view/{userID} (Returns a user by ID)
        [HttpGet("view/{userId}")]
        public IActionResult ViewUser(int userId)
        {
            var user = _userRepository.ViewUser(userId);
            if (user == null)
                return NotFound(new { message = "User not found." });

            return Ok(user);
        }

        // GET: api/user/admin 
        [HttpGet("admin")]
        public IActionResult GetAdmin()
        {
            var admin = new AdministratorModel(); 
            return Ok(admin); 
        }

        // GET: api/user/basicuser
        [HttpGet("basicuser")]
        public IActionResult GetBasicUser()
        {
            var basicUser = new BasicUserModel();
            return Ok(basicUser);
        }

        // GET: api/user/departmentleader
        [HttpGet("departmentleader")]
        public IActionResult GetDepartmentLeader()
        {
            var departmentLeader = new DepartmentLeaderModel();
            return Ok(departmentLeader); 
        }

    }
}