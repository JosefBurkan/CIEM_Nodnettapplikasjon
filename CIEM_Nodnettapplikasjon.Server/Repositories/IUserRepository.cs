using CIEM_Nodnettapplikasjon.Server.Models;

namespace CIEM_Nodnettapplikasjon.Server.Repositories

{
    public interface IUserRepository
    {
        void AddUser(string username, string email, string phone, string password, string role);
        void ModifyUser(int userID, string newUsername, string newEmail, string newPhone, string newRole);
        void DeleteUser(int userID);
        UserModel ViewUser(int userID);
    }
}
