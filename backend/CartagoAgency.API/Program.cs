using System.Text;
using CartagoAgency.API.Data;
using CartagoAgency.API.Models;
using CartagoAgency.API.Services;
using CartagoAgency.API.Options;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers().AddJsonOptions(options =>
{
    options.JsonSerializerOptions.PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase;
});

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// PostgreSQL Neon
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

if (string.IsNullOrWhiteSpace(connectionString))
{
    throw new InvalidOperationException("Connection string 'DefaultConnection' is missing.");
}

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(connectionString));

builder.Services.Configure<EmailJsSettings>(builder.Configuration.GetSection("EmailJs"));
builder.Services.AddHttpClient<EmailNotificationService>();

var jwtKey = builder.Configuration["Jwt:Key"] ?? "CHANGE_THIS_TO_A_LONG_SECRET_KEY_123456789_CARTAGO";
var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = key
        };
    });

builder.Services.AddAuthorization();

// CORS pour Angular Netlify
builder.Services.AddCors(options =>
{
    options.AddPolicy("CartagoCors", policy =>
    {
        policy.WithOrigins(
            "http://localhost:4200",
            "https://joyful-cactus-004eef.netlify.app"
        )
        .AllowAnyHeader()
        .AllowAnyMethod();
    });
});
builder.Services.AddScoped<TokenService>();

var app = builder.Build();

// Création de la base + données par défaut
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();

    db.Database.Migrate();

    if (!db.Users.Any())
    {
        var admin = new User
        {
            FullName = "Cartago Admin",
            Email = "admin@cartagoagency.com",
            Role = "Admin",
            IsActive = true
        };

        admin.PasswordHash = new PasswordHasher<User>().HashPassword(admin, "Admin123!");
        db.Users.Add(admin);

        var players = Enumerable.Range(1, 30).Select(i => new Player
        {
            FullName = $"Player {i:00}",
            Slug = $"player-{i:00}",
            DateOfBirth = new DateOnly(1998 + (i % 6), (i % 12) + 1, ((i * 2) % 27) + 1),
            Nationality = i % 3 == 0 ? "Tunisia" : i % 3 == 1 ? "France" : "Morocco",
            Height = 172 + (i % 15),
            Weight = 67 + (i % 9),
            Position = i % 4 == 0 ? "Forward" : i % 4 == 1 ? "Midfielder" : i % 4 == 2 ? "Defender" : "Goalkeeper",
            StrongFoot = i % 2 == 0 ? "Right" : "Left",
            CurrentClub = i % 2 == 0 ? "Cartago Elite FC" : "Mediterranean Stars",
            ContractStatus = i % 2 == 0 ? "Under Contract" : "Available for Negotiation",
            MatchesPlayed = 18 + i,
            Goals = i % 9,
            Assists = i % 7,
            MinutesPlayed = 1300 + i * 45,
            VideoUrl = "https://www.youtube.com/",
            TechnicalReportUrl = "https://example.com/report.pdf",
            PhotoUrl = $"/assets/players/player-{((i - 1) % 12) + 1}.jpg",
            IsFeatured = i <= 6,
            IsActive = true
        });

        db.Players.AddRange(players);

        db.TeamMembers.AddRange(
            new TeamMember
            {
                FullName = "Lisa Chen",
                Role = "Head of Scouting",
                Bio = "Expert talent evaluator across European leagues with a strong analytical approach.",
                Email = "lisa.chen@cartagoagency.com",
                Phone = "+216 11 111 111",
                PhotoUrl = "/assets/team/team-1.jpg",
                DisplayOrder = 1,
                IsActive = true
            },
            new TeamMember
            {
                FullName = "Amine Ben Salah",
                Role = "Player Relations Director",
                Bio = "Supports players on contract strategy, communication and career management.",
                Email = "amine@cartagoagency.com",
                Phone = "+216 22 222 222",
                PhotoUrl = "/assets/team/team-2.jpg",
                DisplayOrder = 2,
                IsActive = true
            },
            new TeamMember
            {
                FullName = "Sara Martinez",
                Role = "International Partnerships",
                Bio = "Develops club relationships and coordinates strategic football opportunities abroad.",
                Email = "sara@cartagoagency.com",
                Phone = "+216 33 333 333",
                PhotoUrl = "/assets/team/team-3.jpg",
                DisplayOrder = 3,
                IsActive = true
            },
            new TeamMember
            {
                FullName = "Karim Haddad",
                Role = "Legal & Contracts Manager",
                Bio = "Handles negotiations, compliance and contract structuring for players and clubs.",
                Email = "karim@cartagoagency.com",
                Phone = "+216 44 444 444",
                PhotoUrl = "/assets/team/team-4.jpg",
                DisplayOrder = 4,
                IsActive = true
            }
        );

        db.AgencyServices.AddRange(
            new AgencyService
            {
                Title = "Career Management",
                Category = "Players",
                Description = "Long-term career planning, visibility and market positioning.",
                Icon = "star",
                DisplayOrder = 1,
                IsActive = true
            },
            new AgencyService
            {
                Title = "Contract Negotiation",
                Category = "Players",
                Description = "Negotiation and legal support for player contracts.",
                Icon = "file",
                DisplayOrder = 2,
                IsActive = true
            },
            new AgencyService
            {
                Title = "International Transfers",
                Category = "Players",
                Description = "Cross-border transfer strategy and opportunities.",
                Icon = "plane",
                DisplayOrder = 3,
                IsActive = true
            },
            new AgencyService
            {
                Title = "Talent Identification",
                Category = "Clubs",
                Description = "Scouting and filtering of matching player profiles.",
                Icon = "search",
                DisplayOrder = 4,
                IsActive = true
            },
            new AgencyService
            {
                Title = "Customized Scouting",
                Category = "Clubs",
                Description = "Custom scouting missions aligned to the club needs.",
                Icon = "radar",
                DisplayOrder = 5,
                IsActive = true
            },
            new AgencyService
            {
                Title = "Technical Reports",
                Category = "Clubs",
                Description = "Structured reports and profile recommendations.",
                Icon = "report",
                DisplayOrder = 6,
                IsActive = true
            }
        );

        db.SiteSettings.AddRange(
            new SiteSetting
            {
                Key = "heroSubtitle",
                Value = "Elite football representation with a premium global network."
            },
            new SiteSetting
            {
                Key = "vision",
                Value = "Become a global reference in football representation and talent development."
            },
            new SiteSetting
            {
                Key = "mission",
                Value = "Empower athletes through strategic career management, international exposure and professional excellence."
            }
        );

        db.SaveChanges();
    }
}

// Swagger activé aussi sur Render pour tester facilement
app.UseSwagger();
app.UseSwaggerUI();

app.UseCors("CartagoCors");
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// Important pour Render
var port = Environment.GetEnvironmentVariable("PORT") ?? "5099";
app.Run($"http://0.0.0.0:{port}");