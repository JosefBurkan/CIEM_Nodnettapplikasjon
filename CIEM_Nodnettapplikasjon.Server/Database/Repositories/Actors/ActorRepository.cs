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

        // Retrieves all actors from the database
        public async Task<IEnumerable<ActorModel>> GetAllActorsAsync()
        {
            return await _context.Actors.ToListAsync();
        }

        // Retrieves a single actor by ID 
        public async Task<ActorModel> GetActorByIdAsync(int id)
        {
            return await _context.Actors.FindAsync(id);
        }

        // Adds a new actor to the database
        public async Task<ActorModel> CreateActorAsync(ActorModel newActor)
        {
            _context.Actors.Add(newActor);
            await _context.SaveChangesAsync();
            return newActor;
        }

        // Adds a new sub-actor (string) to an existing actor's SubActors list
        public async Task<ActorModel> CreateSubActorAsync(int actorID, string newSubActor) 
        {
            var actor = await GetActorByIdAsync(actorID);

            actor.SubActors.Add(newSubActor);

            await _context.SaveChangesAsync();

            return actor;

        }

        // Deletes an actor by ID if it exists in the database
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
