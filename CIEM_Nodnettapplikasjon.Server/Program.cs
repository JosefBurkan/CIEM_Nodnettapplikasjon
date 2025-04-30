using CIEM_Nodnettapplikasjon.Server.Services.Users;
using CIEM_Nodnettapplikasjon.Server.Services.NodeNetworks;
using CIEM_Nodnettapplikasjon.Server.Database.Repositories.Users;
using CIEM_Nodnettapplikasjon.Server.Database.Repositories.Actors;
using CIEM_Nodnettapplikasjon.Server.Database.Repositories.NodeNetworks;
using CIEM_Nodnettapplikasjon.Server.Database.Repositories.NodeNetworks;
using CIEM_Nodnettapplikasjon.Server.Database.Repositories.InfoPanel;
using Microsoft.EntityFrameworkCore;
using Npgsql.EntityFrameworkCore.PostgreSQL;
using Microsoft.Extensions.FileProviders;
using System.Threading;

var builder = WebApplication.CreateBuilder(new WebApplicationOptions
{
    WebRootPath = null
});

// Add services to the container.
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// Scoped services
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IActorRepository, ActorRepository>();
builder.Services.AddScoped<INodeNetworkRepository, NodeNetworksRepository>();
builder.Services.AddScoped<INodeNetworksService, NodeNetworksService>();
builder.Services.AddScoped<INodeRepository, NodeRepository>();
builder.Services.AddScoped<IQRRepository, QRRepository>();
builder.Services.AddScoped<IInfoPanelRepository, InfoPanelRepository>();


// Cors setup
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("https://localhost:5173", "https://emkore.vercel.app")
              .AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials();
    });
});

builder.Services.AddControllers();

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Database connection check with retry logic
using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    Console.WriteLine($"Database Connection: {dbContext.Database.GetConnectionString()}");

    int maxRetries = 5;
    int retryDelayMilliseconds = 5000; // 5 seconds delay between retries
    int attempt = 0;
    bool connected = false;

    while (attempt < maxRetries && !connected)
    {
        try
        {
            Console.WriteLine($"Attempting to connect to the database (Attempt {attempt + 1}/{maxRetries})...");
            dbContext.Database.OpenConnection();
            Console.WriteLine("Database connection successful!");
            dbContext.Database.CloseConnection();
            connected = true;  // If connection is successful, exit the loop
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Database connection failed: {ex.Message}");
            attempt++;
            if (attempt < maxRetries)
            {
                Console.WriteLine($"Retrying in {retryDelayMilliseconds / 1000} seconds...");
                Thread.Sleep(retryDelayMilliseconds);  // Wait before retrying
            }
        }
    }

    if (!connected)
    {
        Console.WriteLine($"Database out of reach");
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

// Test endpoint
app.MapGet("/", () => "Hello, backend is running!");

app.Run();
