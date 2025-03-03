using CIEM_Nodnettapplikasjon.Server.Repositories;
using System;

namespace CIEM_Nodnettapplikasjon.Server.Services
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepository;

        public UserService(IUserRepository userRepository)
        {
            _userRepository = userRepository; // Injects the userrepository dependency
        }

        // Login method
        public bool Login(string username, string password)
        {
            return AuthenticateUser(username, password);
        }

        // Authentication method
        public bool AuthenticateUser(string username, string password)
        {
            // Fetch the user from the UserRepository.cs
            var user = _userRepository.GetUserByUsername(username);

            // Check if the user exists and the password matches
            if (user != null && user.Password == password) 
            {
                return true;
            }

            return false;
        }

        // Logout method 
        public void Logout(int userID)
        {
            Console.WriteLine($"User with ID {userID} has logged out.");
        }
    }
}
