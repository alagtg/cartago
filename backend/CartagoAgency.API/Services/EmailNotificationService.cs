using CartagoAgency.API.Options;
using Microsoft.Extensions.Options;

namespace CartagoAgency.API.Services;

public class EmailNotificationService(
    HttpClient httpClient,
    IOptions<EmailJsSettings> emailJsOptions,
    ILogger<EmailNotificationService> logger)
{
    private readonly EmailJsSettings _settings = emailJsOptions.Value;

    public async Task SendAsync(string subject, string htmlBody)
    {
        try
        {
            var payload = new
            {
                service_id = _settings.ServiceId,
                template_id = _settings.TemplateId,
                user_id = _settings.PublicKey,
                template_params = new
                {
                    subject,
                    html_body = htmlBody,
                    to_email = _settings.ToEmail,
                    from_name = "Cartago Website",
                    from_email = _settings.ToEmail
                }
            };

            using var cts = new CancellationTokenSource(TimeSpan.FromSeconds(8));

            var response = await httpClient.PostAsJsonAsync(
                "https://api.emailjs.com/api/v1.0/email/send",
                payload,
                cts.Token);

            if (!response.IsSuccessStatusCode)
            {
                var error = await response.Content.ReadAsStringAsync(cts.Token);
                logger.LogError("EmailJS failed. Status: {Status}. Error: {Error}", response.StatusCode, error);
            }
            else
            {
                logger.LogInformation("EmailJS sent successfully to {ToEmail}", _settings.ToEmail);
            }
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "EmailJS send failed.");
        }
    }
}