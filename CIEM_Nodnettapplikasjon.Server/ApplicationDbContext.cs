using Npgsql.EntityFrameworkCore.PostgreSQL;
using Microsoft.EntityFrameworkCore;
using CIEM_Nodnettapplikasjon.Server.Models.Users;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    // Add DbSets for tables here (Example: Users table)
    public DbSet<UserModel> Users { get; set; }


}