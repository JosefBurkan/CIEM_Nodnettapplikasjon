using Microsoft.AspNetCore.Mvc;
using CIEM_Nodnettapplikasjon.Server.Database.Models.Actors;
using CIEM_Nodnettapplikasjon.Server.Database.Repositories.Actors;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace CIEM_Nodnettapplikasjon.Server.Controllers
{

    // This controller handles API requests for actors and retrieves data from the "Actor" table.
    [ApiController]
    [Route("api/[controller]")] // Route base: api/actor
    public class ActorController : ControllerBase
    {
        private readonly IActorRepository _actorRepository;

        public ActorController(IActorRepository actorRepository)
        {
            _actorRepository = actorRepository;
        }

        // Retrieves all actors in the database as a list
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ActorModel>>> GetActors()
        {
            var actors = await _actorRepository.GetAllActorsAsync();
            return Ok(actors);
        }


        // Retrieves a single actor by ID
        [HttpGet("{id}")]
        public async Task<ActionResult<ActorModel>> GetActor(int id)
        {
            var actor = await _actorRepository.GetActorByIdAsync(id);
            if (actor == null)
                return NotFound();
            return Ok(actor);
        }


        // Creates a new actor using input data from the frontend
        [HttpPost("CreateActor")]
        public async Task<ActionResult<ActorModel>> CreateActor([FromBody] ActorModel newActor)
        {
            await _actorRepository.CreateActorAsync(newActor);
            return CreatedAtAction(nameof(GetActor), new { id = newActor.Id }, newActor);
        }

        // Adds a subactor to an exisiting actor by ID using input data from the frontend
        [HttpPost("CreateSubActor")]
        public async Task<ActionResult> CreateSubActor([FromBody] AddSubActor newSubActor)
        {
            // Assign the subactor to the correct actor
            var updatedActor = await _actorRepository.CreateSubActorAsync(newSubActor.ActorID, newSubActor.SubActor);

            if (updatedActor == null)
            {
                return NotFound($"Actor with ID {newSubActor.ActorID} not found.");
            }

            return Ok(updatedActor);
        }

        // Deletes an actor by ID
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteActor(int id)
        {
            await _actorRepository.DeleteActorAsync(id);
            return NoContent();
        }
    }
}