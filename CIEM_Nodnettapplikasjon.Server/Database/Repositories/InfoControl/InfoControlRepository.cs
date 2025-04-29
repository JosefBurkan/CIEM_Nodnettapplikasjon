using System.Threading.Tasks;
using CIEM_Nodnettapplikasjon.Server.Database.Models.InfoPanel;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;


namespace CIEM_Nodnettapplikasjon.Server.Database.Repositories.InfoPanel
{

    public class InfoPanelRepository : IInfoPanelRepository
    {
        private readonly ApplicationDbContext _context;

        public InfoPanelRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        // This is only a temporary hard-coded solution, not suitable for proper implementation
        public async Task<List<InfoPanelModel>> RetrieveInfoPanel() 
        {
            return await _context.InfoPanels.ToListAsync();
        }
    }
}