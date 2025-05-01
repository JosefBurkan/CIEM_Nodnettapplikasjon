using CIEM_Nodnettapplikasjon.Server.Database.Models.Users;

namespace CIEM_Nodnettapplikasjon.Server.Database.Models.Users
{
    // Admin user type, inhertis from UserModel
    public class AdministratorModel : UserModel
    {

        public AdministratorModel() 
        : base("admin", "admin@example.com", "5550000", "123", "Administrator")
            {
            }

    }
}
