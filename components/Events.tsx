import { getEvents, partitionEvents } from "@/lib/content";
import EventsUI from "./EventsUI";
import Reveal from "@/components/Reveal";

export default async function Events() {
  const events = await getEvents();
  const { upcoming, past } = partitionEvents(events);

  return (
    <section id="events" className="bg-white py-20 md:py-28">
      <div className="container-tight">
        <Reveal className="block max-w-2xl">
          <span className="eyebrow">Events</span>
          <h2 className="section-title mt-4">
            Gathering, learning, and showing up for each other.
          </h2>
          <p className="lede mt-4">
            From global summits to chapter workshops, our calendar is built by
            alumnae, for alumnae.
          </p>
        </Reveal>
        <EventsUI upcoming={upcoming} past={past} />
      </div>
    </section>
  );
}
