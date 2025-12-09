// lib/search.ts
// Note: This file contains unused search functionality
// The 'posts' model does not exist in the current Prisma schema

// import { prisma } from "@/lib/prisma";
// import { redis } from "@/lib/redis";

// export async function searchPosts(query: string) {
//   // Try Redis cache first
//   const cached = await redis?.get(`search:${query}`);
//   if (typeof cached === "string") return JSON.parse(cached);

//   // Fall back to DB full-text search
//   const results = await prisma.posts.findMany({
//     where: {
//       content: {
//         search: query,
//       },
//     },
//   });

//   // Cache results
//   await redis?.set(`search:${query}`, JSON.stringify(results), "EX", 60);
//   return results;
// }
