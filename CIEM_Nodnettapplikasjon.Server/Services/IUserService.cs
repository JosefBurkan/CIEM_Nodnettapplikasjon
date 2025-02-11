namespace CIEM_Nodnettapplikasjon.Server.Services
{
    public interface IUserService
    {
        void Login(string email, string password);
        void PasswordVerification(int userID,  string password);
        void GenerateSessionToken(int userID);

        void Logout(int userID);



    }
}
