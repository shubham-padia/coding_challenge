import { transformOpeningHours } from "../transform/openingHours";

describe("test transformOpeningHours", () => {
  test("test with comma seperated days and closing time going beyond midnight", () => {
    expect(
      transformOpeningHours(
        "Mon, Fri 2:30 pm - 8 pm / Tues 11 am - 2 pm / Weds 1:15 pm - 3:15 am / Thurs 10 am - 3:15 am / Sat 5 am - 11:30 am / Sun 10:45 am - 5 pm",
      ),
    ).toEqual([
      { day: 'MONDAY', openingHours: 1430, closingHours: 2000 },
      { day: 'FRIDAY', openingHours: 1430, closingHours: 2000 },
      { day: 'TUESDAY', openingHours: 1100, closingHours: 1400 },
      { day: 'WEDNESDAY', openingHours: 1315, closingHours: 2359 },
      { day: 'THURSDAY', openingHours: 0, closingHours: 315 },
      { day: 'THURSDAY', openingHours: 1000, closingHours: 2359 },
      { day: 'FRIDAY', openingHours: 0, closingHours: 315 },
      { day: 'SATURDAY', openingHours: 500, closingHours: 1130 },
      { day: 'SUNDAY', openingHours: 1045, closingHours: 1700 }
    ]);
  });

  test("test day range seperated by a dash (-) and closing time beyond midnight", () => {
    expect(
      transformOpeningHours(
        "Mon 7 am - 11:30 am / Tues 1:45 pm - 4:15 pm / Weds - Sat 10 am - 12:45 am / Sun 2:15 pm - 5:45 pm",
      ),
    ).toEqual([
      { day: 'MONDAY', openingHours: 700, closingHours: 1130 },
      { day: 'TUESDAY', openingHours: 1345, closingHours: 1615 },
      { day: 'WEDNESDAY', openingHours: 1000, closingHours: 2359 },
      { day: 'THURSDAY', openingHours: 0, closingHours: 45 },
      { day: 'THURSDAY', openingHours: 1000, closingHours: 2359 },
      { day: 'FRIDAY', openingHours: 0, closingHours: 45 },
      { day: 'FRIDAY', openingHours: 1000, closingHours: 2359 },
      { day: 'SATURDAY', openingHours: 0, closingHours: 45 },
      { day: 'SATURDAY', openingHours: 1000, closingHours: 2359 },
      { day: 'SUNDAY', openingHours: 0, closingHours: 45 },
      { day: 'SUNDAY', openingHours: 1415, closingHours: 1745 }
    ]);
  });
});
