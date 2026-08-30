import Image from "next/image";

export default function Hero() {
  return (
    <section id="top" className="relative">
      <h1 className="sr-only">
        Welcome to WILA — Berkeley Haas Women in Leadership Alumnae
      </h1>

      <Image
        src="/images/welcome-hero.png"
        alt="Two Berkeley Haas alumnae smiling together at a WILA gathering, with the message: Berkeley Haas Women in Leadership Alumnae (WILA) is a worldwide network of Berkeley Haas alumnae committed to a community that celebrates and amplifies the power of bringing women together."
        width={1120}
        height={890}
        priority
        sizes="100vw"
        className="h-auto w-full"
      />
    </section>
  );
}
