namespace CIEM_Nodnettapplikasjon.Server.Database.Models.Actors
{
    public class ActorModel
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Category { get; set; } // Private, frivillige or statlige
        public string ActorType { get; set; } // For filtering - Selvstendig eller organisasjon
        public List<string>? SubActors { get; set; }
        public string? Description { get; set; }
    }

        public class AddSubActor
    {
        public int ActorID { get; set; }
        public string SubActor { get; set; } = null!;
    }
}
