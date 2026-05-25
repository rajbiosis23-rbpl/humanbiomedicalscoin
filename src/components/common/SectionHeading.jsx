export default function SectionHeading({
  subtitle,
  title
}) {
  return (
    <div className="text-center max-w-[1300px] mx-auto">

      <span className="section-subtitle">

        {subtitle}

      </span>

      <h2 className="section-title mt-5">

        {title}

      </h2>

    </div>
  );
}