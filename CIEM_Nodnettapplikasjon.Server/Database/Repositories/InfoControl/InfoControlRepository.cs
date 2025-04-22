using System.Threading.Tasks;
using CIEM_Nodnettapplikasjon.Server.Database.Models.InfoControl;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;


namespace CIEM_Nodnettapplikasjon.Server.Database.Repositories.InfoControl
{

    public class InfoControlRepository : IInfoControlRepository
    {
        private readonly ApplicationDbContext _context;

        public InfoControlRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        // This is only a temporary hard-coded solution, not suitable for proper implementation
        public async Task<List<InfoControlModel>> RetrieveInfoControl() 
        {
            return await _context.InfoControl.ToListAsync();
        }
    }
}