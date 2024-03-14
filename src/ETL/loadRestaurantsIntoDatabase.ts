import * as fs from "fs";
import { PrismaClient, Prisma } from "@prisma/client";
import { transformOpeningHours } from "./transform/openingHours";

type Restaurant = {
  restaurantName: string;
  openingHours: string;
  cashBalance: string;
  menu: Array<{
    dishName: string;
    price: number;
  }>;
};

const loadRestaurantsIntoDatabase = () => {
  const prisma = new PrismaClient();
  let rawData = fs.readFileSync('src/ETL/assets/restaurants_with_menu.json', "utf8");
  let restaurants = JSON.parse(rawData);
  let data: Array<Prisma.RestaurantsCreateInput> = [];
  // NOTE: This is not the most optimal approach to create restaurants one by one.
  // Ideally we would bulk insert all restaurants in one go, get the restaurantIds back
  // and then bulk insert dishes and openingHours in a seperate query. But since I don't have
  // time to do all that and this command will only be run once, we will accept the time tradeoff.
  restaurants.forEach(async (restaurant: Restaurant) => {
    const dishes = restaurant.menu.map((dish) => {
      if (dish.price < 0) throw new Error("Price cannot be negative");
      return {
        name: dish.dishName,
        price: dish.price,
      };
    });
    await prisma.restaurants.create({
      data: {
        name: restaurant.restaurantName,
        dishes: {
          createMany: {
            data: dishes,
          },
        },
        openingHours: {
          createMany: {
            data: transformOpeningHours(restaurant.openingHours),
          },
        },
      },
    });
  });
};

loadRestaurantsIntoDatabase();
