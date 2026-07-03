using CartagoAgency.API.Data;
using CartagoAgency.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CartagoAgency.API.Controllers;

[ApiController]
[Route("api/players")]
public class PlayersController(AppDbContext db) : ControllerBase
{

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Player>>> GetAll()
    {
        return Ok(await db.Players.Where(x => x.IsActive).OrderBy(x => x.FullName).ToListAsync());
    }

    [HttpGet("featured")]
    public async Task<ActionResult<IEnumerable<Player>>> GetFeatured()
    {
        return Ok(await db.Players.Where(x => x.IsActive && x.IsFeatured).OrderBy(x => x.FullName).ToListAsync());
    }

    [HttpGet("{slug}")]
    public async Task<ActionResult<Player>> GetBySlug(string slug)
    {
        var entity = await db.Players.FirstOrDefaultAsync(x => x.Slug == slug && x.IsActive);
        return entity is null ? NotFound() : Ok(entity);
    }


    [Authorize]
    [HttpGet("admin")]
    public async Task<ActionResult<IEnumerable<Player>>> GetAdmin()
    {
        return Ok(await db.Players.OrderBy(x => x.FullName).ToListAsync());
    }

    [Authorize]
    [HttpGet("admin/{id:int}")]
    public async Task<ActionResult<Player>> GetById(int id)
    {
        var entity = await db.Players.FindAsync(id);
        return entity is null ? NotFound() : Ok(entity);
    }

    [Authorize]
    [HttpPost("admin")]
    public async Task<ActionResult<Player>> Create(Player entity)
    {
        db.Players.Add(entity);
        await db.SaveChangesAsync();
        return Ok(entity);
    }

    [Authorize]
    [HttpPut("admin/{id:int}")]
    public async Task<IActionResult> Update(int id, Player entity)
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
        var entity = await db.Players.FindAsync(id);
        if (entity is null) return NotFound();
        db.Players.Remove(entity);
        await db.SaveChangesAsync();
        return NoContent();
    }
}
