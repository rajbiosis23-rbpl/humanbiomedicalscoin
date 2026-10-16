"use client";

import {
  useEffect,
  useState,
} from "react";

import { fetchContactData, fetchDistrictData } from "@/lib/data-fetcher";

import toast, {
  Toaster,
} from "react-hot-toast";

import "./contact.css";

export default function ContactPage({
  city = "",
}) {

  const [contactInfo,
    setContactInfo
  ] = useState([]);

  const [districtData,
    setDistrictData
  ] = useState(null);

  const [name, setName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [phone, setPhone] =
    useState("");

  const [message, setMessage] =
    useState("");

  const [loading, setLoading] =
    useState(false);
  const lat = "26.8952";
  const lng = "75.7453";
  // FORMAT CITY
  const formattedCity =
    city
      ? city
        .replace(/-/g, " ")
        .replace(
          /\b\w/g,
          (char) =>
            char.toUpperCase()
        )
      : "India";

  // FETCH CONTACT INFO
  useEffect(() => {

    const fetchContact =
      async () => {

        try {
          const data = await fetchContactData();
          if (Array.isArray(data)) {
            setContactInfo(data);
          } else if (data?.contactInfo) {
            setContactInfo(data.contactInfo);
          }

        } catch (error) {

          console.log(error);

        }
      };

    fetchContact();

  }, []);

  // FETCH DISTRICT
  useEffect(() => {

    const fetchDistrict =
      async () => {

        if (!city)
          return;

        try {
          const data = await fetchDistrictData(city);
          if (data) {
            setDistrictData(data);
          }

        } catch (error) {

          console.log(error);

        }
      };

    fetchDistrict();

  }, [city]);

  // DYNAMIC LOCATION
  const dynamicLocation =
    city &&
      districtData &&
      city.toLowerCase() !==
      "jaipur"
      ? `${districtData.district || districtData.name || ""}, ${districtData.state || ""}, India`
      : null;

  // Helper to safely extract string parts whether value is a string, array, number, or object
  const extractParts = (raw) => {
    if (raw == null) return [];
    if (Array.isArray(raw)) {
      return raw.flatMap(extractParts);
    }
    if (typeof raw === "object") {
      return [String(raw.value || raw.text || raw.label || JSON.stringify(raw))];
    }
    return String(raw)
      .split(/[,/|\n]/)
      .map((v) => v.trim())
      .filter(Boolean);
  };

  // ADMIN ADDRESS
  const rawAdminAddress =
    contactInfo.find(
      (item) =>
        item.label
          ?.toLowerCase()
          ?.trim() ===
        "office address" ||
        item.label
          ?.toLowerCase()
          ?.includes("address")
    )?.value;

  const adminAddress = Array.isArray(rawAdminAddress)
    ? rawAdminAddress.join(", ")
    : (rawAdminAddress ? String(rawAdminAddress) : "");

  // FINAL ADDRESS
  const finalAddress =
    dynamicLocation ||
    adminAddress ||
    "";

  // SEND MESSAGE
  const sendMessage =
    async (e) => {

      e.preventDefault();

      if (!name.trim()) {
        toast.error("Please enter your name");
        return;
      }

      const emailRegex =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailRegex.test(email)) {
        toast.error("Please enter a valid email");
        return;
      }

      if (!/^\d{10}$/.test(phone)) {
        toast.error(
          "Phone number must be exactly 10 digits"
        );
        return;
      }

      if (!message.trim()) {
        toast.error("Please enter your message");
        return;
      }
      if (
        !name ||
        !email ||
        !phone ||
        !message
      ) {

        toast.error(
          "Please fill all fields"
        );

        return;
      }

      try {

        setLoading(true);

        const res = await fetch("/api/contact-query", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            city: formattedCity,
            name: name.trim(),
            email: email.trim(),
            phone: phone.trim(),
            message: message.trim(),
          }),
        });

        const result = await res.json();

        if (!res.ok || !result.success) {
          throw new Error(result.error || "Failed To Send Message");
        }

        toast.success(
          "Message Sent Successfully"
        );

        setName("");
        setEmail("");
        setPhone("");
        setMessage("");

      } catch (error) {

        console.log(error);

        toast.error(
          error.message || "Failed To Send Message"
        );

      } finally {

        setLoading(false);

      }
    };

  return (

    <main>

      <Toaster
        position="top-right"
        containerStyle={{
          zIndex: 999999,
        }}
      />

      {/* HERO */}
      <section className="contact-hero">

        <div className="container-custom">

          <div className="contact-grid">

            {/* LEFT */}
            <div>

              <span className="section-subtitle">
                CONTACT Human Biomedicals
              </span>

              <h1 className="contact-title mt-6">

                Let’s Connect
                With Human Biomedicals

                {city && (
                  <>
                    <br />
                    in {formattedCity}
                  </>
                )}

              </h1>

              <p className="contact-desc">

                Have questions about our
                biomedical products,
                healthcare technologies or
                laboratory solutions

                {city && (
                  <>
                    {" "}in{" "}
                    <strong>
                      {formattedCity}
                    </strong>
                  </>
                )}?

                Get in touch with our expert
                team today.

              </p>

            </div>

            {/* FORM */}
            <div className="contact-form-card">

              <form
                className="contact-form"
                onSubmit={sendMessage}
              >

                <input
                  type="text"
                  placeholder="Full Name"
                  className="contact-input"
                  value={name}
                  required
                  onChange={(e) => setName(e.target.value)}
                />

                <input
                  type="email"
                  placeholder="Email Address"
                  className="contact-input"
                  value={email}
                  required
                  onChange={(e) => setEmail(e.target.value)}
                />

                <input
                  type="text"
                  placeholder="Phone Number"
                  className="contact-input"
                  value={phone}
                  required
                  maxLength={10}
                  pattern="[0-9]{10}"
                  onChange={(e) =>
                    setPhone(e.target.value.replace(/\D/g, ""))
                  }
                />

                <textarea
                  placeholder="Write Your Message"
                  className="contact-textarea"
                  value={message}
                  required
                  onChange={(e) => setMessage(e.target.value)}
                />

                <button
                  type="submit"
                  className="contact-btn"
                  disabled={loading}
                >

                  {loading
                    ? "Sending..."
                    : "Send Message"}

                </button>

              </form>

            </div>

          </div>

        </div>

      </section>

      {/* CONTACT INFO */}
      <section className="contact-info">

        <div className="container-custom">

          <div className="text-center mb-20">

            <span className="section-subtitle">
              CONTACT DETAILS
            </span>

            <h2 className="section-title mt-4">

              Get In Touch
              With Us

            </h2>

          </div>

          <div className="contact-info-grid">

            {contactInfo
              .map((item, index) => {

                let value =
                  item.value;

                const label =
                  item.label
                    ?.toLowerCase()
                    ?.trim() || "";

                // ONLY ADDRESS DYNAMIC IF CITY GIVEN
                if (
                  label === "office address" ||
                  label.includes("address")
                ) {
                  value =
                    finalAddress || value;
                }

                const isPhone =
                  label.includes("phone") ||
                  label.includes("mobile") ||
                  label.includes("call") ||
                  label.includes("contact") ||
                  label.includes("tel") ||
                  label.includes("whatsapp");
                const isEmail = label.includes("email") || label.includes("mail");
                const isAddress = label.includes("address") || label.includes("office") || label.includes("location");

                const parts = extractParts(value);

                return (
                  <div
                    key={index}
                    className="contact-card"
                  >
                    <div className="contact-card-icon-wrap" aria-hidden="true">
                      {isPhone ? (
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                        </svg>
                      ) : isEmail ? (
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect width="20" height="16" x="2" y="4" rx="2"/>
                          <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                        </svg>
                      ) : (
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
                          <circle cx="12" cy="10" r="3"/>
                        </svg>
                      )}
                    </div>

                    <h3>
                      {item.label}
                    </h3>

                    <div className="contact-card-values">
                      {parts.map((part, pIdx) => {
                        const partStr = String(part ?? "").trim();
                        if (!partStr) return null;

                        if (isPhone) {
                          const cleanTel = partStr.replace(/\s+/g, "").replace(/[^0-9+]/g, "");
                          return (
                            <p key={pIdx}>
                              <a href={`tel:${cleanTel}`}>
                                {partStr}
                              </a>
                            </p>
                          );
                        }
                        if (isEmail) {
                          return (
                            <p key={pIdx}>
                              <a href={`mailto:${partStr}`}>
                                {partStr}
                              </a>
                            </p>
                          );
                        }
                        return (
                          <p key={pIdx}>
                            {partStr}
                          </p>
                        );
                      })}
                    </div>

                  </div>
                );
              })}

          </div>

        </div>

      </section>

      {/* MAP */}
      <section className="map-section">

        <div className="container-custom">

          <div className="map-box">

            <iframe
              src={`https://maps.google.com/maps?q=${lat},${lng}&z=15&output=embed`}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
            />

          </div>

        </div>

      </section>

    </main>
  );
}