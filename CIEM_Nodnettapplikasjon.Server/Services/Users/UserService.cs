using CIEM_Nodnettapplikasjon.Server.Repositories.Users;
using System;

namespace CIEM_Nodnettapplikasjon.Server.Services.Users
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
            // Fetch the user from the repository
            var user = _userRepository.GetUserByUsername(username);

            // Check if the user exists and the password matches
            if (user != null && user.Password == password) 
            {
                return true;
            }

            return false;
        }

        // Logout the user
        public void Logout(int userID)
        {
            Console.WriteLine($"User with ID {userID} has logged out.");
        }
    }
}