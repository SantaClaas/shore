import Plus from "lucide-solid/icons/plus";
import type { EventParameter } from "~/App";

const URL_INPUT = "url";

export type UrlFormProperties = {
  onSubmit(url: URL): void;
};

// async function getIcon(url: URL) {
//   console.debug("Getting icon");
//   const document = await getDocument(url);

//   // A link can have multiple rel
//   const iconLinks = document.querySelectorAll(
//     'link[rel~="icon"], link[rel~="apple-touch-icon"]'
//   );

//   // Select best icon
//   for (const link of iconLinks) {
//     if (!(link instanceof HTMLLinkElement)) continue;

//     if (link.sizes.contains("any")) {
//     }
//   }
// }

export default function UrlForm({ onSubmit }: UrlFormProperties) {
  function handleSubmit(event: EventParameter<HTMLFormElement, SubmitEvent>) {
    event.preventDefault();

    const form = event.currentTarget;

    const input = form.elements.namedItem(URL_INPUT);
    if (!(input instanceof HTMLInputElement))
      throw new Error("Expected form to have url input");

    console.debug("submitted", input.value);
    const url = URL.parse(input.value);
    if (url === null) {
      input.setCustomValidity("Invalid url. Url is not parsable.");
      input.reportValidity();
      // Reset on next input
      input.addEventListener("input", () => input.setCustomValidity(""), {
        once: true,
      });
      return;
    }

    onSubmit(url);
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
        type="url"
        required
        autofocus
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
