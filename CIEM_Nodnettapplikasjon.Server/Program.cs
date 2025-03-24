using CIEM_Nodnettapplikasjon.Server.Services.Users;
using CIEM_Nodnettapplikasjon.Server.Repositories.Users;
using CIEM_Nodnettapplikasjon.Server.Database.Repositories.Actors;
using Microsoft.EntityFrameworkCore;
using Npgsql.EntityFrameworkCore.PostgreSQL;
using Microsoft.Extensions.FileProviders;
using CIEM_Nodnettapplikasjon.Server.EmkoreHub;

var builder = WebApplication.CreateBuilder(new WebApplicationOptions
{
    WebRootPath = null
});

// Add services to the container.
builder.Services.AddDbContext<ApplicationDbContext>(options => options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// Scoped services
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IActorRepository, ActorRepository>();

// Cors setup
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("https://localhost:5173")
              .AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials();
    });
});

builder.Services.AddControllers();

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddSignalR();

var app = builder.Build();


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
app.UseRouting(); 
app.UseCors("AllowFrontend");  // Allow frontend and backend to work together
app.UseAuthorization();

app.UseWebSockets();

app.MapControllers();

//app.MapHub<EmkoreHub>("/emkoreHub");

// Test endpoint
app.MapGet("/", () => "Hello, backend is running!");

app.Run();