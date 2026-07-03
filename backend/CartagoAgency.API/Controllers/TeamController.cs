using CartagoAgency.API.Data;
using CartagoAgency.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CartagoAgency.API.Controllers;

[ApiController]
[Route("api/team")]
public class TeamController(AppDbContext db) : ControllerBase
{

    [HttpGet]
    public async Task<ActionResult<IEnumerable<TeamMember>>> GetAll()
    {
        return Ok(await db.TeamMembers.Where(x => x.IsActive).OrderBy(x => x.DisplayOrder).ToListAsync());
    }

    [HttpGet("contacts")]
    public async Task<ActionResult<IEnumerable<TeamMember>>> GetContacts()
    {
        return Ok(await db.TeamMembers.Where(x => x.IsActive).OrderBy(x => x.DisplayOrder).ToListAsync());
    }


    [Authorize]
    [HttpGet("admin")]
    public async Task<ActionResult<IEnumerable<TeamMember>>> GetAdmin()
    {
        return Ok(await db.TeamMembers.OrderBy(x => x.DisplayOrder).ToListAsync());
    }

    [Authorize]
    [HttpGet("admin/{id:int}")]
    public async Task<ActionResult<TeamMember>> GetById(int id)
    {
        var entity = await db.TeamMembers.FindAsync(id);
        return entity is null ? NotFound() : Ok(entity);
    }

    [Authorize]
    [HttpPost("admin")]
    public async Task<ActionResult<TeamMember>> Create(TeamMember entity)
    {
        db.TeamMembers.Add(entity);
        await db.SaveChangesAsync();
        return Ok(entity);
    }

    [Authorize]
    [HttpPut("admin/{id:int}")]
    public async Task<IActionResult> Update(int id, TeamMember entity)
    {
        if (id != entity.Id) entity.Id = id;
        db.Entry(entity).State = EntityState.Modified;
        await db.SaveChangesAsync();
        return NoContent();
    }

    [Authorize]
    [HttpDelete("admin/{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var entity = await db.TeamMembers.FindAsync(id);
        if (entity is null) return NotFound();
        db.TeamMembers.Remove(entity);
        await db.SaveChangesAsync();
        return NoContent();
    }
}
