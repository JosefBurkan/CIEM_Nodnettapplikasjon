using System.Collections.Generic;
using System.Threading.Tasks;
using CIEM_Nodnettapplikasjon.Server.Models;


namespace CIEM_Nodnettapplikasjon.Server.Repositories
{
    public interface IUserInterface
    {
        Task AddUser(UserModel user);

        Task<UserModel> ModifyUser(int brukerID, UserModel user);

        Task<bool> DeleteUser(int brukerID);

        Task<UserModel> ViewUser(int brukerID);

    }
}
