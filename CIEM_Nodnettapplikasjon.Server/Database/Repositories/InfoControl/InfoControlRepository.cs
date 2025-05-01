using System.Threading.Tasks;
using CIEM_Nodnettapplikasjon.Server.Database.Models.InfoPanel;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;


namespace CIEM_Nodnettapplikasjon.Server.Database.Repositories.InfoPanel
{
    // InfoPanelRepo handles the database operations, while implementing IInfoPanelRepo for infopanel-related operations
    public class InfoPanelRepository : IInfoPanelRepository
    {
        private readonly ApplicationDbContext _context;

        public InfoPanelRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        // Retrieves a list of all InfoPanelModel entries from the database asynchronously
        public async Task<List<InfoPanelModel>> RetrieveInfoPanel() 
        {
            // Fetches all info panels from the database and returns them as a list asynchronously
            return await _context.InfoPanels.ToListAsync();
        }
    }
}