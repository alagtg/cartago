namespace CartagoAgency.API.Options;

public class SmtpSettings
{
    public string Host { get; set; } = "";
    public int Port { get; set; } = 587;
    public string Username { get; set; } = "";
    public string Password { get; set; } = "";
    public string FromEmail { get; set; } = "";
    public string FromName { get; set; } = "Cartago Football Agency";
    public string NotificationEmail { get; set; } = "";
    public bool EnableSsl { get; set; } = true;
}
