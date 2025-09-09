export async function sha256(input: string): Promise<Uint8Array> {
  const enc = new TextEncoder();
  const buf = await crypto.subtle.digest("SHA-256", enc.encode(input));
  return new Uint8Array(buf);
}
