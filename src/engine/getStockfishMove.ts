export async function getStockfishMove(fen: string, depth: number) {
  try {
    const res = await fetch("https://chess-api.com/v1", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fen, depth }),
    });

    if (!res.ok) return null;

    const data = await res.json();
    return data;
  } catch {
    return null;
  }
}
