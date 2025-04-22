using CIEM_Nodnettapplikasjon.Server.Database.Models.SamvirkeNettverk;
using CIEM_Nodnettapplikasjon.Server.Database.Models.Nodes;
using System.Threading.Tasks;

namespace CIEM_Nodnettapplikasjon.Server.Database.Repositories.SamvirkeNettverk
{
    public interface INodeRepository
    {
        Task<NodesModel> AddNodeAsync(NodeDto dto);
        Task<NodesModel> SaveNodeConnection(int selectedNodeID, int connectionIDs);
    }
}
