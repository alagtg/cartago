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
[Route("api/player-applications")]
public class PlayerApplicationsController(AppDbContext db, EmailNotificationService emails) : ControllerBase
{
    [HttpPost]
    public async Task<ActionResult<PlayerApplication>> Create(PlayerApplication entity)
    {
        if (string.IsNullOrWhiteSpace(entity.Email))
        {
            return BadRequest(new { message = "Veuillez connecter votre compte Google." });
        }

        entity.Id = 0;
        entity.Status = "New";
        entity.CreatedAt = DateTime.UtcNow;

        db.PlayerApplications.Add(entity);
        await db.SaveChangesAsync();

        try
        {
            await emails.SendAsync(
                $"New player application — {entity.FullName}",
                $@"
<h2>New Player Application</h2>
<p><b>Email:</b> {WebUtility.HtmlEncode(entity.Email)}</p>
<p><b>Name:</b> {WebUtility.HtmlEncode(entity.FullName)}</p>
<p><b>Nationality:</b> {WebUtility.HtmlEncode(entity.Nationality)}</p>
<p><b>Position:</b> {WebUtility.HtmlEncode(entity.Position)}</p>
<p><b>Current Club:</b> {WebUtility.HtmlEncode(entity.CurrentClub)}</p>
<p><b>Phone:</b> {WebUtility.HtmlEncode(entity.PhoneNumber)}</p>
<p><b>Strong Foot:</b> {WebUtility.HtmlEncode(entity.StrongFoot)}</p>
<p><b>Contract Situation:</b> {WebUtility.HtmlEncode(entity.ContractSituation)}</p>
<p><b>Video:</b> {WebUtility.HtmlEncode(entity.VideoLink)}</p>
<p><b>Notes:</b><br/>{WebUtility.HtmlEncode(entity.AdditionalNotes)}</p>");
        }
        catch { }

        return Ok(entity);
    }

    [Authorize]
    [HttpGet("admin")]
    public async Task<ActionResult<IEnumerable<PlayerApplication>>> GetAdmin()
    {
        return Ok(await db.PlayerApplications.OrderByDescending(x => x.CreatedAt).ToListAsync());
    }

    [Authorize]
    [HttpGet("admin/{id:int}")]
    public async Task<ActionResult<PlayerApplication>> GetById(int id)
    {
        var entity = await db.PlayerApplications.FindAsync(id);
        return entity is null ? NotFound() : Ok(entity);
    }

    [Authorize]
    [HttpPut("admin/{id:int}/status")]
    public async Task<IActionResult> UpdateStatus(int id, StatusUpdateDto dto)
    {
        var entity = await db.PlayerApplications.FindAsync(id);
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
        var entity = await db.PlayerApplications.FindAsync(id);
        if (entity is null) return NotFound();

        db.PlayerApplications.Remove(entity);
        await db.SaveChangesAsync();

        return NoContent();
    }
}