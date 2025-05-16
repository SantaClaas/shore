import { createResource, type Resource } from "solid-js";
import Plus from "lucide-solid/icons/plus";
import { Properties } from "solid-js/web/types/server.js";

const URL_INPUT = "url";

export type Entry = {
  url: URL;
  title: Resource<string>;
};

export type UrlFormProperties = {
  onSubmit(entry: Entry): void;
};

async function getIcon(url: URL) {
  console.debug("Getting icon");
  const document = await getDocument(url);

  // A link can have multiple rel
  const iconLinks = document.querySelectorAll(
    'link[rel~="icon"], link[rel~="apple-touch-icon"]',
  );

  // Select best icon
  for (const link of iconLinks) {
    if (!(link instanceof HTMLLinkElement)) continue;

    if (link.sizes.contains("any")) {
    }
  }
}

const parser = new DOMParser();
async function getDocument(url: URL) {
  const response = await fetch(url);
  // Do not care about status code. A bad request might still contain icon metadata
  const text = await response.text();
  const document = parser.parseFromString(text, "text/html");
  return document;
}

export default function UrlForm({ onSubmit }: UrlFormProperties) {
  function handleSubmit(event: SubmitEvent) {
    event.preventDefault();

    const form = event.currentTarget;
    if (!(form instanceof HTMLFormElement))
      throw new Error("Expected to handle form submit event");

    const input = form.elements.namedItem(URL_INPUT);
    if (!(input instanceof HTMLInputElement))
      throw new Error("Expected form to have url input");

    const url = URL.parse(input.value);
    if (url === null) {
      input.setCustomValidity("Invalid url. Url is not parsable.");
      return;
    }

    const [document] = createResource(url, getDocument);
    //TODO load best available icon from document link elements
    const [title] = createResource(document, (document) => document.title);

    // Using hostname for title until document fetch and parse is implemented
    onSubmit({ url, title: title });
  }

  return (
    <form
      onSubmit={handleSubmit}
      class="text-lg font-bold mt-3 grid grid-rows-[auto_1fr] grid-cols-[1fr_auto] gap-x-2"
    >
      <label for="url" class="font-bold row-start-1">
        Url
      </label>
      <input
        id="url"
        name={URL_INPUT}
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
  );
}
