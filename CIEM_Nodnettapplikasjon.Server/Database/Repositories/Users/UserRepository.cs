using CIEM_Nodnettapplikasjon.Server.Database.Models.Users;
using Microsoft.EntityFrameworkCore;
using System.Linq;

namespace CIEM_Nodnettapplikasjon.Server.Database.Repositories.Users
{
    public class UserRepository : IUserRepository
    {
        private readonly ApplicationDbContext _context;


        public UserRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        // Username authentication
        public UserModel? GetUserByUsername(string username)
        {
  
            var allUsers = _context.Users.ToList();
            Console.WriteLine($"Total users in database: {allUsers.Count}");
            foreach (var u in allUsers)
            {
                Console.WriteLine($"Found user: {u.Username}");
            }

            var user = _context.Users.FirstOrDefault(u => u.Username.ToLower() == username.ToLower());

            if (user == null)
            {
                Console.WriteLine($"User '{username}' not found in the database!");
            }
            else
            {
                Console.WriteLine($"User found: {user.Username}, ID: {user.UserID}");
            }

            return user;
        }

        // 
        public async Task<UserModel?> GetUserByUsernameAsync(string username)
        {
            return await _context.Users.FirstOrDefaultAsync(u => u.Username.ToLower() == username.ToLower());
        }


        // Add User
        public void AddUser(string username, string email, string phone, string password, string role)
        {
            var newUser = new UserModel
            {
                Username = username,
                Email = email,
                Phone = phone,
                Password = password, 
                Role = role
            };

            _context.Users.Add(newUser);
            _context.SaveChanges();
        }



        // Modify User
        public void ModifyUser(int userID, string newUsername, string newEmail, string newPhone, string newRole)
        {
            var user = _context.Users.FirstOrDefault(u => u.UserID == userID);
            if (user != null)
            {
                user.Username = newUsername;
                user.Email = newEmail;
                user.Phone = newPhone;
                user.Role = newRole;

                _context.SaveChanges();
            }
        }

        // Delete User 
        public void DeleteUser(int userID)
        {
            var user = _context.Users.FirstOrDefault(u => u.UserID == userID);
            if (user != null)
            {
                _context.Users.Remove(user); 
                _context.SaveChanges();      
            }
        }

        // View User
        public UserModel ViewUser(int userID)
        {
            return _context.Users.FirstOrDefault(u => u.UserID == userID) 
              ?? new UserModel("DefaultUser", "default@example.com", "0000000000", "password", "Guest");
        }
    }
}