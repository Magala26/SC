import { Link } from 'wouter';
import Layout from '@/components/Layout';
import { Mail, Phone, MapPin, Clock, MessageCircle, Instagram, Music } from 'lucide-react';

export default function Contact() {
  const operatingHours = [
    { day: 'Monday - Friday', hours: '9:00 AM - 5:00 PM' },
    { day: 'Saturday', hours: '9:00 AM - 3:00 PM' },
    { day: 'Sunday', hours: 'Closed' },
    { day: 'Public Holidays', hours: '9:00 AM - 1:00 PM' },
  ];

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    alert('Thank you for reaching out! We will get back to you soon.');
  };

  return (
    <Layout>
      {/* Header */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-16 md:py-24">
        <div className="container">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">Contact Us</h1>
          <p className="text-lg md:text-xl opacity-90">Get in touch with Sneaker Care Department. We're here to help!</p>
        </div>
      </section>

      {/* Blue Divider */}
      <div className="red-divider" />

      {/* Contact Information & Form */}
      <section className="bg-white py-20 md:py-28">
        <div className="container grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8">Get In Touch</h2>

            {/* Phone */}
            <div className="card-modern flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-gradient-to-br from-blue-400 to-blue-600 text-white">
                  <Phone className="h-6 w-6" />
                </div>
              </div>
              <div>
                <h3 className="font-bold text-foreground mb-2">Phone</h3>
                <a href="tel:0665884466" className="text-lg text-accent hover:underline transition-colors font-semibold">
                  0665884466
                </a>
              </div>
            </div>

            {/* Email */}
            <div className="card-modern flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-gradient-to-br from-blue-400 to-blue-600 text-white">
                  <Mail className="h-6 w-6" />
                </div>
              </div>
              <div>
                <h3 className="font-bold text-foreground mb-2">Email</h3>
                <a href="mailto:sneakercaredepartment@yahoo.com" className="text-lg text-accent hover:underline transition-colors font-semibold">
                  sneakercaredepartment@yahoo.com
                </a>
              </div>
            </div>

            {/* Operating Hours */}
            <div className="card-modern">
              <div className="flex gap-4 mb-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-gradient-to-br from-blue-400 to-blue-600 text-white">
                    <Clock className="h-6 w-6" />
                  </div>
                </div>
                <h3 className="font-bold text-foreground">Operating Hours</h3>
              </div>
              <div className="space-y-2 text-sm pl-16">
                {operatingHours.map((item, idx) => (
                  <div key={idx} className="flex justify-between gap-4">
                    <span className="font-semibold text-foreground">{item.day}:</span>
                    <span className="text-accent font-semibold">{item.hours}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Location */}
            <div className="card-modern flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-gradient-to-br from-blue-400 to-blue-600 text-white">
                  <MapPin className="h-6 w-6" />
                </div>
              </div>
              <div>
                <h3 className="font-bold text-foreground mb-2">Location</h3>
                <p className="text-lg text-gray-600">96 Vorster Avenue</p>
                <p className="text-lg text-gray-600">Glenanda, Johannesburg South</p>
                <p className="text-lg text-gray-600">South Africa</p>
              </div>
            </div>

            {/* Social Media */}
            <div className="card-modern">
              <h3 className="font-bold text-foreground mb-6 text-lg">Follow Us</h3>
              <div className="flex gap-4 flex-wrap">
                {/* WhatsApp */}
                <a
                  href="https://wa.me/27665884466"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-gradient-to-br from-green-400 to-green-600 text-white px-4 py-3 rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-300 font-semibold"
                >
                  <MessageCircle className="h-5 w-5" />
                  WhatsApp
                </a>

                {/* Instagram */}
                <a
                  href="https://www.instagram.com/weluvsneakercare/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-gradient-to-br from-pink-400 to-pink-600 text-white px-4 py-3 rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-300 font-semibold"
                >
                  <Instagram className="h-5 w-5" />
                  Instagram
                </a>

                {/* TikTok */}
                <a
                  href="https://www.tiktok.com/@weluvsneakercare"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-gradient-to-br from-gray-800 to-black text-white px-4 py-3 rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-300 font-semibold"
                >
                  <Music className="h-5 w-5" />
                  TikTok
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8">Send Us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-6 card-modern">
              <div>
                <label className="block font-bold text-foreground mb-3">Full Name *</label>
                <input
                  type="text"
                  placeholder="Your name"
                  className="w-full border-2 border-gray-200 bg-white p-3 rounded-lg focus:border-accent focus:outline-none transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-foreground mb-3">Email *</label>
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="w-full border-2 border-gray-200 bg-white p-3 rounded-lg focus:border-accent focus:outline-none transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-foreground mb-3">Phone</label>
                <input
                  type="tel"
                  placeholder="+27 (123) 456-7890"
                  className="w-full border-2 border-gray-200 bg-white p-3 rounded-lg focus:border-accent focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block font-bold text-foreground mb-3">Subject *</label>
                <input
                  type="text"
                  placeholder="What is this about?"
                  className="w-full border-2 border-gray-200 bg-white p-3 rounded-lg focus:border-accent focus:outline-none transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-foreground mb-3">Message *</label>
                <textarea
                  placeholder="Your message here..."
                  className="w-full border-2 border-gray-200 bg-white p-3 rounded-lg focus:border-accent focus:outline-none transition-colors min-h-32"
                  required
                />
              </div>

              <button type="submit" className="btn-primary w-full font-bold uppercase">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Blue Divider */}
      <div className="red-divider" />

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 py-20 md:py-28 text-center text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full mix-blend-multiply filter blur-3xl opacity-10" />
        <div className="container relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Book?</h2>
          <p className="text-lg md:text-xl mb-10 max-w-2xl mx-auto opacity-90">
            Don't hesitate to reach out. Our team is ready to help you get your sneakers looking fresh!
          </p>
          <Link href="/booking" className="inline-block bg-white text-blue-600 px-8 py-4 font-bold uppercase rounded-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
            Book Your Service
          </Link>
        </div>
      </section>
    </Layout>
  );
}
