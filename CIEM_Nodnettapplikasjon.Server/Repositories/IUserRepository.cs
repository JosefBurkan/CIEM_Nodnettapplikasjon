using CIEM_Nodnettapplikasjon.Server.Models;

namespace CIEM_Nodnettapplikasjon.Server.Repositories
{
    public interface IUserRepository
    {
        Task<UserModel> GetUsers();
    }
}
