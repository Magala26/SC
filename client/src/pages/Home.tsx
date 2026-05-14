import React from 'react';
import { trpc } from '@/lib/trpc';
import Layout from '@/components/Layout';
import { Sparkles } from 'lucide-react';
import InstagramReelsSlider from '@/components/InstagramReelsSlider';
import { workImages, serviceImages, subscriptionOfferImages } from '@/data/sneakercareImages';
import logoUrl from '@/assets/logo.jpg';
import rotationSneakerUrl from '@/assets/rotation-sneaker.png';
import heroBgUrl from '@/assets/hero-bg.png';

function Link({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) {
  return (
    <a href={href} className={className}>
      {children}
    </a>
  );
}

const WorkGallery = () => {
    const [stopScroll, setStopScroll] = React.useState(false);
    const cardData = workImages.slice(0, 8);

    return (
        <section className="bg-white py-20 md:py-28 overflow-hidden">
            <div className="container">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{
                        background: 'linear-gradient(135deg, #0b0d12 0%, #2563eb 48%, #bf616a 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text'
                    }}>
                        Our Work
                    </h2>
                    <p className="text-gray-600 text-lg">A showcase of our premium sneaker restorations</p>
                </div>

                <style>{`
                    .marquee-inner {
                        animation: marqueeScroll linear infinite;
                    }

                    @keyframes marqueeScroll {
                        0% {
                            transform: translateX(0%);
                        }

                        100% {
                            transform: translateX(-50%);
                        }
                    }
                `}</style>

                <div className="overflow-hidden w-full relative max-w-6xl mx-auto" onMouseEnter={() => setStopScroll(true)} onMouseLeave={() => setStopScroll(false)}>
                    <div className="absolute left-0 top-0 h-full w-20 z-10 pointer-events-none bg-gradient-to-r from-white to-transparent" />
                    <div className="marquee-inner flex w-fit" style={{ animationPlayState: stopScroll ? "paused" : "running", animationDuration: cardData.length * 2500 + "ms" }}>
                        <div className="flex">
                            {[...cardData, ...cardData].map((card, index) => (
                                <div key={index} className="w-56 mx-4 h-[20rem] relative group hover:scale-90 transition-all duration-300 rounded-xl overflow-hidden shadow-md">
                                    <img src={card.src} alt={card.alt} className="w-full h-full object-cover" loading="lazy" />
                                    <div className="flex items-center justify-center px-4 opacity-0 group-hover:opacity-100 transition-all duration-300 absolute bottom-0 backdrop-blur-md left-0 w-full h-full bg-black/40">
                                        <p className="text-white text-lg font-bold text-center uppercase">{card.caption}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="absolute right-0 top-0 h-full w-20 md:w-40 z-10 pointer-events-none bg-gradient-to-l from-white to-transparent" />
                </div>
            </div>
        </section>
    );
};

export default function Home() {
  const { data: services = [], isLoading } = trpc.sneaker.services.list.useQuery();

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-[85vh] md:min-h-[90vh] flex flex-col justify-center py-20 overflow-hidden border-b border-blue-100">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 w-full h-full pointer-events-none bg-white">
          <img 
            src={heroBgUrl} 
            alt="Sneaker Care Hero Background" 
            className="absolute inset-0 w-full h-full object-cover object-[center_30%] md:object-center opacity-60 brightness-[0.9]"
          />
          {/* Gradients for readability (White Tint) */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-white/20 to-white/80" />
          <div className="absolute inset-0 bg-gradient-to-r from-white/80 via-white/30 to-transparent" />
        </div>
        
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-[100px] opacity-60 animate-pulse" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#bf616a] rounded-full mix-blend-multiply filter blur-[100px] opacity-20 animate-pulse" />
        
        <div className="container text-center relative z-10 flex flex-col items-center mt-10 md:mt-0">
          <div className="inline-flex items-center gap-2 mb-8 bg-white/40 backdrop-blur-md border border-white/50 px-4 py-2 rounded-full shadow-sm">
            <span className="text-xs font-bold text-[#2a76e2] uppercase tracking-[0.16em]">Premium Sneaker Care</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black mb-6 leading-[1.1] max-w-4xl text-gray-900 drop-shadow-sm mx-auto">
            <span className="block mb-2">Professional</span>
            <span className="block mb-2">Sneaker</span>
            <span style={{
              background: 'linear-gradient(135deg, #0b0d12 0%, #2563eb 48%, #bf616a 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              Cleaning & Restoration
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-700 mb-10 max-w-2xl mx-auto leading-relaxed font-medium">
            Professional cleaning, restoration, and premium care for your most prized sneaker collection.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-5 w-full sm:w-auto justify-center">
            <Link href="/booking" className="btn-primary inline-block text-center px-6 py-3 text-base shadow-[0_4px_14px_0_rgba(37,99,235,0.39)] hover:shadow-[0_6px_20px_rgba(37,99,235,0.23)] hover:bg-blue-600 w-full sm:w-auto border-none transition-all">
              Book Your Clean
            </Link>
            <Link href="/services" className="bg-white/50 hover:bg-white/80 text-gray-900 border border-gray-200 backdrop-blur-sm inline-block text-center px-6 py-3 rounded-xl font-bold uppercase transition-all duration-300 w-full sm:w-auto shadow-sm hover:shadow-md text-base">
              Explore Services
            </Link>
          </div>
        </div>
      </section>

      {/* Blue Divider */}
      <div className="red-divider" />

      {/* Service Highlights */}
      <section className="bg-white py-20 md:py-28 relative overflow-hidden" id="our-services">
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-blue-50/70 to-transparent pointer-events-none" />
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{
              background: 'linear-gradient(135deg, #0b0d12 0%, #2563eb 48%, #bf616a 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              Our Services
            </h2>
            <p className="text-gray-600 text-lg">Premium sneaker care packages tailored to your collection's needs</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { name: 'Standard Clean', price: 'R100', desc: 'For pairs that just need a refresh. We handle the upper, mid sole, and laces.', image: serviceImages[0] },
              { name: 'The 95 Deluxe', price: 'R220', desc: 'Our signature service. Nothing is left behind. The full reset your pair has been waiting for.', featured: true, image: serviceImages[1] },
              { name: 'Deep Clean', price: 'R120', desc: "When a standard clean isn't enough. We go into the inset stains and inner sole.", image: serviceImages[2] },
              { name: 'Intense Deep Clean', price: 'R240', desc: 'Maximum effort for maximum neglect. An intensified upper clean that goes further.', image: serviceImages[3] },
              { name: 'Suede/Nubuck Maintenance Clean', price: 'R200', desc: "Suede and nubuck demand specialist handling. A dedicated maintenance protocol.", image: serviceImages[4] }
            ].map((service, idx) => (
              <div key={idx} className={`card-modern flex flex-col group ${service.featured ? 'border-2 border-accent transform md:scale-105 z-10 shadow-xl' : ''}`}>
                <div className="w-full h-48 bg-gradient-to-br from-blue-50 via-white to-[#bf616a]/10 rounded-xl flex items-center justify-center border-2 border-dashed border-blue-200 text-gray-500 font-semibold mb-6 group-hover:border-[#bf616a]/50 overflow-hidden">
                  <img src={service.image.src} alt={service.image.alt} className="w-full h-full object-cover" />
                </div>
                <h3 className="font-bold text-xl mb-2 text-foreground">{service.name}</h3>
                <p className="text-sm text-gray-600 mb-4 flex-grow">{service.desc}</p>
                <div className="flex justify-between items-center pt-4 border-t border-gray-100 mb-4">
                  <span className="text-[#bf616a] font-black text-lg tracking-wide">{service.price}</span>
                </div>
                <Link href="/main-services" className={`w-full text-center py-3 px-4 rounded-xl font-bold uppercase transition-all duration-300 ${service.featured ? 'bg-gradient-to-r from-[#bf616a] via-blue-600 to-[#0b0d12] text-white shadow-lg' : 'bg-white border-2 border-foreground text-foreground hover:bg-foreground hover:text-white hover:border-[#bf616a]'}`}>
                  View Details
                </Link>
              </div>
            ))}
          </div>

          <div className="mt-16 flex flex-col sm:flex-row gap-6 justify-center">
            <Link href="/additional-services" className="btn-outline inline-block text-center">
              Explore Additional Services
            </Link>
            <Link href="/products" className="btn-outline inline-block text-center">
              Shop Sneaker Products
            </Link>
          </div>
        </div>
      </section>

      {/* Blue Divider */}
      <div className="red-divider" />

      {/* Rotation Refresh Plan Teaser */}
      <section id="rotation-refresh-preview" className="rrp-home-teaser bg-gradient-to-br from-[#0b0d12] via-blue-950 to-white py-20 md:py-28 overflow-hidden text-white">
        <div className="container">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            {/* Left Copy */}
            <div className="w-full lg:w-1/2">
              <div className="inline-flex items-center gap-2 mb-6 bg-white border border-blue-100 px-4 py-2 rounded-full shadow-sm">
                <Sparkles size={16} className="text-accent" />
                <span className="text-sm font-semibold text-accent uppercase tracking-wider">Premium Sneaker Care Membership</span>
              </div>
              
              <p className="text-xl md:text-2xl font-bold mb-3 tracking-widest uppercase" style={{ color: '#bf616a' }}>
                The Rotation Refresh Plan
              </p>
              
              <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight text-white" style={{
                fontFamily: '"Playfair Display", Georgia, serif'
              }}>
                Keep every pair in your rotation looking box-fresh — every month.
              </h2>
              
              <p className="text-lg text-white/75 mb-8 leading-relaxed">
                Stop letting dirty sneakers kill the look, value, and confidence of your collection. Get monthly professional sneaker care built for collectors, resellers, athletes, and serious sneaker lovers who refuse to let their rotation fall off.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/rotation-refresh-plan" className="btn-primary inline-block text-center">
                  Explore The Plan
                </Link>
                <a href="https://wa.me/27665884466" className="btn-outline inline-block text-center">
                  Ask On WhatsApp
                </a>
              </div>
            </div>

            {/* Right Visual */}
            <div className="w-full lg:w-1/2 flex justify-center">
              <div className="relative w-full max-w-md">
                <div className="absolute inset-0 bg-gradient-to-r from-[#bf616a]/20 to-blue-500/20 rounded-3xl blur-2xl" />
                <img 
                  src={subscriptionOfferImages[1]?.src || rotationSneakerUrl}
                  alt="Rotation Refresh Plan"
                  className="relative w-full h-auto rounded-2xl shadow-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Blue Divider */}
      <div className="red-divider" />

      {/* Work Gallery */}
      <WorkGallery />

      {/* Blue Divider */}
      <div className="red-divider" />

      {/* Instagram Reels */}
      <section className="bg-white py-20 md:py-28">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{
              background: 'linear-gradient(135deg, #0b0d12 0%, #2563eb 48%, #bf616a 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              Follow Our Journey
            </h2>
            <p className="text-gray-600 text-lg">See our latest sneaker transformations on Instagram</p>
          </div>
          <InstagramReelsSlider />
        </div>
      </section>

      {/* Blue Divider */}
      <div className="red-divider" />

      {/* Final CTA */}
      <section className="bg-gradient-to-r from-[#bf616a] via-blue-600 to-[#0b0d12] py-20 md:py-28 text-white text-center">
        <div className="container max-w-2xl">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Refresh Your Kicks?</h2>
          <p className="text-lg mb-10 text-white/90">
            Join hundreds of sneaker enthusiasts who trust us with their most prized collections.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/booking" className="btn-primary inline-block text-center">
              Book Your Clean Today
            </Link>
            <Link href="/rotation-refresh-plan" className="inline-block bg-white text-[#bf616a] px-8 py-4 font-bold uppercase rounded-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
              Explore Membership
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
