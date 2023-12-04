﻿using Microsoft.AspNetCore.Mvc;
using OneStopShopIdaBackend.Models;
using OneStopShopIdaBackend.Services;

namespace OneStopShopIdaBackend.Controllers;

[Route("lunch/recurring")]
[ApiController]
public class LunchRecurringItemsController : CustomControllerBase
{
    private readonly ILogger<LunchRecurringItemsController> _logger;
    private readonly IDatabaseService _databaseService;

    private const string _lunchEmailAddress = "grzegorz.malisz@weareida.digital";

    public LunchRecurringItemsController(ILogger<LunchRecurringItemsController> logger, IDatabaseService databaseService, IMicrosoftGraphApiService microsoftGraphApiService) : base(microsoftGraphApiService)
    {
        _logger = logger;
        _databaseService = databaseService;
    }

    private static string RegisterRecurringMessage(string officeName, string name, LunchRecurringItem lunchRecurringItem) =>
    "Hi,\n" +
    $"I would like to register for lunch at {officeName} Office on {lunchRecurringItem}.\n" +
    "Kind Regards,\n" +
    $"{name}";

    [HttpGet("get-registered-days")]
    public async Task<ActionResult<LunchRecurringItemFrontend>> GetRegisteredDays()
    {
        string accessToken = HttpContext.Session.GetString("accessToken");
        string microsoftId = (await ExecuteWithRetryMicrosoftGraphApi(_microsoftGraphApiService.GetMe, accessToken)).MicrosoftId;
        return new LunchRecurringItemFrontend(await _databaseService.GetRegisteredDays(microsoftId));
    }

    [HttpPut("update-registered-days")]
    public async Task<IActionResult> PutLunchRecurringItem(LunchRecurringItemFrontend lunchRecurringItemFrontend)
    {
        string accessToken = HttpContext.Session.GetString("accessToken");
        string microsoftId = (await ExecuteWithRetryMicrosoftGraphApi(_microsoftGraphApiService.GetMe, accessToken)).MicrosoftId;

        LunchRecurringItem lunchRecurringItem =
            new(microsoftId, lunchRecurringItemFrontend);
        await _databaseService.PutLunchRecurringItem(lunchRecurringItem);
        return NoContent();
    }

    //[HttpPost("create-lunch-recurring")]
    //public async Task<IActionResult> PostLunchRecurringItem(string microsoftId)
    //{
    //        string accessToken = HttpContext.Session.GetString("accessToken");
    //        string microsoftId = (await ExecuteWithRetryMicrosoftGraphApi(async (accessToken) => await _microsoftGraphApiService.GetMe(accessToken), accessToken)).MicrosoftId;
    //
    //        await _databaseService.PostLunchRecurringItem(microsoftId);
    //        return NoContent();
    //}

    [HttpPut("register-for-lunch-recurring")]
    public async Task<IActionResult> PutLunchRecurringRegistrationItem([FromQuery] string officeName)
    {
        string accessToken = HttpContext.Session.GetString("accessToken");
        string microsoftId = (await ExecuteWithRetryMicrosoftGraphApi(_microsoftGraphApiService.GetMe, accessToken)).MicrosoftId;

        var user = await _microsoftGraphApiService.GetMe(accessToken);

        LunchRecurringItem lunchRecurringItem = await _databaseService.GetRegisteredDays(microsoftId);

        string message = RegisterRecurringMessage(officeName, $"{user.FirstName} {user.Surname}", lunchRecurringItem);

        await _microsoftGraphApiService.SendEmail(accessToken, _lunchEmailAddress, "Lunch Registration", message);

        LunchRecurringRegistrationItem lunchRecurringRegistrationItem = new() { MicrosoftId = microsoftId, LastRegistered = DateTime.Now };
        await _databaseService.PutLunchRecurringRegistrationItem(lunchRecurringRegistrationItem);
        return NoContent();
    }
}