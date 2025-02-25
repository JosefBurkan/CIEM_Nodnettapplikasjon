namespace CIEM_Nodnettapplikasjon.Server.Models
{
    public class DepartmentLeaderModel : UserModel
    {
        public DepartmentLeaderModel(string name, string surname, string email, string phone, string password, string role)
            : base(name, surname, email, phone, password, role) { }
    }
}
