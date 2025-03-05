using CIEM_Nodnettapplikasjon.Server.Services.Users;
using CIEM_Nodnettapplikasjon.Server.Repositories.Users;
using Microsoft.EntityFrameworkCore;
using Pomelo.EntityFrameworkCore.MySql.Extensions;
using Microsoft.Extensions.FileProviders;

var builder = WebApplication.CreateBuilder(new WebApplicationOptions
{
    WebRootPath = null
});

// Add services to the container.
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

// Configure Database Connection
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseMySql(connectionString, new MySqlServerVersion(new Version(8, 0, 2))));

// Scoped services
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IUserService, UserService>();

// Cors setup
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("https://localhost:5173")
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

builder.Services.AddControllers();

builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IUserRepository, UserRepository>();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();  // build the application


// Database connection check
using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    Console.WriteLine($"Database Connection: {dbContext.Database.GetConnectionString()}");

    try
    {
        Console.WriteLine("Checking database connection...");
        dbContext.Database.OpenConnection();
        Console.WriteLine("Database connection successful!");
        dbContext.Database.CloseConnection();
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Database connection failed: {ex.Message}");
    }
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseRouting(); // <-- Add this before UseCors
app.UseCors("AllowFrontend");  // Allow frontend and backend to work together
app.UseAuthorization();

app.MapControllers();

// Test endpoint
app.MapGet("/", () => "Hello, backend is running!");

app.Run();