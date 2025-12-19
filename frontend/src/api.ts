export interface WordItem {
  word: string;
  weight: number;
}

export async function analyzeArticle(url: string): Promise<WordItem[]> {
  const res = await fetch("http://127.0.0.1:8000/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url })
  });

  if (!res.ok) {
    throw new Error("Failed to analyze article");
  }

  return res.json();
}
