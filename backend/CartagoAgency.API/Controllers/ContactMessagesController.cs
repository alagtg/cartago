using CartagoAgency.API.Data;
using CartagoAgency.API.DTOs;
using CartagoAgency.API.Models;
using CartagoAgency.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CartagoAgency.API.Controllers;

[ApiController]
[Route("api/contact-messages")]
public class ContactMessagesController(AppDbContext db, EmailNotificationService emails) : ControllerBase
{
    [HttpPost]
    public async Task<ActionResult<ContactMessage>> Create(ContactMessage entity)
    {
        entity.Id = 0;
        entity.Status = "Unread";
        entity.CreatedAt = DateTime.UtcNow;
        db.ContactMessages.Add(entity);
        await db.SaveChangesAsync();

        await emails.SendAsync(
            $"New contact message — {entity.Subject}",
            $"<h2>New Contact Message</h2><p><b>Name:</b> {entity.Name}</p><p><b>Email:</b> {entity.Email}</p><p><b>Subject:</b> {entity.Subject}</p><p><b>Message:</b><br/>{entity.Message}</p>");

        return Ok(entity);
    }

    [Authorize]
    [HttpGet("admin")]
    public async Task<ActionResult<IEnumerable<ContactMessage>>> GetAdmin()
    {
        return Ok(await db.ContactMessages.OrderByDescending(x => x.CreatedAt).ToListAsync());
    }

    [Authorize]
    [HttpGet("admin/{id:int}")]
    public async Task<ActionResult<ContactMessage>> GetById(int id)
    {
        var entity = await db.ContactMessages.FindAsync(id);
        return entity is null ? NotFound() : Ok(entity);
    }

    [Authorize]
    [HttpPut("admin/{id:int}/status")]
    public async Task<IActionResult> UpdateStatus(int id, StatusUpdateDto dto)
    {
        var entity = await db.ContactMessages.FindAsync(id);
        if (entity is null) return NotFound();
        entity.Status = dto.Status;
        await db.SaveChangesAsync();
        return NoContent();
    }

    [Authorize]
    [HttpDelete("admin/{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var entity = await db.ContactMessages.FindAsync(id);
        if (entity is null) return NotFound();
        db.ContactMessages.Remove(entity);
        await db.SaveChangesAsync();
        return NoContent();
    }
}
