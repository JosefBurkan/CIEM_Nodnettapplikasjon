namespace CIEM_Nodnettapplikasjon.Server.Services.Users
{
    public interface IUserService
    {
        bool Login(string username, string password);
        bool AuthenticateUser(string username, string password);
        void Logout(int userID);
        


    }
}