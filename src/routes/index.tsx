import { createEffect, createSignal, For } from "solid-js";
import { clientOnly } from "@solidjs/start";
import type { Entry } from "~/components/UrlForm";

const UrlForm = clientOnly(() => import("~/components/UrlForm"));

const URI_LIST = "text/uri-list";

export default function Home() {
  //TODO handle this more elegantly

  const [destinations, setDestinations] = createSignal(new Array<Entry>());

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

  function handleUrlSubmit(entry: Entry) {
    //TODO use map to deduplicate and reduce garbage
    setDestinations((destinations) => {
      const index = destinations.findIndex(
        (destination) => destination.url.href === entry.url.href,
      );

      if (index === -1) return destinations;

      return [...destinations, entry];
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
      <ul class="font-bold mt-4">
        <For each={destinations()}>
          {(destination) => (
            <li>
              <a
                href={destination.url.href}
                class="flex flex-col items-center justify-around min-w-0 max-w-max p-4 aspect-square border-4 rounded-3xl focus-visible:border-orange-500 focus-visible:text-orange-500 focus:outline-none text-center align-middle content-center"
              >
                {/* <img
                  src={`https://icons.duckduckgo.com/ip3/${destination.url.hostname}.ico`}
                  alt=""
                /> */}
                {/* Empty alt because it is purely decorative and should be skipped by screen readers */}
                <img
                  src={`https://www.google.com/s2/favicons?sz=64&domain=${destination.url.hostname}`}
                  alt=""
                  class="rounded-xl size-12"
                />
                <span>{destination.title}</span>
              </a>
            </li>
          )}
        </For>
      </ul>
    </main>
  );
}
