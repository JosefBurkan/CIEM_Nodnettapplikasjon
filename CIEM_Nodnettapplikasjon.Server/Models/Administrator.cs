namespace CIEM_Nodnettapplikasjon.Server.Models
{
    public class AdministratorModel : UserModel
    {
        public AdministratorModel(string name, string surname, string email, string phone, string password, string role) 
            : base(name, surname, email, phone, password, role)
        {
            name = name;
        }

    }
}
