using Microsoft.AspNetCore.Mvc;
using CIEM_Nodnettapplikasjon.Server.Database.Models.Actors;
using CIEM_Nodnettapplikasjon.Server.Database.Repositories.Actors;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace CIEM_Nodnettapplikasjon.Server.Controllers
{
    
    [ApiController]
    [Route("api/[controller]")] // Route base: api/actor
    public class ActorController : ControllerBase
    {
        private readonly IActorRepository _actorRepository;

        public ActorController(IActorRepository actorRepository)
        {
            _actorRepository = actorRepository;
        }

        // GET: api/actor (Retrieves all actors in the database)
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ActorModel>>> GetActors()
        {
            var actors = await _actorRepository.GetAllActorsAsync();
            return Ok(actors);
        }


        // GET: api/actor/id (Retrieves a single actor by ID)
        [HttpGet("{id}")]
        public async Task<ActionResult<ActorModel>> GetActor(int id)
        {
            var actor = await _actorRepository.GetActorByIdAsync(id);
            if (actor == null)
                return NotFound();
            return Ok(actor);
        }


        // POST: api/actor/CreateActor (Creates a new actor)
        [HttpPost("CreateActor")]
        public async Task<ActionResult<ActorModel>> CreateActor([FromBody] ActorModel newActor)
        {
            await _actorRepository.CreateActorAsync(newActor);
            return CreatedAtAction(nameof(GetActor), new { id = newActor.Id }, newActor);
        }

        // POST: api/actor/CreateSubActor (Adds a subactor to an exisiting actor by ID)
        [HttpPost("CreateSubActor")]
        public async Task<ActionResult> CreateSubActor([FromBody] AddSubActor newSubActor)
        {
            var updatedActor = await _actorRepository.CreateSubActorAsync(newSubActor.ActorID, newSubActor.SubActor);

            if (updatedActor == null)
            {
                return NotFound($"Actor with ID {newSubActor.ActorID} not found.");
            }

            return Ok(updatedActor);
        }

        // DELETE: api/actor/{id} (Deletes an actor by ID)
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteActor(int id)
        {
            await _actorRepository.DeleteActorAsync(id);
            return NoContent();
        }
    }
}