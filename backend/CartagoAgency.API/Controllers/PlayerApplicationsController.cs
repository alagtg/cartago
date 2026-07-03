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
        entity.Id = 0;
        entity.Status = "New";
        entity.CreatedAt = DateTime.UtcNow;

        db.PlayerApplications.Add(entity);
        await db.SaveChangesAsync();

        await emails.SendAsync(
            $"New player application — {entity.FullName}",
            $"<h2>New Player Application</h2><p><b>Name:</b> {entity.FullName}</p><p><b>Nationality:</b> {entity.Nationality}</p><p><b>Position:</b> {entity.Position}</p><p><b>Current Club:</b> {entity.CurrentClub}</p><p><b>Email:</b> {entity.Email}</p><p><b>Phone:</b> {entity.PhoneNumber}</p><p><b>Strong Foot:</b> {entity.StrongFoot}</p><p><b>Contract Situation:</b> {entity.ContractSituation}</p><p><b>Video:</b> {entity.VideoLink}</p><p><b>Notes:</b><br/>{entity.AdditionalNotes}</p>");

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
