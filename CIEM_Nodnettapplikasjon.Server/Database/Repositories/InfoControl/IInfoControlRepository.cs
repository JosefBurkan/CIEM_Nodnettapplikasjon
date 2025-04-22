using System.Threading.Tasks;
using CIEM_Nodnettapplikasjon.Server.Database.Models.InfoControl;

namespace CIEM_Nodnettapplikasjon.Server.Database.Repositories.InfoControl
{
    public interface IInfoControlRepository
    {
        // This is only a temporary hard-coded solution, not suitable for proper implementation
        Task<List<InfoControlModel>> RetrieveInfoControl();
    }
}