export async function fetcher(url: string, options?: RequestInit) {
  const res = await fetch(url, options);
  if (!res.ok) throw new Error('An error occurred while fetching the data.');
  return res.json();
}
