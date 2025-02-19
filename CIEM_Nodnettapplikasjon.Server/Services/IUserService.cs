namespace CIEM_Nodnettapplikasjon.Server.Services
{
    public interface IUserService
    {
        void Login(string email, string password);
        bool AuthenticateUser(string email, string password);
        void GenerateSessionToken(int userID);
        void Logout(int userID);
        


    }
}
