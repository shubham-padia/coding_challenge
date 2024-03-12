import { transformOpeningHours } from "../transform/openingHours";

describe("test transformOpeningHours", () => {
  test("test with comma seperated days and closing time going beyond midnight", () => {
    expect(
      transformOpeningHours(
        "Mon, Fri 2:30 pm - 8 pm / Tues 11 am - 2 pm / Weds 1:15 pm - 3:15 am / Thurs 10 am - 3:15 am / Sat 5 am - 11:30 am / Sun 10:45 am - 5 pm",
      ),
    ).toEqual({
      SUNDAY: [{ openingHours: "10:45", closingHours: "17:00" }],
      MONDAY: [{ openingHours: "14:30", closingHours: "20:00" }],
      TUESDAY: [{ openingHours: "11:00", closingHours: "14:00" }],
      WEDNESDAY: [{ openingHours: "13:15", closingHours: "23:59" }],
      THURSDAY: [
        { openingHours: "00:00", closingHours: "03:15" },
        { openingHours: "10:00", closingHours: "23:59" },
      ],
      FRIDAY: [
        { openingHours: "14:30", closingHours: "20:00" },
        { openingHours: "00:00", closingHours: "03:15" },
      ],
      SATURDAY: [{ openingHours: "05:00", closingHours: "11:30" }],
    });
  });

  test("test day range seperated by a dash (-) and closing time beyond midnight", () => {
    expect(
      transformOpeningHours(
        "Mon 7 am - 11:30 am / Tues 1:45 pm - 4:15 pm / Weds - Sat 10 am - 12:45 am / Sun 2:15 pm - 5:45 pm",
      ),
    ).toEqual({
      SUNDAY: [
        { openingHours: "00:00", closingHours: "00:45" },
        { openingHours: "14:15", closingHours: "17:45" },
      ],
      MONDAY: [{ openingHours: "07:00", closingHours: "11:30" }],
      TUESDAY: [{ openingHours: "13:45", closingHours: "16:15" }],
      WEDNESDAY: [{ openingHours: "10:00", closingHours: "23:59" }],
      THURSDAY: [
        { openingHours: "00:00", closingHours: "00:45" },
        { openingHours: "10:00", closingHours: "23:59" },
      ],
      FRIDAY: [
        { openingHours: "00:00", closingHours: "00:45" },
        { openingHours: "10:00", closingHours: "23:59" },
      ],
      SATURDAY: [
        { openingHours: "00:00", closingHours: "00:45" },
        { openingHours: "10:00", closingHours: "23:59" },
      ],
    });
  });
});
