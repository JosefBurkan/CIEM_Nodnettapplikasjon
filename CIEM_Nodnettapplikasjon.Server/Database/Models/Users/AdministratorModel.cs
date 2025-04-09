using CIEM_Nodnettapplikasjon.Server.Database.Models.Users;

namespace CIEM_Nodnettapplikasjon.Server.Database.Models.Users
{
    public class AdministratorModel : UserModel
    {

        public AdministratorModel() 
        : base("admin", "admin@example.com", "5550000", "123", "Administrator")
            {
            }

    }
}
