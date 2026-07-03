namespace CartagoAgency.API.Models;

public class PlayerApplication
{
    public int Id { get; set; }
    public string FullName { get; set; } = "";
    public DateOnly DateOfBirth { get; set; }
    public string Nationality { get; set; } = "";
    public string Position { get; set; } = "";
    public string StrongFoot { get; set; } = "";
    public int Height { get; set; }
    public int Weight { get; set; }
    public string CurrentClub { get; set; } = "";
    public string ContractSituation { get; set; } = "";
    public string VideoLink { get; set; } = "";
    public string PhoneNumber { get; set; } = "";
    public string Email { get; set; } = "";
    public string AdditionalNotes { get; set; } = "";
    public string Status { get; set; } = "New";
    public string? AdminNote { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
