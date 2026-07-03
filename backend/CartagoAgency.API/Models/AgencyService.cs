namespace CartagoAgency.API.Models;

public class AgencyService
{
    public int Id { get; set; }
    public string Title { get; set; } = "";
    public string Category { get; set; } = "";
    public string Description { get; set; } = "";
    public string Icon { get; set; } = "";
    public int DisplayOrder { get; set; } = 1;
    public bool IsActive { get; set; } = true;
}
