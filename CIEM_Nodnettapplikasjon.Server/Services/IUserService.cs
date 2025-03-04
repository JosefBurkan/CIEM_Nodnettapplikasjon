using CIEM_Nodnettapplikasjon.Server.Models;

namespace CIEM_Nodnettapplikasjon.Server.Services
{
    public interface IUserService
    {
        void Login(string email, string password);
        Task<UserModel> AuthenticateUser(string email);
        void Logout(int userID);
        


    }
}
