using System.Threading.Tasks;
using CIEM_Nodnettapplikasjon.Server.Database.Models.QRCode;

namespace CIEM_Nodnettapplikasjon.Server.Database.Repositories.QRCode
{
    // Interface that defines the contract for QRcode-related operations
    public interface IQRCodeRepository
    {
        // Asynchronously adds a new node based on the provided QRNodeDto
        Task<IActionResult> AddNode(QRNodeDto dto);
    }
}