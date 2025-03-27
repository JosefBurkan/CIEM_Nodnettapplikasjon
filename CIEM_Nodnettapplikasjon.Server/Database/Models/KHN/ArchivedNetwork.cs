using System.ComponentModel.DataAnnotations.Schema;

public class ArchivedNetwork
{
    public long id { get; set; }
    public string name { get; set; }

    [Column("created_at")] 
    public DateTime CreatedAt { get; set; }
}
