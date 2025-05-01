using CIEM_Nodnettapplikasjon.Server.Database.Models.Users;

namespace CIEM_Nodnettapplikasjon.Server.Database.Models.Users
{
    // Basci user type, inherits from UserModel
    public class BasicUserModel : UserModel
    {

        public BasicUserModel()
        : base("JohnPork", "johnpork@gmail.com", "5559282", "password123", "User")
        {
        }

    }
}
