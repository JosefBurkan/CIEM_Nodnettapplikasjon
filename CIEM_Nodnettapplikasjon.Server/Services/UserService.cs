using CIEM_Nodnettapplikasjon.Server.Repositories;
using CIEM_Nodnettapplikasjon.Server.Models;
using Microsoft.EntityFrameworkCore;


namespace CIEM_Nodnettapplikasjon.Server.Services
{
    public class UserService : IUserService
    {
        private readonly IUserService _userService;
        private readonly IUserRepository _userRepository;
        private readonly ApplicationDbContext _context;

        public UserService(ApplicationDbContext context) {

            _context = context;
        }

        public void Login(string username, string password)
        {

        }

    public async Task<UserModel> AuthenticateUser(string name)
    {
        var hei = await _context.Users.FirstOrDefaultAsync(u => u.name == name); // Await the async method

        return hei;
    }

        public void Logout(int userID) { }

        public string Email { get; set; }
        public string Password { get; set; }
    }
}
