namespace CIEM_Nodnettapplikasjon.Server.Database.Models.NodeNetworks
{
    public class QRNodeDto
    {
        public string Name { get; set; }
        public string Phone { get; set; }
        public int ParentId { get; set; }
        public string Token { get; set; }
        public string Beskrivelse { get; set; }
    }
}
