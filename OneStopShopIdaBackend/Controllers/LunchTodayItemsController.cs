﻿using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OneStopShopIdaBackend.Models;
using OneStopShopIdaBackend.Services;

namespace OneStopShopIdaBackend.Controllers;

[Route("lunch/today")]
[ApiController]
public class LunchTodayItemsController : ControllerBase
{
    private readonly ILogger<LunchTodayItemsController> _logger;
    private readonly MicrosoftGraphAPIService _microsoftGraphApiService;
    private readonly DatabaseService _databaseService;

    private static string RegisterTodayMessage (string officeName, string name) =>
        "Hi,\n" +
        $"I would like to register for today's lunch at {officeName} Office.\n" +
        "Kind Regards,\n" +
        $"{name}";

    public LunchTodayItemsController(ILogger<LunchTodayItemsController> logger,
        MicrosoftGraphAPIService microsoftGraphApiService, DatabaseService databaseService)
    {
        _logger = logger;
        _databaseService = databaseService;
        _microsoftGraphApiService = microsoftGraphApiService;
    }

    [HttpGet("is-registered")]
    public async Task<ActionResult<bool>> GetLunchTodayIsRegistered()
    {
        try
        {
            return await _databaseService.GetLunchTodayIsRegistered(HttpContext.Session.GetString("microsoftId"));
        }
        catch (InvalidOperationException ex)
        {
            _logger.LogError($"Error calling external API: {ex.Message}");
            return Conflict();
        }
        catch (KeyNotFoundException ex)
        {
            _logger.LogError($"Error calling external API: {ex.Message}");
            return NotFound();
        }
        catch (Exception ex)
        {
            _logger.LogError($"Error: {ex.Message}");
            return StatusCode(500, $"Internal Server Error \n {ex.Message}");
        }
    }

    [HttpPut("register-lunch-today")]
    public async Task<IActionResult> PutLunchTodayRegister([FromQuery] string officeName)
    {
        try
        {
            var user = await _microsoftGraphApiService.GetMe(HttpContext.Session.GetString("accessToken"));
            var response = await
                _microsoftGraphApiService.RegisterLunchToday(HttpContext.Session.GetString("accessToken"),
                    HttpContext.Session.GetString("microsoftId"), RegisterTodayMessage(officeName,  $"{user.FirstName} {user.Surname}"));

            if (response.IsSuccessStatusCode)
            {
                LunchTodayItem lunchTodayItem = new()
                {
                    MicrosoftId = HttpContext.Session.GetString("microsoftId"),
                    IsRegistered = true,
                };

                await _databaseService.PutLunchTodayRegister(lunchTodayItem);
            }

            return StatusCode((int)response.StatusCode);
        }
        catch (InvalidOperationException ex)
        {
            _logger.LogError($"Error calling external API: {ex.Message}");
            return Conflict();
        }
        catch (KeyNotFoundException ex)
        {
            _logger.LogError($"Error calling external API: {ex.Message}");
            return NotFound();
        }
        catch (Exception ex)
        {
            _logger.LogError($"Error: {ex.Message}");
            return StatusCode(500, $"Internal Server Error \n {ex.Message}");
        }
    }

    [HttpPost("create-is-registered/{microsoftId}")]
    public async Task<IActionResult> PostLunchTodayItem(string microsoftId)
    {
        try
        {
            await _databaseService.PostLunchTodayItem(microsoftId);
            return NoContent();
        }
        catch (InvalidOperationException ex)
        {
            _logger.LogError($"Error calling external API: {ex.Message}");
            return Conflict();
        }
        catch (KeyNotFoundException ex)
        {
            _logger.LogError($"Error calling external API: {ex.Message}");
            return NotFound();
        }
        catch (Exception ex)
        {
            _logger.LogError($"Error: {ex.Message}");
            return StatusCode(500, $"Internal Server Error \n {ex.Message}");
        }
    }

    [ApiExplorerSettings(IgnoreApi = true)]
    public async Task<IActionResult> UpdateAllLunchTodayItems(bool isRegistered)
    {
        try
        {
            await _databaseService.UpdateAllLunchTodayItems(isRegistered);
            return NoContent();
        }
        catch (InvalidOperationException ex)
        {
            _logger.LogError($"Error calling external API: {ex.Message}");
            return Conflict();
        }
        catch (KeyNotFoundException ex)
        {
            _logger.LogError($"Error calling external API: {ex.Message}");
            return NotFound();
        }
        catch (Exception ex)
        {
            _logger.LogError($"Error: {ex.Message}");
            return StatusCode(500, $"Internal Server Error \n {ex.Message}");
        }
    }
}