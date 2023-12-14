﻿using Microsoft.EntityFrameworkCore;
using OneStopShopIdaBackend.Models;

namespace OneStopShopIdaBackend.Services;

public partial class DatabaseService
{
    public async Task<List<DeskReservationItem>> GetDeskReservationForOfficeDate(string office, DateTime startDate,
        DateTime endDate)
    {
        IsDbSetNull("DeskReservation");

        var deskReservationItem = await DeskReservation
            .Where(e => e.Office == office && (e.Date >= startDate && e.Date <= endDate)).ToListAsync();

        if (deskReservationItem == null)
        {
            throw new KeyNotFoundException();
        }

        return deskReservationItem;
    }

    public async Task<List<DeskReservationItem>> GetDeskReservationsOfUser(string microsoftId, string office,
        DateTime startDate, DateTime endDate)
    {
        IsDbSetNull("DeskReservation");

        var deskReservationItem = await DeskReservation
            .Where(e => e.MicrosoftId == microsoftId && e.Office == office &&
                        (e.Date >= startDate && e.Date <= endDate)).ToListAsync();

        return deskReservationItem;
    }

    public async Task PutDeskReservation(DeskReservationItem deskReservationItem)
    {
        IsDbSetNull("DeskReservation");

        if (!DeskReservationItemExists(deskReservationItem.MicrosoftId))
        {
            throw new KeyNotFoundException();
        }

        Entry(deskReservationItem).State = EntityState.Modified;

        await SaveChangesAsync();
    }

    public async Task PostDeskReservations(List<DeskReservationItem> deskReservationItems)
    {
        IsDbSetNull("DeskReservation");

        foreach (var deskReservationItem in deskReservationItems)
        {
            DeskReservation.Add(deskReservationItem);
        }

        await SaveChangesAsync();
    }

    public async Task DeleteDeskReservations(List<DeskReservationItem> deskReservationItems)
    {
        IsDbSetNull("DeskReservation");

        foreach (var deskReservationItem in deskReservationItems)
        {
            DeskReservation.Remove(deskReservationItem);
        }

        await SaveChangesAsync();
    }

    private bool DeskReservationItemExists(string microsoftId)
    {
        return (DeskReservation?.Any(e => e.MicrosoftId == microsoftId)).GetValueOrDefault();
    }
}