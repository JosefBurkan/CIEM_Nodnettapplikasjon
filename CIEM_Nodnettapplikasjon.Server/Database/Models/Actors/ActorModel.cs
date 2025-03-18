namespace CIEM_Nodnettapplikasjon.Server.Database.Models.Actors
{
    public class ActorModel
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Category { get; set; }
        public string ActorType { get; set; } // For filtrering - Humam or company actor
        public List<string>? SubActors { get; set; }
    }
}
