using CIEM_Nodnettapplikasjon.Server.Database.Models.Users;

namespace CIEM_Nodnettapplikasjon.Server.Database.Repositories.Users

{
    public interface IUserRepository
    {
        void AddUser(string username, string email, string phone, string password, string role);
        void ModifyUser(int userID, string newUsername, string newEmail, string newPhone, string newRole);
        void DeleteUser(int userID);
        UserModel ViewUser(int userID);
        UserModel? GetUserByUsername(string username);
        Task<UserModel?> GetUserByUsernameAsync(string username);

    }
}