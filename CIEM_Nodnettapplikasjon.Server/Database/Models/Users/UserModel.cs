using System.ComponentModel.DataAnnotations; // For key attribute
using Microsoft.AspNetCore.Identity; // Identity features


namespace CIEM_Nodnettapplikasjon.Server.Database.Models.Users
{
    // Represents the user in the database
    public class UserModel
    {
        [Key] // userID primary key
        public int UserID { get; set; }

        public string Username {  get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public string Password { get; set; }
        public string Role { get; set; }
        public string Organisasjon { get; set; }
        public string Stat { get; set; }
        public string qr_token {  get; set; }

        public UserModel() { }

        public UserModel(string username, string email, string phone, string password, string role)
        {
            this.Username = username;
            this.Email = email;
            this.Phone = phone;
            this.Password = password;
            this.Role = role;
        }
    }
    // Login requests from client
    public class LoginRequest
    {
        public string Username { get; set; } = null!;
        public string Password { get; set; } = null!;
    }
}