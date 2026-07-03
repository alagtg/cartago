using System.Net;
using CartagoAgency.API.Data;
using CartagoAgency.API.DTOs;
using CartagoAgency.API.Models;
using CartagoAgency.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CartagoAgency.API.Controllers;

[ApiController]
[Route("api/club-requests")]
public class ClubRequestsController(AppDbContext db, EmailNotificationService emails) : ControllerBase
{
    [HttpPost]
    public async Task<ActionResult<ClubRequest>> Create(ClubRequest entity)
    {
        if (string.IsNullOrWhiteSpace(entity.Email))
        {
            return BadRequest(new { message = "Veuillez connecter votre compte Google." });
        }

        entity.Id = 0;
        entity.Status = "New";
        entity.CreatedAt = DateTime.UtcNow;

        db.ClubRequests.Add(entity);
        await db.SaveChangesAsync();

        try
        {
            await emails.SendAsync(
                $"New club request — {entity.ClubName}",
                $@"
<h2>New Club Request</h2>
<p><b>Email:</b> {WebUtility.HtmlEncode(entity.Email)}</p>
<p><b>Club:</b> {WebUtility.HtmlEncode(entity.ClubName)}</p>
<p><b>Country:</b> {WebUtility.HtmlEncode(entity.Country)}</p>
<p><b>Manager:</b> {WebUtility.HtmlEncode(entity.RecruitmentManager)}</p>
<p><b>Phone:</b> {WebUtility.HtmlEncode(entity.PhoneNumber)}</p>
<p><b>Target Profile:</b> {WebUtility.HtmlEncode(entity.TargetProfile)}</p>
<p><b>Budget:</b> {WebUtility.HtmlEncode(entity.EstimatedBudget)}</p>
<p><b>Contract Duration:</b> {WebUtility.HtmlEncode(entity.ContractDuration)}</p>
<p><b>Details:</b><br/>{WebUtility.HtmlEncode(entity.AdditionalDetails)}</p>");
        }
        catch { }

        return Ok(entity);
    }

    [Authorize]
    [HttpGet("admin")]
    public async Task<ActionResult<IEnumerable<ClubRequest>>> GetAdmin()
    {
        return Ok(await db.ClubRequests.OrderByDescending(x => x.CreatedAt).ToListAsync());
    }

    [Authorize]
    [HttpGet("admin/{id:int}")]
    public async Task<ActionResult<ClubRequest>> GetById(int id)
    {
        var entity = await db.ClubRequests.FindAsync(id);
        return entity is null ? NotFound() : Ok(entity);
    }

    [Authorize]
    [HttpPut("admin/{id:int}/status")]
    public async Task<IActionResult> UpdateStatus(int id, StatusUpdateDto dto)
    {
        var entity = await db.ClubRequests.FindAsync(id);
        if (entity is null) return NotFound();

        entity.Status = dto.Status;
        entity.AdminNote = dto.AdminNote;

        await db.SaveChangesAsync();
        return NoContent();
    }

    [Authorize]
    [HttpDelete("admin/{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var entity = await db.ClubRequests.FindAsync(id);
        if (entity is null) return NotFound();

        db.ClubRequests.Remove(entity);
        await db.SaveChangesAsync();

        return NoContent();
    }
}