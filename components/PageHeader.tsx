import Parallax from "@/components/Parallax";
import Reveal from "@/components/Reveal";

/**
 * Shared masthead for the inner pages.
 *
 * Full-bleed photograph with a parallax drift, the title set in the poster
 * face, and a scrim heavy enough at the base that the type never has to fight
 * whatever is in the frame.
 */
export default function PageHeader({
  eyebrow,
  title,
  lede,
  photo
}: {
  eyebrow: string;
  title: string;
  lede?: string;
  photo: string;
}) {
  return (
    <header className="relative h-[68vh] min-h-[26rem] overflow-hidden bg-ink">
      <Parallax src={photo} speed={0.18} className="absolute inset-0 h-full w-full" />
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/75 to-ink/35" />
      <div className="absolute inset-0 bg-berkeley-blue/25 mix-blend-multiply" />

      <div className="relative flex h-full items-end">
        <div className="container-wide pb-14 md:pb-20">
          <Reveal className="block">
            <div className="mb-4 inline-flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.3em] text-california-gold md:text-[11px]">
              <span className="h-px w-8 bg-california-gold/70" />
              {eyebrow}
            </div>
            <h1 className="display whitespace-pre-line text-[clamp(2rem,5.6vw,5rem)] text-white [text-shadow:0_10px_50px_rgba(0,8,24,0.6)]">
              {title}
            </h1>
            {lede && (
              <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-white/75 md:text-lg">
                {lede}
              </p>
            )}
          </Reveal>
        </div>
      </div>
    </header>
  );
}
