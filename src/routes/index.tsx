import { A } from "@solidjs/router";
import { Plus } from "lucide-solid";
import { For } from "solid-js";

export default function Home() {
  const destinations = [
    {
      title: "claas.dev",
      href: "https://claas.dev",
    },
  ];

  return (
    <main class="max-w-3xl mx-auto">
      <h1 class="text-7xl font-bold text-orange-600">Shore</h1>
      <h2 class="sr-only">Add Destination</h2>
      <form class="text-lg font-bold mt-3 grid grid-rows-[auto_1fr] grid-cols-[1fr_auto] gap-x-2">
        <label for="url" class="font-bold row-start-1">
          Url
        </label>
        <input
          id="url"
          name="url"
          required
          class="border-4 rounded-full px-4 py-1.5 focus-visible:border-orange-500 focus:outline-none block grow row-start-2 "
        />
        <button
          type="submit"
          class="font-bold rounded-full border-4 p-2 row-start-2 focus-visible:border-orange-500 focus-within:text-orange-500 focus:outline-none "
        >
          <Plus strokeWidth="4" />
          <span class="sr-only">Add</span>
        </button>
      </form>
      <h2 class="sr-only">Destinations</h2>
      <ul class="font-bold mt-4">
        <For each={destinations}>
          {(destination) => (
            <li>
              <a
                href={destination.href}
                class="inline-block p-4 aspect-square border-4 rounded-3xl focus-visible:border-orange-500 focus-visible:text-orange-500 focus:outline-none"
              >
                {destination.title}
              </a>
            </li>
          )}
        </For>
      </ul>
    </main>
  );
}
