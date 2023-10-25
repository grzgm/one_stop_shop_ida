using Microsoft.EntityFrameworkCore;
using OneStopShopIdaBackend.Models;
using OneStopShopIdaBackend.Services;

var builder = WebApplication.CreateBuilder(args);
var SlackClientSecret = builder.Configuration["Slack:SlackClientSecret"];
var SlackAccessToken = builder.Configuration["Slack:SlackAccessToken"];

// Add services to the container.
builder.Services.AddControllers();

// Add the CodeChallengeGeneratorService as a singleton service
builder.Services.AddSingleton<CodeChallengeGeneratorService>();

// Register HttpClient as a singleton service
builder.Services.AddHttpClient();

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDistributedMemoryCache();

// Enable and configure in-memory sessions
builder.Services.AddSession(options =>
{
    options.IdleTimeout = TimeSpan.FromMinutes(15);
    options.Cookie.HttpOnly = true;
    options.Cookie.IsEssential = true;
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Enable CORS
app.UseCors(builder => builder
    .WithOrigins("http://localhost:5173")
    .AllowCredentials()
    .AllowAnyHeader()
    .AllowAnyMethod());

app.UseHttpsRedirection();

app.UseAuthorization();

app.UseSession();

app.MapControllers();

app.Run();

public partial class Program { }