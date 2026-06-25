import Image from "next/image";

export default function FeatureCards() {
  return (
    <section className="py-32">

      <div className="mx-auto max-w-6xl px-6">

        {/* section header */}
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-medium tracking-tight text-zinc-900">
            Everything in one place
          </h2>

          <p className="mt-4 text-zinc-600">
            Track applications, follow up, and never lose opportunities again.
          </p>
        </div>

        {/* CARDS WRAPPER */}
        <div className="
          mt-16
          flex gap-6 overflow-x-auto pb-4
          md:grid md:grid-cols-3 md:overflow-visible
        ">

          {/* CARD 1 */}
          <div className="min-w-[280px] md:min-w-0 rounded-xl bg-white overflow-hidden">
            <div className="relative h-78 border-2 rounded-xl">
              <Image
                src="/assets/track-applications.jpg"
                alt="Track applications"
                fill
                className="object-cover"
              />
            </div>

            <div className="p-5">
              <h3 className="font-medium text-zinc-900">
                Track every application
              </h3>
              <p className="mt-2 text-sm text-zinc-600">
                Keep all your job applications in one clean timeline, no matter where you applied.
              </p>
            </div>
          </div>

          {/* CARD 2 */}
          <div className="min-w-[280px] md:min-w-0 rounded-xl bg-white overflow-hidden">
            <div className="relative h-78 border-2 rounded-xl">
              <Image
                src="/assets/follow-ups.jpg"
                alt="Follow ups"
                fill
                className="object-cover"
              />
            </div>

            <div className="p-5">
              <h3 className="font-medium text-zinc-900">
                Never miss follow-ups
              </h3>
              <p className="mt-2 text-sm text-zinc-600">
                Get clarity on when to follow up so opportunities don’t slip through the cracks.
              </p>
            </div>
          </div>

          {/* CARD 3 */}
          <div className="min-w-[280px] md:min-w-0 rounded-xl bg-white overflow-hidden">
            <div className="relative h-78 border-2 rounded-xl">
              <Image
                src="/assets/forgotten-applications.jpg"
                alt="Forgotten applications"
                fill
                className="object-cover"
              />
            </div>

            <div className="p-5">
              <h3 className="font-medium text-zinc-900">
                Rediscover forgotten applications
              </h3>
              <p className="mt-2 text-sm text-zinc-600">
                See past applications you’ve lost track of and bring them back into focus.
              </p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}