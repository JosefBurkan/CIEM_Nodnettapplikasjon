using CIEM_Nodnettapplikasjon.Server.Database.Models.SamvirkeNettverk;
using CIEM_Nodnettapplikasjon.Server.Database.Models.Nodes;
using System.Threading.Tasks;

namespace CIEM_Nodnettapplikasjon.Server.Database.Repositories.SamvirkeNettverk
{
    public interface IQRRepository
    {
        Task<NodesModel?> AddNodeViaQRAsync(QRNodeDto dto);
    }
}
