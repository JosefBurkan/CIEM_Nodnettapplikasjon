using Npgsql.EntityFrameworkCore.PostgreSQL;
using Microsoft.EntityFrameworkCore;
using CIEM_Nodnettapplikasjon.Server.Models.Users;
using CIEM_Nodnettapplikasjon.Server.Database.Models.Actors;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

 
    public DbSet<UserModel> Users { get; set; }
    public DbSet<ActorModel> Actors { get; set; }



}