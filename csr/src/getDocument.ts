const parser = new DOMParser();
export default async function getDocument(url: URL) {
  const response = await fetch(url);
  // Do not care about status code. A bad request might still contain icon metadata
  const text = await response.text();
  const document = parser.parseFromString(text, "text/html");
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return document;
}
