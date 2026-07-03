namespace CartagoAgency.API.Models;

public class TeamMember
{
    public int Id { get; set; }
    public string FullName { get; set; } = "";
    public string Role { get; set; } = "";
    public string Bio { get; set; } = "";
    public string Email { get; set; } = "";
    public string Phone { get; set; } = "";
    public string PhotoUrl { get; set; } = "";
    public int DisplayOrder { get; set; } = 1;
    public bool IsActive { get; set; } = true;
}
