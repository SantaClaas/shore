import { createEffect, createSignal, For, type JSX } from "solid-js";
import UrlForm from "./components/UrlForm";
import UrlItem from "./components/UrlItem";
import transition from "./transition";

export type EventParameter<T, E extends Event> = Parameters<
  JSX.EventHandler<T, E>
>[0];
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
    if (data === null) return;

    const isLink = data.types.includes(URI_LIST);
    if (!isLink) return;
    event.preventDefault();
  }

  function handleDataTransfer(data: DataTransfer) {
    const lines = data.getData(URI_LIST) || data.getData("text");

    console.debug("Dop", lines);
    if (lines.length === 0) return;

    for (const line of lines.split("\n")) {
      if (line.startsWith("#")) continue;
      console.debug("Run", line);
      const url = URL.parse(line);
      console.debug("Adding", url);
      if (url === null) continue;

      addUrl(url);
    }
  }

  document.addEventListener("paste", (event: ClipboardEvent) => {
    console.debug("Paste", event.clipboardData?.getData("text"));
    if (event.clipboardData !== null) {
      handleDataTransfer(event.clipboardData);
      event.preventDefault();
    }
  });

  function addUrl(url: URL) {
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

  function removeUrl(url: URL) {
    transition(() => {
      setUrls((urls) => {
        //TODO rework this janky delete
        const index = urls.findIndex((otherUrl) => otherUrl.href === url.href);

        urls.splice(index, 1);
        return [...urls];
      });
    });
  }

  function handleDrop(event: DragEvent) {
    const data = event.dataTransfer;
    if (!data) return;
    event.preventDefault();
    handleDataTransfer(data);
  }

  function handleDelete(
    event: EventParameter<HTMLUListElement, KeyboardEvent>,
  ) {
    console.debug("k", event.key, event.target);
    if (
      (event.key !== "Delete" && event.key !== "Backspace") ||
      !(event.target instanceof HTMLAnchorElement)
    )
      return;

    const url = new URL(event.target.href);
    removeUrl(url);
  }

  return (
    <main
      class="max-w-3xl mx-auto px-6"
      onDragOver={handleDragEnter}
      onDrop={handleDrop}
    >
      <h1 class="text-7xl font-bold text-orange-600">Shore</h1>
      <h2 class="sr-only">Add Destination</h2>
      <UrlForm onSubmit={addUrl} />
      <h2 class="sr-only">Destinations</h2>
      <ul class="font-bold mt-4 flex flex-wrap gap-2" onKeyDown={handleDelete}>
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
