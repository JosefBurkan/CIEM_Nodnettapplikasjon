namespace CIEM_Nodnettapplikasjon.Server.Services
{
    public class UserService : IUserService
    {
        private readonly IUserService _userService;
        public void Login(string username, string password)
        {

        }

        public bool AuthenticateUser(string email, string password)
        {
            return email == "josef" && password == "123";
        }

        public void GenerateSessionToken(int userID) { }
        public void Logout(int userID) { }

        public string Email { get; set; }
        public string Password { get; set; }
    }
}
