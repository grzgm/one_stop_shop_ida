export interface IOfficeInformationData {
  officeName: string;
  canReserveDesk: Boolean;
  canRegisterLunch: Boolean;
  canRegisterPresence: Boolean;
  officeInformation: {
    address: string;
    oppeningHours: string;
    accessInformation: string;
    parkingInformation: string;
    lunchInformation: string;
  };
}

export const officeInformationData: Record<string, IOfficeInformationData> = {
  Utrecht: {
    officeName: "Utrecht",
    canReserveDesk: true,
    canRegisterLunch: true,
    canRegisterPresence: true,
    officeInformation: {
      address: "Orteliuslaan 25 3528BA",
      oppeningHours: "6:00 - 21:30 working days",
      accessInformation:
        "You need a Creative Valley Papendorp access pass to enter the Creative Valley building and its Xplore Group office.",
      parkingInformation:
        "Xplore Group has a limited number of parking lots available in the parking  garage. Provide the license plate of your car to the Xplore Group HR team via office@ida-mediafoundry.nl if you want to make use of these parking lots.",
      lunchInformation:
        "Lunch is served in the Creative Valley Papendorp “brasserie” (canteen) at 12 AM. Report via email to office@ida-mediafoundry.nl that you will have lunch in the canteen to have you added to the iDA NL lunch list",
    },
  },
  Amsterdam: {
    officeName: "Amsterdam",
    canReserveDesk: true,
    canRegisterLunch: true,
    canRegisterPresence: true,
    officeInformation: {
      address: "Cruquiusweg 110F 1019AK",
      oppeningHours: "-",
      accessInformation:
        "You need a key to access the office building. To get a Amsterdam office key, send an e-mail to the Xplore Group HR team via  office@ida-mediafoundry.nl. ",
      parkingInformation:
        "Xplore Group has a limited number of parking lots available in the Parking Cruquius Office parking  garage. Provide the license plate of your car to the Xplore Group HR team via office@ida-mediafoundry.nl if you want to make use of these parking lots and you will get a parking access pass.",
      lunchInformation:
        "Lunch is arranged by the Xplore office manager. Apply for lunch via Slack if you want to participate.",
    },
  },
  Eindhoven: {
    officeName: "Eindhoven",
    canReserveDesk: true,
    canRegisterLunch: false,
    canRegisterPresence: true,
    officeInformation: {
      address: "High Tech Campus 69 5656AE",
      oppeningHours: "6:30 - 20:30 working days",
      accessInformation:
        "You need a HTC access pass to enter the HTC 69 building and its Xplore Group office (on the 3rd floor of building 69). You can enter the office with a key.  Open the keyvault with code 1513. Please put the key back after usage... The HTC 69 access pass is arranged via Xplore Group HR and provided by the HTC Badge Office. The Badge Office is located in building The Strip at the 1st floor and is opened Monday-Friday 9:00-13:00.",
      parkingInformation:
        "Parking is free in the parking garages of the HTC business park! You can park your car in Parking 6, that’s the closest to building 69.",
      lunchInformation:
        "You can lunch in one of the restaurants, or buy a packed lunch in supermarket AH-To-Go on the HTC Strip.",
    },
  },
  Test: {
    officeName: "Test",
    canReserveDesk: false,
    canRegisterLunch: false,
    canRegisterPresence: false,
    officeInformation: {
      address: "string",
      oppeningHours: "string",
      accessInformation: "string",
      parkingInformation: "string",
      lunchInformation: "string",
    },
  },
};