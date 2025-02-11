namespace CIEM_Nodnettapplikasjon.Server.Services
{
    public class UserService : IUserService
    {
        private readonly IUserService _userService;
        public void Login(string username, string password)
        {

        }

        public void PasswordVerification(int userID, string password) { }
        public void GenerateSessionToken(int userID) { }
        public void Logout(int userID) { }
    }
}
