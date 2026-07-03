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
                accessToken = string.IsNullOrWhiteSpace(_settings.PrivateKey) ? null : _settings.PrivateKey,
                template_params = new
                {
                    subject,
                    html_body = htmlBody
                }
            };
            using var cts = new CancellationTokenSource(TimeSpan.FromSeconds(8));

            var response = await httpClient.PostAsJsonAsync(
                "https://api.emailjs.com/api/v1.0/email/send",
                payload,
                cts.Token);

            if (!response.IsSuccessStatusCode)
            {
                var error = await response.Content.ReadAsStringAsync();
                logger.LogWarning("EmailJS error: {Error}", error);
            }
        }
        catch (Exception ex)
        {
            logger.LogWarning(ex, "EmailJS send failed.");
        }
    }
}