using System.Threading.Tasks;
using CIEM_Nodnettapplikasjon.Server.Database.Models.InfoPanel;

namespace CIEM_Nodnettapplikasjon.Server.Database.Repositories.InfoPanel
{
    public interface IInfoPanelRepository
    {
        // This is only a temporary hard-coded solution, not suitable for proper implementation
        Task<List<InfoPanelModel>> RetrieveInfoPanel();
    }
}