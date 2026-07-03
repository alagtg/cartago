using CartagoAgency.API.Data;
using CartagoAgency.API.DTOs;
using CartagoAgency.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CartagoAgency.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController(AppDbContext db, TokenService tokens) : ControllerBase
{
    [HttpPost("login")]
    public async Task<ActionResult<LoginResponseDto>> Login(LoginRequestDto request)
    {
        var user = await db.Users.FirstOrDefaultAsync(x => x.Email == request.Email && x.IsActive);
        if (user is null) return Unauthorized();

        var hasher = new PasswordHasher<CartagoAgency.API.Models.User>();
        var result = hasher.VerifyHashedPassword(user, user.PasswordHash, request.Password);
        if (result == PasswordVerificationResult.Failed) return Unauthorized();

        return Ok(new LoginResponseDto
        {
            Token = tokens.Create(user),
            FullName = user.FullName,
            Role = user.Role,
            Email = user.Email
        });
    }

    [Authorize]
    [HttpGet("me")]
    public IActionResult Me()
    {
        return Ok(new
        {
            FullName = User.Identity?.Name,
            Email = User.Claims.FirstOrDefault(c => c.Type.EndsWith("emailaddress"))?.Value,
            Role = User.Claims.FirstOrDefault(c => c.Type.EndsWith("role"))?.Value
        });
    }
}
