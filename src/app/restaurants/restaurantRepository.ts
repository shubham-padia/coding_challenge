import { DAYS_ENUM } from "../constants";
import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

export const getRestaurants = async (
  date: Date | undefined,
  limit: number,
  offset: number,
  includes: string[] | undefined,
) => {
  const findManyClause: Prisma.RestaurantsFindManyArgs = {
    skip: offset,
    take: limit,
  };
  const countClause: Prisma.RestaurantsCountArgs = {};
  if (includes) {
    if (includes.includes("dishes")) {
      findManyClause.include = {
        dishes: {
          select: {
            price: true,
            name: true,
          },
        },
      };
    }
  }
  if (date) {
    const day = Object.values(DAYS_ENUM)[date.getDay()];
    const time = Number(date.getHours()) * 100 + Number(date.getMinutes());

    findManyClause.where = {
      openingHours: {
        some: {
          day: day,
          openingHours: {
            lte: time,
          },
          closingHours: {
            gte: time,
          },
        },
      },
    };
    countClause.where = findManyClause.where;
  }

  return {
    count: await prisma.restaurants.count(countClause),
    restaurants: await prisma.restaurants.findMany(findManyClause),
  };
};
