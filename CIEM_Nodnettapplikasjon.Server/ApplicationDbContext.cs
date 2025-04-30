using Npgsql.EntityFrameworkCore.PostgreSQL;
using Microsoft.EntityFrameworkCore;
using CIEM_Nodnettapplikasjon.Server.Database.Models.Users;
using CIEM_Nodnettapplikasjon.Server.Database.Models.Actors;
using CIEM_Nodnettapplikasjon.Server.Database.Models.Nodes;
using CIEM_Nodnettapplikasjon.Server.Database.Models.InfoPanel;
using CIEM_Nodnettapplikasjon.Server.Database;
using CIEM_Nodnettapplikasjon.Server.Database.Models.NodeNetworks;

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
    public DbSet<InfoPanelModel> InfoPanels { get; set; }

}