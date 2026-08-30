import { getBoard } from "@/lib/content";
import { imageUrlFor } from "@/lib/sanity.client";

function Avatar({ name, photo }: { name: string; photo?: any }) {
  const url = photo ? imageUrlFor(photo)?.width(112).height(112).url() : null;
  if (url) {
    // eslint-disable-next-line @next/next/no-img-element
    return (
      <img
        src={url}
        alt={name}
        width={56}
        height={56}
        className="h-14 w-14 shrink-0 rounded-full object-cover"
      />
    );
  }
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("");
  return (
    <div className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-berkeley-blue text-base font-semibold text-california-gold">
      {initials}
    </div>
  );
}

export default async function Leadership() {
  const board = await getBoard();

  return (
    <section id="leadership" className="bg-white py-20 md:py-28">
      <div className="container-tight">
        <div className="max-w-2xl">
          <span className="eyebrow">Leadership</span>
          <h2 className="section-title mt-4">Meet the WILA Board.</h2>
          <p className="lede mt-4">
            The volunteer alumnae driving WILA's programs, mentorship, and
            community — at work and beyond.
          </p>
        </div>

        <ul className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {board.map((m) => (
            <li
              key={m._id ?? m.name}
              className="card flex items-center gap-4 p-4 md:p-5"
            >
              <Avatar name={m.name} photo={m.photo} />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="truncate font-semibold text-ink">
                    {m.name}
                  </span>
                  {m.isDraft && (
                    <span className="rounded-full bg-california-gold/20 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-medalist">
                      Draft
                    </span>
                  )}
                </div>
                <div className="truncate text-sm text-ink/65">{m.role}</div>
              </div>
              {m.linkedin && (
                <a
                  href={m.linkedin}
                  aria-label={`${m.name} on LinkedIn`}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-berkeley-blue transition hover:bg-berkeley-blue hover:text-white"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5.001 2.5 2.5 0 0 1 0-5.001zM3 9h4v12H3zM9 9h3.8v1.71h.05c.53-1 1.83-2.06 3.77-2.06 4.03 0 4.78 2.65 4.78 6.1V21H17.6v-5.32c0-1.27-.02-2.9-1.77-2.9-1.77 0-2.04 1.38-2.04 2.8V21H9z"/>
                  </svg>
                </a>
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
