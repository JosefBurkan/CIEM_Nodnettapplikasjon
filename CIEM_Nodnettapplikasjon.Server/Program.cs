using CIEM_Nodnettapplikasjon.Server.Services;
using CIEM_Nodnettapplikasjon.Server.Repositories;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.


// Configure Database Connection
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseMySql(connectionString, new MySqlServerVersion(new Version(11, 6, 2))));

// Cors
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        policy => policy.WithOrigins("https://localhost:5173")
                        .AllowAnyMethod()
                        .AllowAnyHeader());
});
   

builder.Services.AddControllers();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IUserRepository, UserRepository>();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowFrontend"); // Allow frontend and backend to work together

app.UseHttpsRedirection();

app.UseRouting();

app.UseAuthorization();

app.UseDefaultFiles();

app.UseStaticFiles();

app.UseEndpoints(endpoints =>
{
    endpoints.MapControllers();
});

// Test endpoint
app.MapGet("/", () => "Hello, backend is running!");

// Fallback for frontend
app.MapFallbackToFile("/index.html");

app.Run();
