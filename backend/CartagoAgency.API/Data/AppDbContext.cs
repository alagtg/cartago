using CartagoAgency.API.Models;
using Microsoft.EntityFrameworkCore;

namespace CartagoAgency.API.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<User> Users => Set<User>();
    public DbSet<Player> Players => Set<Player>();
    public DbSet<TeamMember> TeamMembers => Set<TeamMember>();
    public DbSet<AgencyService> AgencyServices => Set<AgencyService>();
    public DbSet<ContactMessage> ContactMessages => Set<ContactMessage>();
    public DbSet<ClubRequest> ClubRequests => Set<ClubRequest>();
    public DbSet<PlayerApplication> PlayerApplications => Set<PlayerApplication>();
    public DbSet<SiteSetting> SiteSettings => Set<SiteSetting>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Player>().HasIndex(x => x.Slug).IsUnique();
        modelBuilder.Entity<User>().HasIndex(x => x.Email).IsUnique();
        modelBuilder.Entity<SiteSetting>().HasIndex(x => x.Key).IsUnique();
    }
}
