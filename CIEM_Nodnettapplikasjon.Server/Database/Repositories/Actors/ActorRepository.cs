using CIEM_Nodnettapplikasjon.Server.Database.Models.Actors;
using CIEM_Nodnettapplikasjon.Server.Database;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace CIEM_Nodnettapplikasjon.Server.Database.Repositories.Actors
{
    public class ActorRepository : IActorRepository
    {
        private readonly ApplicationDbContext _context;

        public ActorRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<ActorModel>> GetAllActorsAsync()
        {
            return await _context.Actors.ToListAsync();
        }

        public async Task<ActorModel> GetActorByIdAsync(int id)
        {
            return await _context.Actors.FindAsync(id);
        }

        public async Task<ActorModel> CreateActorAsync(ActorModel newActor)
        {
            _context.Actors.Add(newActor);
            await _context.SaveChangesAsync();
            return newActor;
        }

        public async Task DeleteActorAsync(int id)
        {
            var actor = await _context.Actors.FindAsync(id);
            if (actor != null)
            {
                _context.Actors.Remove(actor);
                await _context.SaveChangesAsync();
            }
        }
    }
}
