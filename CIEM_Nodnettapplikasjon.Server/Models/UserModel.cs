using Microsoft.AspNetCore.Identity;

namespace CIEM_Nodnettapplikasjon.Server.Models
{
    public class UserModel
    {
        public int userID { get; set; }
        public string name { get; set; }
        public string surname { get; set; }
        public string email { get; set; }
        public string phone { get; set; }
        public string password { get; set; }
        public string role { get; set; }

    }
}
