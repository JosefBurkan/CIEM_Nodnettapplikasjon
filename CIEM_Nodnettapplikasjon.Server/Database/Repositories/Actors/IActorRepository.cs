using CIEM_Nodnettapplikasjon.Server.Database.Models.Actors;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace CIEM_Nodnettapplikasjon.Server.Database.Repositories.Actors
{
    public interface IActorRepository
    {
        Task<IEnumerable<ActorModel>> GetAllActorsAsync();
        Task<ActorModel> GetActorByIdAsync(int id);
        Task<ActorModel> CreateActorAsync(ActorModel newActor);
        Task<ActorModel> CreateSubActorAsync(int actorID, string newSubActor);
        Task DeleteActorAsync(int id);
    
    }
}
