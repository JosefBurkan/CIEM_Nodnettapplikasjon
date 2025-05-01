namespace CIEM_Nodnettapplikasjon.Server.Database.Models.NodeNetworks
{
    // DTO for creating a new node
    public class NodeDto
    {
        public string Name { get; set; }
        public string Phone { get; set; }
        public string Beskrivelse { get; set; }
        public int? ParentID { get; set; }
        public int NetworkID { get; set; }
        public string Category { get; set; }
        public string Type { get; set; }
        public string HierarchyLevel { get; set; }
    }
}
