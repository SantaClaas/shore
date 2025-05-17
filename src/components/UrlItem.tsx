import { createResource, Suspense } from "solid-js";
import getDocument from "../getDocument";

export default function UrlItem({ url }: { url: URL }) {
  const [document] = createResource(url, getDocument);

  return (
    <Suspense fallback={<span>Loading...</span>}>
      <a
        href={url.href}
        class="flex flex-col items-center justify-around min-w-0 max-w-max p-4 size-24 border-4 rounded-3xl focus-visible:border-orange-500 focus-visible:text-orange-500 focus:outline-none text-center align-middle content-center"
      >
        {/* <img
                  src={`https://icons.duckduckgo.com/ip3/${destination.url.hostname}.ico`}
                  alt=""
                /> */}
        {/* Empty alt because it is purely decorative and should be skipped by screen readers */}
        <img
          src={`https://www.google.com/s2/favicons?sz=64&domain=${url.hostname}`}
          alt=""
          class="rounded-xl size-12"
        />
        <span>{document()?.title}</span>
      </a>
    </Suspense>
  );
}
