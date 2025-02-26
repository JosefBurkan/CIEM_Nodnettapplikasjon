using CIEM_Nodnettapplikasjon.Server.Repositories;
using System;
using System.Linq;

namespace CIEM_Nodnettapplikasjon.Server.Services
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepository;

        public UserService(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        // Login method
        public bool Login(string username, string password)
        {
            return AuthenticateUser(username, password);
        }

        // Authentication method
        public bool AuthenticateUser(string username, string password)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(username))
                {
                    Console.WriteLine("Username is null, empty, or just whitespace.");
                    return false;
                }

                username = username.Trim();

                var user = _userRepository.GetUserByUsername(username);

                if (user == null)
                {
                    Console.WriteLine($"Authentication failed: User '{username}' not found.");
                    return false;
                }

                return password == user.Password;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Authentication error: {ex.Message}");
                return false;
            }
        }

        // Logout method
        public void Logout(int userID)
        {
            // Simple logout logic
            Console.WriteLine($"User with ID {userID} has logged out.");
        }
    }
}