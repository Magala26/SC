import { Phone, Mail, MapPin, MessageCircle, Instagram, Music } from 'lucide-react';
import logoUrl from '@/assets/logo.jpg';

export default function Footer() {
  const operatingHours = [
    { day: 'Monday - Friday', hours: '9:00 AM - 5:00 PM' },
    { day: 'Saturday', hours: '9:00 AM - 3:00 PM' },
    { day: 'Sunday', hours: 'Closed' },
    { day: 'Public Holidays', hours: '9:00 AM - 1:00 PM' },
  ];

  return (
    <footer className="bg-gradient-to-b from-white via-blue-50/40 to-[#0b0d12] border-t border-blue-100 mt-auto">
      <div className="red-divider" />
      <div className="container py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 bg-white/90 backdrop-blur-sm border border-blue-100 rounded-3xl p-8 md:p-10 shadow-[0_24px_60px_rgba(15,23,42,0.12)]">
          {/* Brand */}
          <div>
            <img 
              src={logoUrl} 
              alt="Sneaker Care Department" 
              className="h-20 w-auto mb-4 rounded-xl shadow-sm"
            />
            <p className="text-sm text-gray-600 leading-relaxed border-l-4 border-[#bf616a] pl-4">
              Professional sneaker cleaning, restoration, and premium care services for your most prized collection.
            </p>
          </div>

          {/* Operating Hours */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-foreground tracking-wider">Operating Hours</h3>
            <div className="text-sm space-y-2">
              {operatingHours.map((item, idx) => (
                <div key={idx} className="flex justify-between text-gray-600">
                  <span className="font-semibold">{item.day}:</span>
                  <span className="text-accent font-semibold">{item.hours}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Contact & Social */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-foreground tracking-wider">Contact</h3>
            <div className="text-sm space-y-3 mb-6">
              <div className="flex items-center gap-3 text-gray-600">
                <Mail size={18} className="text-accent flex-shrink-0" />
                <a href="mailto:sneakercaredepartment@yahoo.com" className="hover:text-accent transition-colors">
                  sneakercaredepartment@yahoo.com
                </a>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <Phone size={18} className="text-accent flex-shrink-0" />
                <a href="tel:0665884466" className="hover:text-accent transition-colors">
                  0665884466
                </a>
              </div>
              <div className="flex items-start gap-3 text-gray-600">
                <MapPin size={18} className="text-accent flex-shrink-0 mt-0.5" />
                <div>
                  <p>96 Vorster Avenue</p>
                  <p>Glenanda, Johannesburg South</p>
                  <p>South Africa</p>
                </div>
              </div>
            </div>
            <h3 className="text-lg font-bold mb-3 text-foreground">Follow Us</h3>
            <div className="flex gap-3">
              <a
                href="https://wa.me/27665884466"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-[#0b0d12] text-white rounded-xl hover:bg-[#bf616a] transition-colors shadow-md"
                title="WhatsApp"
              >
                <MessageCircle size={18} />
              </a>
              <a
                href="https://www.instagram.com/weluvsneakercare/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-[#bf616a] text-white rounded-xl hover:bg-blue-600 transition-colors shadow-md"
                title="Instagram"
              >
                <Instagram size={18} />
              </a>
              <a
                href="https://www.tiktok.com/@weluvsneakercare"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-blue-600 text-white rounded-xl hover:bg-[#0b0d12] transition-colors shadow-md"
                title="TikTok"
              >
                <Music size={18} />
              </a>
            </div>
          </div>
        </div>

        {/* Blue Divider */}
        <div className="red-divider my-8" />

        {/* Copyright */}
        <div className="text-center text-sm text-white/80">
          <p>&copy; 2026 Sneaker Care Department. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
