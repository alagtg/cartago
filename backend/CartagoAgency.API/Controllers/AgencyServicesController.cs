using CartagoAgency.API.Data;
using CartagoAgency.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CartagoAgency.API.Controllers;

[ApiController]
[Route("api/services")]
public class AgencyServicesController(AppDbContext db) : ControllerBase
{

    [HttpGet]
    public async Task<ActionResult<IEnumerable<AgencyService>>> GetAll()
    {
        return Ok(await db.AgencyServices.Where(x => x.IsActive).OrderBy(x => x.DisplayOrder).ToListAsync());
    }


    [Authorize]
    [HttpGet("admin")]
    public async Task<ActionResult<IEnumerable<AgencyService>>> GetAdmin()
    {
        return Ok(await db.AgencyServices.OrderBy(x => x.DisplayOrder).ToListAsync());
    }

    [Authorize]
    [HttpGet("admin/{id:int}")]
    public async Task<ActionResult<AgencyService>> GetById(int id)
    {
        var entity = await db.AgencyServices.FindAsync(id);
        return entity is null ? NotFound() : Ok(entity);
    }

    [Authorize]
    [HttpPost("admin")]
    public async Task<ActionResult<AgencyService>> Create(AgencyService entity)
    {
        db.AgencyServices.Add(entity);
        await db.SaveChangesAsync();
        return Ok(entity);
    }

    [Authorize]
    [HttpPut("admin/{id:int}")]
    public async Task<IActionResult> Update(int id, AgencyService entity)
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
        var entity = await db.AgencyServices.FindAsync(id);
        if (entity is null) return NotFound();
        db.AgencyServices.Remove(entity);
        await db.SaveChangesAsync();
        return NoContent();
    }
}
