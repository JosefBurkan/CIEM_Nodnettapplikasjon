using System.Collections.Generic;
using System.Threading.Tasks;
using CIEM_Nodnettapplikasjon.Server.Models;


namespace CIEM_Nodnettapplikasjon.Server.Repositories
{
    public interface IUserInterface
    {
        Task AddUser(User user);

        Task<User> ModifyUser(int brukerID, User user);

        Task<bool> DeleteUser(int brukerID);

        Task<User> ViewUser(int brukerID);

    }
}
