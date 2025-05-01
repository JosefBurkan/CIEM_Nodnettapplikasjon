namespace CIEM_Nodnettapplikasjon.Server.Database.Models.Actors
{
    // This is the model for the "Actor" table
    public class ActorModel
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Category { get; set; } // Private, frivillige or statlige
        public string ActorType { get; set; } // For filtering - Selvstendig eller organisasjon
        public List<string>? SubActors { get; set; }
        public string? Description { get; set; }
    }

    // THis is a DTO for adding a sub actor to an existing actor
    public class AddSubActor
    {
        public int ActorID { get; set; }
        public string SubActor { get; set; } = null!;
    }
}
