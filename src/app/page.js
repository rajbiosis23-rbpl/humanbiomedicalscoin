import Hero from "@/components/home/Hero";
import HomeBanner from "@/components/home/HomeBanner";
import Stats from "@/components/home/Stats";
import WhyChoose from "@/components/home/WhyChoose";
import Testimonial from "@/components/home/Testimonials";
import Trustbadge from "@/components/home/TrustBadges";

export default function HomePage({
  city = "",
}) {

  return (
    <main className="overflow-hidden">

      <Hero city={city} />

      <HomeBanner city={city} />

      <WhyChoose city={city} />

      <Stats />
      <Testimonial />
      <Trustbadge />

    </main>
  );
}