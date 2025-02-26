using CIEM_Nodnettapplikasjon.Server.Models;

namespace CIEM_Nodnettapplikasjon.Server.Models
{
    public class BasicUserModel : UserModel
    {

        public BasicUserModel()
        : base("JohnPork", "johnpork@gmail.com", "5559282", "password123", "User")
        {
        }

    }
}
