export async function createVideoIndex() {
  if (!process.env.REDIS_URL || !process.env.REDIS_TOKEN) {
    throw new Error("Redis not configured");
  }

  const url = `${process.env.REDIS_URL}/ft.create/idx:videos`;
  const body = [
    "ON", "JSON",
    "PREFIX", "1", "video:",
    "SCHEMA",
    "$.id", "AS", "id", "TAG",
    "$.title", "AS", "title", "TEXT",
    "$.competition", "AS", "competition", "TEXT",
    "$.teams", "AS", "teams", "TEXT",
    "$.publishedAt", "AS", "publishedAt", "NUMERIC", "SORTABLE"
  ];

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.REDIS_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  return res.json();
}
