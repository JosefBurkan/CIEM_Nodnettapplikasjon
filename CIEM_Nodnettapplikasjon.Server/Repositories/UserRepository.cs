using CIEM_Nodnettapplikasjon.Server.Models;
using System.Collections.Generic;
using System.Linq;



namespace CIEM_Nodnettapplikasjon.Server.Repositories
{
    public class UserRepository : IUserRepository
    {
        private List<UserModel> users = new List<UserModel>();

        // Add User
        public void AddUser(string username, string email, string phone, string password, string role)
        {
            int newUserID = users.Count + 1;
            var newUser = new UserModel(username, email, phone, password, role); 
            newUser.UserID = newUserID;
            users.Add(newUser);
        }

        // Modify User
        public void ModifyUser(int userID, string newUsername, string newEmail, string newPhone, string newRole)
        {
            var user = users.FirstOrDefault(u => u.UserID == userID);
            if (user != null)
            {
                user.Username = newUsername;
                user.Email = newEmail;
                user.Phone = newPhone;
                user.Role = newRole;
            }
        }

        // Delete User
        public void DeleteUser(int userID)
        {
            users.RemoveAll(u => u.UserID == userID);
        }

        public UserModel ViewUser(int userID)
        {
            return users.FirstOrDefault(u => u.UserID == userID) ?? new UserModel("Joakim", "joakim@gmail.com", "49282920", "123", "Scrummaster");
        }

    }
}