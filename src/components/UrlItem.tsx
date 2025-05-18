import { createResource } from "solid-js";
import getDocument from "../getDocument";

export default function UrlItem({ url }: { url: URL }) {
  const [document] = createResource(url, getDocument);

  const title = () => document()?.title ?? url.hostname;
  // classList={{
  //   "relative  after:absolute after:inset-0 after:bg-[url(/public/diagonal-stripes.svg)] after:animate-stripes *:opacity-70 after:starting:opacity-0 after:transition-all after:transition-discrete after:duration-1000":
  //     document.loading,
  // }}
  return (
    <a
      href={url.href}
      data-is-loading={document.loading || undefined}
      class="group relative flex overflow-clip flex-col items-center justify-around p-4 size-28 border-4 rounded-3xl focus-visible:border-orange-500 focus-visible:text-orange-500 focus:outline-none text-center align-middle content-center data-is-loading:border-stone-400 "
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
      <span>{title()}</span>

      <div
        data-name="stripes-animation"
        class="hidden group-data-is-loading:block absolute inset-0 bg-[url(/public/diagonal-stripes.svg)] animate-stripes opacity-0 group-data-is-loading:opacity-100 text-stone-300 starting:opacity-0 transition-[display_opacity] duration-1000 transition-discrete"
      />
    </a>
  );
}
