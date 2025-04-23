using Npgsql.EntityFrameworkCore.PostgreSQL;
using Microsoft.EntityFrameworkCore;
using CIEM_Nodnettapplikasjon.Server.Database.Models.Users;
using CIEM_Nodnettapplikasjon.Server.Database.Models.Actors;
using CIEM_Nodnettapplikasjon.Server.Database.Models.NodeNetworks;
using CIEM_Nodnettapplikasjon.Server.Database.Models.Nodes;
using CIEM_Nodnettapplikasjon.Server.Database.Models.Archive;
using CIEM_Nodnettapplikasjon.Server.Database.Models.InfoControl;
using CIEM_Nodnettapplikasjon.Server.Database;


public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public DbSet<UserModel> Users { get; set; }
    public DbSet<ActorModel> Actors { get; set; }
    public DbSet<NodeNetworksModel> NodeNetworks { get; set;}
    public DbSet<NodesModel> Nodes { get; set; }
    public DbSet<ArchivedNetworksModel> ArchivedNetworks { get; set; }
    public DbSet<InfoControlModel> InfoControl { get; set; }

}