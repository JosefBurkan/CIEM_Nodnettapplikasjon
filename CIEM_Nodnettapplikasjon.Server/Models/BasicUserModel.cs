namespace CIEM_Nodnettapplikasjon.Server.Models
{
    public class BasicUserModel : UserModel
    {
        public BasicUserModel(string name, string surname, string email, string phone, string password, string role)
            : base(name, surname, email, phone, password, role) { }
    }
}
