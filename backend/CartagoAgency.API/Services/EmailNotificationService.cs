using System.Net;
using System.Net.Mail;
using CartagoAgency.API.Options;
using Microsoft.Extensions.Options;

namespace CartagoAgency.API.Services;

public class EmailNotificationService(IOptions<SmtpSettings> smtpOptions, ILogger<EmailNotificationService> logger)
{
    private readonly SmtpSettings _settings = smtpOptions.Value;
    private readonly ILogger<EmailNotificationService> _logger = logger;

    public async Task SendAsync(string subject, string htmlBody)
    {
        if (string.IsNullOrWhiteSpace(_settings.Host) || string.IsNullOrWhiteSpace(_settings.NotificationEmail) || string.IsNullOrWhiteSpace(_settings.FromEmail))
        {
            _logger.LogInformation("SMTP not configured. Skipping email notification for subject {Subject}", subject);
            return;
        }

        try
        {
            using var message = new MailMessage
            {
                From = new MailAddress(_settings.FromEmail, _settings.FromName),
                Subject = subject,
                Body = htmlBody,
                IsBodyHtml = true
            };
            message.To.Add(_settings.NotificationEmail);

            using var client = new SmtpClient(_settings.Host, _settings.Port)
            {
                EnableSsl = _settings.EnableSsl,
                DeliveryMethod = SmtpDeliveryMethod.Network,
                UseDefaultCredentials = false,
                Credentials = string.IsNullOrWhiteSpace(_settings.Username)
                    ? CredentialCache.DefaultNetworkCredentials
                    : new NetworkCredential(_settings.Username, _settings.Password)
            };

            await client.SendMailAsync(message);
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Unable to send email notification for subject {Subject}", subject);
        }
    }
}
