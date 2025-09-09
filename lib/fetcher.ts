export async function fetcher<T>(url: string, revalidateSeconds?: number): Promise<T> {
  const res = await fetch(url, {
    ...(revalidateSeconds !== undefined
      ? { next: { revalidate: revalidateSeconds } }
      : { cache: "force-cache" }),
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch ${url}: ${res.status} ${res.statusText}`);
  }
  return res.json();
}
