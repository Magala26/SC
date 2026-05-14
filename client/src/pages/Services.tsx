import { Link } from 'wouter';
import { trpc } from '@/lib/trpc';
import Layout from '@/components/Layout';
import { Zap, Award } from 'lucide-react';
import { serviceImages } from '@/data/sneakercareImages';

export default function Services() {
  const { data: services = [], isLoading } = trpc.sneaker.services.list.useQuery();
  const fallbackServices = [
    { id: 1, name: 'Standard Clean', description: 'A focused refresh for everyday pairs, covering the upper, mid sole, and laces.', price: 10000 },
    { id: 2, name: 'The 95 Deluxe', description: 'Our full reset service for pairs that need complete attention across the upper, sole, laces, inner sole, deodorizing, and protector application.', price: 22000 },
    { id: 3, name: 'Deep Clean', description: 'A deeper care session for inset stains, inner sole buildup, and daily wear that needs more than a standard clean.', price: 12000 },
    { id: 4, name: 'Intense Deep Clean', description: 'Maximum effort for neglected pairs that need intensified upper cleaning and deeper detail work.', price: 24000 },
    { id: 5, name: 'Suede/Nubuck Maintenance Clean', description: 'Specialist care for suede and nubuck materials using a dedicated maintenance approach.', price: 20000 },
  ];
  const displayServices = services.length > 0 ? services : fallbackServices;
  const imageByService = new Map(serviceImages.map((image) => [image.matchedItem, image]));

  return (
    <Layout>
      {/* Header */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-16 md:py-24">
        <div className="container">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">Our Services</h1>
          <p className="text-lg md:text-xl opacity-90 max-w-2xl">
            Comprehensive sneaker care solutions tailored to your collection's needs
          </p>
        </div>
      </section>

      {/* Blue Divider */}
      <div className="red-divider" />

      {/* Services Grid */}
      <section className="bg-white py-20 md:py-28">
        <div className="container">
          {isLoading ? (
            <p className="text-center text-gray-600">Loading services...</p>
          ) : displayServices.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {displayServices.map((service, idx) => {
                const serviceImage = imageByService.get(service.name);

                return (
                <div
                  key={service.id}
                  className="card-modern group relative overflow-hidden"
                  style={{
                    animation: `fadeInUp 0.6s ease-out ${idx * 0.1}s both`
                  }}
                >
                  {/* Background gradient on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  <div className="relative z-10">
                    <div className="relative mb-6 h-64 overflow-hidden rounded-2xl border border-blue-100 bg-blue-50 shadow-sm">
                      {serviceImage ? (
                        <img
                          src={serviceImage.src}
                          alt={serviceImage.alt}
                          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                          loading="lazy"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-blue-400 to-blue-600 text-white font-bold text-5xl">
                          {service.name.charAt(0)}
                        </div>
                      )}
                      <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-blue-600 via-[#bf616a] to-[#0b0d12]" />
                    </div>

                    {/* Service Name */}
                    <h3 className="text-2xl font-bold mb-3 text-foreground group-hover:text-accent transition-colors">
                      {service.name}
                    </h3>

                    {/* Service Description */}
                    <p className="text-gray-600 mb-6 leading-relaxed text-base">
                      {service.description}
                    </p>

                    {/* Service Details */}
                    <div className="mb-6 py-4 border-t border-b border-gray-100">
                      <div className="flex items-center gap-2">
                        <Zap size={18} className="text-accent" />
                        <div>
                          <p className="text-xs text-gray-500 uppercase font-semibold">Price</p>
                          <p className="text-lg font-bold text-accent">
                            R {(service.price / 100).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* CTA Button */}
                    <Link href="/booking" className="btn-primary inline-block w-full text-center">
                      Book This Service
                    </Link>
                  </div>
                </div>
                );
              })}
            </div>
          ) : (
            <p className="text-center text-gray-600">No services available</p>
          )}
        </div>
      </section>

      {/* Blue Divider */}
      <div className="red-divider" />

      {/* Why Choose Us */}
      <section className="bg-gradient-to-br from-blue-50 to-white py-20 md:py-28">
        <div className="container">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16" style={{
            background: 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Why Choose Us?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Award,
                title: 'Expert Care',
                description: 'Our specialists understand sneaker materials and restoration techniques.'
              },
              {
                icon: Zap,
                title: 'Premium Results',
                description: 'We use professional-grade products and methods for optimal outcomes.'
              }
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="card-modern text-center group">
                  <div className="mb-4 h-16 w-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl mx-auto flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300">
                    <Icon size={28} />
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-foreground">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Blue Divider */}
      <div className="red-divider" />

      {/* CTA */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 py-20 md:py-28 text-center text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full mix-blend-multiply filter blur-3xl opacity-10" />
        <div className="container relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-lg md:text-xl mb-10 max-w-2xl mx-auto opacity-90">
            Choose your service and book your appointment today
          </p>
          <Link href="/booking" className="inline-block bg-white text-blue-600 px-8 py-4 font-bold uppercase rounded-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
            Book Your Service Now
          </Link>
        </div>
      </section>
    </Layout>
  );
}
