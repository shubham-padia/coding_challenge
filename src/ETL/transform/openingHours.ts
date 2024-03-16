import { DAYS_ENUM } from "../constants";
import { ERRORS } from "./errors";

const VALID_DAY_NAMES = {
  [DAYS_ENUM.MONDAY]: ["MON"],
  [DAYS_ENUM.TUESDAY]: ["TUE", "TUES"],
  [DAYS_ENUM.WEDNESDAY]: ["WED", "WEDS"],
  [DAYS_ENUM.THURSDAY]: ["THU", "THUR", "THURS"],
  [DAYS_ENUM.FRIDAY]: ["FRI"],
  [DAYS_ENUM.SATURDAY]: ["SAT"],
  [DAYS_ENUM.SUNDAY]: ["SUN"],
};
const DAYS_ENUM_VALUES = Object.values(DAYS_ENUM);

const convertTime12to24 = (time12h: string) => {
  const [time, modifier] = time12h.split(" ");

  let [hoursString, minutesString] = time.split(":");

  let hours = 0;
  let minutes = 0;

  if (!minutesString) minutes = 0;
  else minutes = Number(minutesString);

  hours = Number(hoursString);
  if (hoursString === "12") hours = 0;
  if (modifier.toUpperCase() === "PM") hours = hours + 12;

  return hours * 100 + minutes;
};

const getDay = (str: string) => {
  const strUppercase = str.toUpperCase();
  let result: DAYS_ENUM | undefined = undefined;

  DAYS_ENUM_VALUES.every((element: DAYS_ENUM) => {
    if (VALID_DAY_NAMES[element].includes(strUppercase)) {
      result = element;
    }
    return true;
  });

  if (!result) throw new Error(ERRORS.INVALID_DAY_STRING);
  return result;
};

const isGreaterThanForHHMM = (str1: string, str2: string) => {
  return Number(str1.replace(":", "")) > Number(str2.replace(":", ""));
};

type ParsedOpeningHoursType = Array<{
  day: DAYS_ENUM;
  openingHours: number;
  closingHours: number;
}>;

const addOpeningHoursToDay = (
  parsedOpeningHours: ParsedOpeningHoursType,
  day: DAYS_ENUM,
  openingHours: number,
  closingHours: number,
) => {
  parsedOpeningHours.push({
    day,
    openingHours,
    closingHours,
  });
  return parsedOpeningHours;
};

const getNextDay = (day: DAYS_ENUM) => {
  const currentIndex = DAYS_ENUM_VALUES.indexOf(day);
  return DAYS_ENUM_VALUES[(currentIndex + 1) % 7];
};

export const transformOpeningHours = (openingHours: string) => {
  // initialize with the restaurant closed on all days and then populate
  // the times.

  let parsedOpeningHours: ParsedOpeningHoursType | [] = [];

  const splitOpeningHours = openingHours.split("/");
  splitOpeningHours.forEach((element) => {
    const firstDay = element.match(/[a-zA-Z]{3,4}/i);
    const additionalDay = element.match(/,\s?([a-zA-Z]{3,4})/i);
    const additionalDayRange = element.match(/-\s?([a-zA-Z]{3,4})/i);
    const times = element.match(
      /(\d{1,2}(?::\d{1,2})?\s(?:am|pm))\s-\s(\d{1,2}(?::\d{1,2})?\s(?:am|pm))/i,
    );

    if (!times) throw new Error(ERRORS.INVALID_TIME_FORMAT);
    if (!firstDay) throw new Error(ERRORS.DAY_NOT_PRESENT);

    if (times.length === 3) {
      const openingHours = convertTime12to24(times[1]);
      const closingHours = convertTime12to24(times[2]);
      let days: DAYS_ENUM[] = [getDay(firstDay[0])];

      if (additionalDay) days.push(getDay(additionalDay[1]));

      if (additionalDayRange) {
        // Add 1 to skip adding the first day.
        const startSliceIndex =
          (DAYS_ENUM_VALUES.indexOf(getDay(firstDay[0])) + 1) % 7;
        const endSliceIndex =
          (DAYS_ENUM_VALUES.indexOf(getDay(additionalDayRange[1])) + 1) % 7;

        if (startSliceIndex > endSliceIndex) {
          days = days
            .concat(DAYS_ENUM_VALUES.slice(startSliceIndex))
            .concat(DAYS_ENUM_VALUES.slice(0, endSliceIndex));
        } else {
          days = days.concat(
            DAYS_ENUM_VALUES.slice(startSliceIndex, endSliceIndex),
          );
        }
      }

      if (openingHours <= closingHours) {
        days.forEach((day) => {
          parsedOpeningHours = addOpeningHoursToDay(
            parsedOpeningHours,
            day,
            openingHours,
            closingHours,
          );
        });
      } else {
        days.forEach((day) => {
          parsedOpeningHours = addOpeningHoursToDay(
            parsedOpeningHours,
            day,
            openingHours,
            2359,
          );
          parsedOpeningHours = addOpeningHoursToDay(
            parsedOpeningHours,
            getNextDay(day),
            0,
            closingHours,
          );
        });
      }
    }
  });
  return parsedOpeningHours;
};
