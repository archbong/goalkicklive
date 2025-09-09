import { prisma } from "./prisma";
import { slugify } from "./slugify";

export async function ensureTeam(name: string, country?: string) {
  const slug = slugify(name);
  return prisma.team.upsert({
    where: { slug },
    update: { name, country },
    create: { slug, name, country },
  });
}

export async function findCompetitionByName(name: string, country?: string) {
  let comp = await prisma.competition.findFirst({
    where: { name, ...(country ? { country } : {}) },
  });
  if (comp) return comp;

  const slug = slugify(`${country ?? ""}-${name}`);
  return prisma.competition.findUnique({ where: { slug } });
}
export async function ensureCompetition(name: string, country?: string) {
  const slug = slugify(`${country ?? ""}-${name}`);
  return prisma.competition.upsert({
    where: { slug },
    update: { name, country },
    create: { slug, name, country },
  });
}
