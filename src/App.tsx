import { createEffect, createSignal, For } from "solid-js";
import UrlForm from "./components/UrlForm";
import UrlItem from "./components/UrlItem";
import transition from "./transition";

const URI_LIST = "text/uri-list";

function loadUrls(): URL[] {
  const value = localStorage.getItem("urls");
  if (value === null) return [];
  const parsed = JSON.parse(value);
  if (!Array.isArray(parsed)) return [];

  return parsed.map((url) => new URL(url));
}

export default function App() {
  //TODO handle destination this more elegantly
  const [urls, setUrls] = createSignal(loadUrls());
  createEffect(() => {
    localStorage.setItem("urls", JSON.stringify(urls()));
  });

  function handleDragEnter(event: DragEvent) {
    const data = event.dataTransfer;
    if (!data) return;

    const isLink = data.types.includes(URI_LIST);
    if (!isLink) return;
    event.preventDefault();
  }

  function handleDrop(event: DragEvent) {
    const data = event.dataTransfer;
    if (!data) return;
    event.preventDefault();
    const lines = data.getData(URI_LIST);

    if (lines.length === 0) return;

    const urls = lines.split("\n").reduce((urls, line) => {
      if (line.startsWith("#")) return urls;

      // console.debug("url line", line);
      const url = URL.parse(line);
      if (url !== null) urls.push(url);

      return urls;
    }, new Array<URL>());

    console.debug("Dropped urls", urls);
  }

  function handleUrlSubmit(url: URL) {
    console.debug("Submitted url", url);
    //TODO use map to deduplicate and reduce garbage
    transition(() => {
      setUrls((urls) => {
        const index = urls.findIndex((otherUrl) => otherUrl.href === url.href);

        console.debug("Found url", index);
        if (index !== -1) return urls;

        return [...urls, url];
      });
    });
  }

  return (
    <main
      class="max-w-3xl mx-auto px-6"
      onDragOver={handleDragEnter}
      onDrop={handleDrop}
    >
      <h1 class="text-7xl font-bold text-orange-600">Shore</h1>
      <h2 class="sr-only">Add Destination</h2>
      <UrlForm onSubmit={handleUrlSubmit} />
      <h2 class="sr-only">Destinations</h2>
      <ul class="font-bold mt-4 flex flex-wrap gap-2">
        <For each={urls()}>
          {(url) => (
            <li>
              <UrlItem url={url} />
            </li>
          )}
        </For>
      </ul>
    </main>
  );
}
