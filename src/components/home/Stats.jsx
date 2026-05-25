import "./stats.css";

export default function Stats() {

  const stats = [
    {
      title: "Years Experience",
      number: "15+",
    },
    {
      title: "Biomedical Products",
      number: "500+",
    },
    {
      title: "Happy Clients",
      number: "50K+",
    },
    {
      title: "Client Satisfaction",
      number: "99%",
    },
  ];

  return (
    <section className="stats-section">

      <div className="container-custom">

        <div className="stats-wrapper">

          {stats.map((item, i) => (
            <div
              key={i}
              className="stats-card"
            >

              <h3 className="stats-number">
                {item.number}
              </h3>

              <p className="stats-title">
                {item.title}
              </p>

              <div className="stats-line" />

            </div>
          ))}

        </div>

      </div>

    </section>
  );
}