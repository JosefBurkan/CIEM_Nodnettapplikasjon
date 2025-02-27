using System.ComponentModel.DataAnnotations; // For key attribute
using Microsoft.AspNetCore.Identity; // Identity features


namespace CIEM_Nodnettapplikasjon.Server.Models
{
    public class UserModel
    {
        [Key] // userID primary key
        public int UserID { get; set; }
        public string Name { get; set; }
        public string Surname { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public string Password { get; set; }
        public string Role { get; set; }

        
        protected UserModel(string name, string surname, string email, string phone, string password, string role)
        {
            name = name;
            surname = surname;  
            email = email;  
            phone = phone;  
            password = password;    
            role = role;    
        }
    }
}
