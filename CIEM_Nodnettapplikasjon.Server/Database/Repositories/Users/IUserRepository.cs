using CIEM_Nodnettapplikasjon.Server.Models.Users;

namespace CIEM_Nodnettapplikasjon.Server.Repositories.Users

{
    public interface IUserRepository
    {
        void AddUser(string username, string email, string phone, string password, string role);
        void ModifyUser(int userID, string newUsername, string newEmail, string newPhone, string newRole);
        void DeleteUser(int userID);
        UserModel ViewUser(int userID);
        List<string> ViewUsers();
        UserModel? GetUserByUsername(string username);
    }
}