// prisma/seed.ts
import { prisma } from "@/lib/prisma";
// Removed import of CompetitionType as it does not exist in @prisma/client
import { slugify } from "@/lib/slugify";

const TAXONOMY: Array<{
  category: string;
  subcategory: string;
  type: "LEAGUE" | "CUP";
  country?: string;
}> = [
  {
    category: "England",
    subcategory: "Premier League",
    type: "LEAGUE",
    country: "England",
  },
  {
    category: "England",
    subcategory: "Championship",
    type: "LEAGUE",
    country: "England",
  },
  {
    category: "England",
    subcategory: "FA Cup",
    type: "CUP",
    country: "England",
  },
  {
    category: "England",
    subcategory: "EFL Cup",
    type: "CUP",
    country: "England",
  },
  {
    category: "Spain",
    subcategory: "La Liga",
    type: "LEAGUE",
    country: "Spain",
  },
  {
    category: "Spain",
    subcategory: "Copa del Rey",
    type: "CUP",
    country: "Spain",
  },
  {
    category: "Spain",
    subcategory: "Spanish Super Cup",
    type: "CUP",
    country: "Spain",
  },
  {
    category: "Germany",
    subcategory: "Bundesliga",
    type: "LEAGUE",
    country: "Germany",
  },
  {
    category: "France",
    subcategory: "Ligue 1",
    type: "LEAGUE",
    country: "France",
  },
  {
    category: "Italy",
    subcategory: "Serie A",
    type: "LEAGUE",
    country: "Italy",
  },
  { category: "USA", subcategory: "MLS", type: "LEAGUE", country: "USA" },
  {
    category: "Turkey",
    subcategory: "Süper Lig",
    type: "LEAGUE",
    country: "Turkey",
  },
  {
    category: "Portugal",
    subcategory: "Primeira Liga",
    type: "LEAGUE",
    country: "Portugal",
  },
  {
    category: "Saudi Arabia",
    subcategory: "Saudi Pro League",
    type: "LEAGUE",
    country: "Saudi Arabia",
  },
  { category: "Cups", subcategory: "UEFA Champions League", type: "CUP" },
  { category: "Cups", subcategory: "UEFA Europa League", type: "CUP" },
  { category: "Cups", subcategory: "UEFA Conference League", type: "CUP" },
  { category: "Cups", subcategory: "FIFA World Cup", type: "CUP" },
];

async function main() {
  for (const item of TAXONOMY) {
    const compSlug = slugify(
      `${item.country ?? item.category}-${item.subcategory}`,
    );

    // Create or update competition
    await prisma.competition.upsert({
      where: { slug: compSlug },
      update: {},
      create: {
        slug: compSlug,
        name: item.subcategory,
        country:
          item.country ?? (item.category !== "Cups" ? item.category : null),
      },
    });

    // taxonomyMap model doesn't exist in current schema - commented out
    // await prisma.taxonomyMap?.upsert?.({
    //     where: { category_subcategory: { category: item.category, subcategory: item.subcategory } },
    //     update: { competitionId: competition.id },
    //     create: {
    //         category: item.category,
    //         subcategory: item.subcategory,
    //         competitionId: competition.id,
    //     },
    // });
  }

  console.log("Seed complete ✅");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
