import Layout from '@/components/Layout';
import { Zap } from 'lucide-react';
import { serviceImages } from '@/data/sneakercareImages';

export default function MainServices() {
  const services = [
    {
      name: 'Standard Clean',
      price: 'R100',
      description: 'For pairs that just need a refresh. We handle the upper, mid sole, and laces — straightforward, thorough, and done right.',
      tags: ['Upper', 'Mid Sole', 'Laces'],
      featured: false
    },
    {
      name: 'The 95 Deluxe',
      price: 'R220',
      description: 'Our signature service. Nothing is left behind — upper, inset stains, mid sole, laces, inner sole, under sole detailing, deodorizing, and a sneaker protector application. This is the full reset your pair has been waiting for.',
      tags: ['Upper Clean', 'Inset Stains', 'Mid Sole', 'Inner Sole', 'Deodorizing', 'Protector Included'],
      featured: true
    },
    {
      name: 'Deep Clean',
      price: 'R120',
      description: 'When a standard clean isn\'t enough. We go into the inset stains and inner sole to pull out what daily wear leaves behind.',
      tags: ['Upper', 'Inset Stains', 'Mid Sole', 'Inner Sole'],
      featured: false
    },
    {
      name: 'Intense Deep Clean',
      price: 'R240',
      description: 'Maximum effort for maximum neglect. An intensified upper clean that goes further — for pairs that have been through it.',
      tags: ['Intensified Upper', 'Inset Stains', 'Mid Sole', 'Inner Sole'],
      featured: false
    },
    {
      name: 'Suede/Nubuck Maintenance Clean',
      price: 'R200',
      description: 'Suede and nubuck demand specialist handling. This isn\'t a regular clean — it\'s a dedicated maintenance protocol for the materials that break under pressure.',
      tags: ['Suede Safe', 'Nubuck Safe', 'Specialist Method'],
      featured: false
    }
  ];

  const imageByService = new Map(serviceImages.map((image) => [image.matchedItem, image]));

  return (
    <Layout>
      {/* Header */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-16 md:py-24">
        <div className="container text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">Main Services</h1>
          <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto">
            Our core sneaker cleaning packages, designed to bring your pairs back to life.
          </p>
        </div>
      </section>

      {/* Blue Divider */}
      <div className="red-divider" />

      {/* Services Grid */}
      <section className="bg-white py-20 md:py-28">
        <div className="container max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, idx) => (
              <div
                key={idx}
                className={`card-modern group relative flex flex-col h-full ${
                  service.featured ? 'lg:col-span-3 md:col-span-2 border-2 border-accent transform md:scale-105 hover:scale-105 z-10 shadow-xl bg-blue-50/30' : ''
                }`}
              >
                {service.featured && (
                  <div className="absolute -top-4 right-8 bg-accent text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg">
                    Hero Service
                  </div>
                )}
                
                <div className={`relative overflow-hidden rounded-2xl bg-blue-50 border border-blue-100 mb-6 ${
                  service.featured ? 'h-64 lg:h-80' : 'h-56'
                }`}>
                  {imageByService.get(service.name) ? (
                    <img
                      src={imageByService.get(service.name)!.src}
                      alt={imageByService.get(service.name)!.alt}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-gray-400 font-semibold">
                      Photo — {service.name}
                    </div>
                  )}
                  <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-blue-600 via-[#bf616a] to-[#0b0d12]" />
                </div>

                <div className="flex-grow flex flex-col">
                  <div className="flex justify-between items-start mb-3 gap-4">
                    <h3 className={`${service.featured ? 'text-3xl' : 'text-2xl'} font-bold text-foreground`}>
                      {service.name}
                    </h3>
                    <span className="text-xl font-bold text-accent whitespace-nowrap">
                      {service.price}
                    </span>
                  </div>

                  <p className="text-gray-600 mb-6 leading-relaxed text-base flex-grow">
                    {service.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-8">
                    {service.tags.map((tag, tagIdx) => (
                      <span key={tagIdx} className="bg-blue-100 text-blue-800 text-xs px-2.5 py-1 rounded-md font-semibold">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-auto">
                  <a 
                    href={`https://wa.me/27665884466?text=Hi%2C%20I%27d%20like%20to%20book%20${encodeURIComponent(service.name)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`block w-full text-center uppercase font-bold py-3 px-4 rounded-lg transition-all duration-300 ${
                      service.featured 
                        ? 'bg-gradient-to-r from-accent to-blue-600 text-white hover:shadow-lg' 
                        : 'bg-foreground text-white hover:bg-accent'
                    }`}
                  >
                    Book via WhatsApp
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
