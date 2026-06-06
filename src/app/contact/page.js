"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  doc,
  getDoc,
  getDocs,
  collection,
  query,
  where,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

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

          const snap =
            await getDoc(
              doc(
                db,
                "websites",
                "humanbiomedicalscoin",
                "pages",
                "contact"
              )
            );

          if (snap.exists()) {

            setContactInfo(
              snap.data()
                ?.contactInfo || []
            );

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

          const q =
            query(
              collection(
                db,
                "websites",
                "humanbiomedicalscoin",
                "districts"
              ),
              where(
                "slug",
                "==",
                city.toLowerCase()
              )
            );

          const snapshot =
            await getDocs(q);

          if (
            !snapshot.empty
          ) {

            setDistrictData(
              snapshot.docs[0].data()
            );

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
      ? `${districtData.district}, ${districtData.state}, India`
      : null;

  // ORIGINAL FIREBASE ADDRESS
  const firebaseAddress =
    contactInfo.find(
      (item) =>
        item.label
          ?.toLowerCase()
          ?.trim() ===
        "office address"
    )?.value;

  // FINAL ADDRESS
  const finalAddress =
    dynamicLocation ||
    firebaseAddress ||
    "Jaipur, Rajasthan, India";

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

        await addDoc(
          collection(
            db,
            "websitesQueries",
            "humanbiomedicalscoin",
            "contactQueries"
          ),
          {

            city:
              formattedCity,

            name,
            email,
            phone,
            message,

            createdAt:
              serverTimestamp(),
          }
        );

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
          "Failed To Send Message"
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

            {contactInfo.map(
              (item, index) => {

                let value =
                  item.value;

                const label =
                  item.label
                    ?.toLowerCase()
                    ?.trim();

                // ONLY ADDRESS DYNAMIC
                if (
                  label ===
                  "office address"
                ) {

                  value =
                    finalAddress;
                }

                return (

                  <div
                    key={index}
                    className="contact-card"
                  >

                    <h3>
                      {item.label}
                    </h3>

                    <p>
                      {value}
                    </p>

                  </div>
                );
              }
            )}

          </div>

        </div>

      </section>

      {/* MAP */}
      <section className="map-section">

        <div className="container-custom">

          <div className="map-box">

            <iframe
              src={`https://maps.google.com/maps?q=${finalAddress}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
              width="100%"
              height="100%"
              style={{
                border: 0,
              }}
              loading="lazy"
            />

          </div>

        </div>

      </section>

    </main>
  );
}