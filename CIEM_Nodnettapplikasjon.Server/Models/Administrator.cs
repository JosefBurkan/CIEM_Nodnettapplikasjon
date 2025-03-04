using CIEM_Nodnettapplikasjon.Server.Models;

namespace CIEM_Nodnettapplikasjon.Server.Models
{
    public class AdministratorModel : UserModel
    {

        public AdministratorModel() 
        : base("admin", "admin@example.com", "5550000", "123", "Administrator")
            {
            }

    }
}
