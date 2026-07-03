using CartagoAgency.API.Data;
using CartagoAgency.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CartagoAgency.API.Controllers;

[ApiController]
[Route("api/settings")]
public class SettingsController(AppDbContext db) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IEnumerable<SiteSetting>>> GetPublic()
    {
        return Ok(await db.SiteSettings.OrderBy(x => x.Key).ToListAsync());
    }

    [Authorize]
    [HttpGet("admin")]
    public async Task<ActionResult<IEnumerable<SiteSetting>>> GetAdmin()
    {
        return Ok(await db.SiteSettings.OrderBy(x => x.Key).ToListAsync());
    }

    [Authorize]
    [HttpPut("admin")]
    public async Task<IActionResult> Save(IEnumerable<SiteSetting> settings)
    {
        var existing = await db.SiteSettings.ToListAsync();
        db.SiteSettings.RemoveRange(existing);
        await db.SaveChangesAsync();

        await db.SiteSettings.AddRangeAsync(settings.Select(s => new SiteSetting { Key = s.Key, Value = s.Value }));
        await db.SaveChangesAsync();
        return NoContent();
    }
}
