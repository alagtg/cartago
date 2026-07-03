using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using CartagoAgency.API.Models;
using Microsoft.IdentityModel.Tokens;

namespace CartagoAgency.API.Services;

public class TokenService(IConfiguration configuration)
{
    public string Create(User user)
    {
        var key = configuration["Jwt:Key"] ?? throw new InvalidOperationException("Missing JWT key");
        var credentials = new SigningCredentials(
            new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key)),
            SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Name, user.FullName),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(ClaimTypes.Role, user.Role)
        };

        var token = new JwtSecurityToken(
            issuer: configuration["Jwt:Issuer"],
            audience: configuration["Jwt:Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddDays(7),
            signingCredentials: credentials);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
