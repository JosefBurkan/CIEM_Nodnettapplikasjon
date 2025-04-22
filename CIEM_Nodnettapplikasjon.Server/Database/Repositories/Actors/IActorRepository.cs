using CIEM_Nodnettapplikasjon.Server.Database.Models.Actors;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace CIEM_Nodnettapplikasjon.Server.Database.Repositories.Actors
{
    public interface IActorRepository
    {
        // Retrieves a list of all actors from the database
        Task<IEnumerable<ActorModel>> GetAllActorsAsync();

        // Retrives a specific actor by their ID
        Task<ActorModel> GetActorByIdAsync(int id);

        // Creates a new actor
        Task<ActorModel> CreateActorAsync(ActorModel newActor);

        // Adds a sub actor to an existing one
        Task<ActorModel> CreateSubActorAsync(int actorID, string newSubActor);

        // Deletes an actor by ID
        Task DeleteActorAsync(int id);
    
    }
}
