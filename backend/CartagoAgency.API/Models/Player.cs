namespace CartagoAgency.API.Models;

public class Player
{
    public int Id { get; set; }
    public string FullName { get; set; } = "";
    public string Slug { get; set; } = "";
    public DateOnly DateOfBirth { get; set; }
    public string Nationality { get; set; } = "";
    public int Height { get; set; }
    public int Weight { get; set; }
    public string Position { get; set; } = "";
    public string StrongFoot { get; set; } = "";
    public string CurrentClub { get; set; } = "";
    public string ContractStatus { get; set; } = "";
    public int MatchesPlayed { get; set; }
    public int Goals { get; set; }
    public int Assists { get; set; }
    public int MinutesPlayed { get; set; }
    public string? VideoUrl { get; set; }
    public string? TechnicalReportUrl { get; set; }
    public string PhotoUrl { get; set; } = "";
    public bool IsFeatured { get; set; }
    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
