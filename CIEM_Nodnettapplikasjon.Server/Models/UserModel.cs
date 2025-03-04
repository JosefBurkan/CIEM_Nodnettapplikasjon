using System.ComponentModel.DataAnnotations; // For key attribute
using Microsoft.AspNetCore.Identity; // Identity features


namespace CIEM_Nodnettapplikasjon.Server.Models
{
    public class UserModel
    {
        [Key] // userID primary key
        public int UserID { get; set; }

        public string Username {  get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public string Password { get; set; }
        public string Role { get; set; }

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

    public class LoginRequest
    {
        public string Username { get; set; } = null!;
        public string Password { get; set; } = null!;
    }
}