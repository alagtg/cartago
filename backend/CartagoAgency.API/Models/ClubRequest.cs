namespace CartagoAgency.API.Models;

public class ClubRequest
{
    public int Id { get; set; }
    public string ClubName { get; set; } = "";
    public string Country { get; set; } = "";
    public string RecruitmentManager { get; set; } = "";
    public string Email { get; set; } = "";
    public string PhoneNumber { get; set; } = "";
    public string TargetProfile { get; set; } = "";
    public string EstimatedBudget { get; set; } = "";
    public string ContractDuration { get; set; } = "";
    public string AdditionalDetails { get; set; } = "";
    public string Status { get; set; } = "New";
    public string? AdminNote { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
