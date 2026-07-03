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
        entity.Id = 0;
        entity.Status = "New";
        entity.CreatedAt = DateTime.UtcNow;

        db.ClubRequests.Add(entity);
        await db.SaveChangesAsync();

        await emails.SendAsync(
            $"New club request — {entity.ClubName}",
            $"<h2>New Club Request</h2><p><b>Club:</b> {entity.ClubName}</p><p><b>Country:</b> {entity.Country}</p><p><b>Manager:</b> {entity.RecruitmentManager}</p><p><b>Email:</b> {entity.Email}</p><p><b>Phone:</b> {entity.PhoneNumber}</p><p><b>Target Profile:</b> {entity.TargetProfile}</p><p><b>Budget:</b> {entity.EstimatedBudget}</p><p><b>Contract Duration:</b> {entity.ContractDuration}</p><p><b>Details:</b><br/>{entity.AdditionalDetails}</p>");

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
