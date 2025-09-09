'use client';

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/Button";

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [mapVisible, setMapVisible] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  };

  // Fade-in map when it enters viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setMapVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    if (mapRef.current) observer.observe(mapRef.current);

    return () => observer.disconnect();
  }, []);

  const inputClass = `
    w-full border border-gray-300 rounded-md p-3 
    focus:outline-none focus:ring-2 focus:ring-green-600 
    transition-all duration-300
    hover:border-green-500
  `;

  return (
    <section className="bg-gray-50 py-16">
      <div className="container mx-auto px-4 max-w-3xl space-y-12">

        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-extrabold text-gray-900">Contact Us</h1>
          <p className="text-gray-600 text-lg">
            Have questions or feedback? Fill out the form below or reach us via email, phone, or social media.
          </p>
        </div>

        {/* Contact Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-8 space-y-6 relative">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Your Name"
              required
              className={inputClass}
            />
            <input
              type="email"
              placeholder="Your Email"
              required
              className={inputClass}
            />
          </div>
          <textarea
            placeholder="Your Message"
            required
            rows={5}
            className={inputClass}
          />
          <Button
            variant="default"
            className="w-full py-3 transform transition-all duration-300 hover:scale-105 hover:shadow-lg"
          >
            Send Message
          </Button>

          {/* Animated Success Toast */}
          <div
            className={`absolute top-0 left-1/2 -translate-x-1/2 transform transition-all duration-500 ${
              submitted ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-10 pointer-events-none"
            } bg-green-100 text-green-800 rounded-md px-6 py-3 shadow-md text-center`}
          >
            Your message has been sent successfully!
          </div>
        </form>

        {/* Contact Info */}
        <div className="bg-white rounded-xl shadow-md p-8 space-y-4 text-center">
          <h2 className="text-2xl font-bold text-gray-900">Other Ways to Reach Us</h2>
          <p className="text-gray-600">
            Email:{" "}
            <a href="mailto:contact@footballhighlight.com" className="text-green-600 hover:underline">
              contact@footballhighlight.com
            </a>
          </p>
          <p className="text-gray-600">
            Phone:{" "}
            <a href="tel:+1234567890" className="text-green-600 hover:underline">
              +1 (234) 567-890
            </a>
          </p>
          <p className="text-gray-600">
            Follow us on social media:{" "}
            <span className="ml-2 space-x-4">
              <a href="#" className="text-green-600 hover:underline">Twitter</a>
              <a href="#" className="text-green-600 hover:underline">Facebook</a>
              <a href="#" className="text-green-600 hover:underline">Instagram</a>
            </span>
          </p>
        </div>

        {/* Google Maps with Fade-in */}
        <div
          ref={mapRef}
          className={`rounded-xl overflow-hidden shadow-md transition-opacity duration-1000 ${
            mapVisible ? "opacity-100" : "opacity-0"
          }`}
        >
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.0197030597566!2d-122.41941508468153!3d37.77492977975959!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8085814c3c7c4c3d%3A0x92cfd24e7d5a5f3e!2sSan+Francisco!5e0!3m2!1sen!2sus!4v1629738749480!5m2!1sen!2sus"
            width="100%"
            height="400"
            className="border-0"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>

      </div>
    </section>
  );
}
