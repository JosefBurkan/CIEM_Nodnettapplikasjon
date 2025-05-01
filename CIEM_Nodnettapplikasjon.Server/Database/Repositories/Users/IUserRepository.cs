using CIEM_Nodnettapplikasjon.Server.Database.Models.Users;

namespace CIEM_Nodnettapplikasjon.Server.Database.Repositories.Users

{
    // IUserRepository defines the operations related to user management
    public interface IUserRepository
    {
        // Adds a new user with the provided details
        void AddUser(string username, string email, string phone, string password, string role);

        // Modifies an existing user's data based on userID
        void ModifyUser(int userID, string newUsername, string newEmail, string newPhone, string newRole);

        // Deletes a user from the system using their ID
        void DeleteUser(int userID);

        // Returns a specific user object by ID
        UserModel ViewUser(int userID);

        // Retrieves a user by their username 
        UserModel? GetUserByUsername(string username);

        // Asynchronously retrieves a user by their username 
        Task<UserModel?> GetUserByUsernameAsync(string username);

    }
}