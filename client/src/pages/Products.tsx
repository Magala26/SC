import Layout from '@/components/Layout';
import { CheckCircle2 } from 'lucide-react';
import { productOfferImages } from '@/data/sneakercareImages';

export default function Products() {
  const products = [
    {
      name: 'Sneaker Shampoo 250ml',
      price: 'R180',
      hook: 'The only shampoo your sneakers will ever need.',
      copy: 'Formulated to sustain colour while deep-cleaning across leather, canvas, suede, and mixed materials. Includes a sneaker brush and cloth — everything in one.',
      useCases: [
        'Weekly home maintenance cleaning',
        'Pre-treatment before professional cleans',
        'Safe on delicate materials including suede and nubuck'
      ]
    },
    {
      name: 'Sneaker Wipes',
      price: 'R60 (30pk) / R120 (80pk)',
      hook: 'Because damage doesn\'t wait for you to get home.',
      copy: 'Instant on-the-go care for all sneaker materials. Pull one out, deal with the scuff, keep moving. No water, no setup.',
      useCases: [
        'Immediate spot treatment wherever you are',
        'Works across leather, canvas, suede, and mixed materials',
        'The essential carry for anyone wearing heat daily'
      ]
    },
    {
      name: 'Sneaker Deodorizer 250ml',
      price: 'R100',
      hook: 'Kill the smell. Not the vibe.',
      copy: 'Instant odour control powered by tea tree hygiene. Neutralises odour at the source rather than masking it. Works on the shoe, the bag, and the storage box.',
      useCases: [
        'Post-wear freshness reset',
        'Eliminating deep-set odour from regular wear',
        'Safe for inner sole and lining'
      ]
    },
    {
      name: 'Sneaker Protector 200ml',
      price: 'R150',
      hook: 'Stains and water don\'t stand a chance.',
      copy: 'A stain and water repellant that creates an invisible barrier over your sneaker\'s surface. Apply before you step out — not after something goes wrong.',
      useCases: [
        'Pre-wear protection on new pairs',
        'Barrier coat after professional cleaning',
        'Works on leather, suede, and canvas'
      ]
    },
    {
      name: 'Sneaker Detailer 100ml',
      price: 'R90',
      hook: 'Finish it like a professional would.',
      copy: 'A temporary sneaker detailer in Black and White that restores surface appearance fast between cleans. One application, clean result.',
      useCases: [
        'Touching up scuffs before an event',
        'Sole edge detailing',
        'Quick restoration on black or white colourways'
      ]
    },
    {
      name: 'Suede Sponge Buffer',
      price: 'R70',
      hook: 'Suede forgives nothing — unless you have the right tool.',
      copy: 'Designed specifically for suede, this buffer lifts dirt and restores the nap without damaging the material. The tool most suede owners don\'t know they\'re missing.',
      useCases: [
        'Regular nap maintenance',
        'Removing dry dirt from suede surfaces',
        'Keeping texture looking fresh between wears'
      ]
    },
    {
      name: 'Suede & Nubuck Cleaning Brush',
      price: 'R120',
      hook: 'The brush that knows the difference.',
      copy: 'Dual-purpose brush engineered for suede and nubuck — firm enough to clean, precise enough not to damage. Non-negotiable if you own suede.',
      useCases: [
        'Weekly suede brushing routine',
        'Directional nap grooming',
        'Safe use on nubuck panels'
      ]
    },
    {
      name: 'Sneaker Trees',
      price: 'R80',
      hook: 'Shape is everything. Don\'t lose it.',
      copy: 'Structured sneaker trees that maintain the form of your pair during storage — preventing creasing, collapsing, and toe-box deformation over time.',
      useCases: [
        'Overnight shape retention after wear',
        'Long-term collection storage',
        'Crease prevention on premium pairs'
      ]
    },
    {
      name: 'Crease Guards',
      price: 'R100',
      hook: 'Creases are permanent. Prevention isn\'t.',
      copy: 'Insert them into the toe box before you wear — that\'s it. Compatible with most silhouettes. The cheapest way to protect the most visible part of your sneaker.',
      useCases: [
        'Daily crease prevention on wearers',
        'Ideal for Air Force 1s and toe-box-heavy silhouettes',
        'Protecting investment pairs you still wear'
      ]
    }
  ];

  const imageByProduct = new Map(productOfferImages.map((image) => [image.matchedItem, image]));

  return (
    <Layout>
      {/* Header */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-16 md:py-24">
        <div className="container text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">Sneaker Care Products</h1>
          <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto">
            Professional-grade products to maintain your collection at home.
          </p>
        </div>
      </section>

      {/* Blue Divider */}
      <div className="red-divider" />

      {/* Products Grid */}
      <section className="bg-gray-50 py-20 md:py-28">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product, idx) => {
              const productImage = imageByProduct.get(product.name);

              return (
              <div key={idx} className="card-modern flex flex-col h-full bg-white group hover:shadow-xl transition-all duration-300">
                <div className="w-full aspect-[4/5] bg-blue-50 rounded-t-xl overflow-hidden border-b-2 border-blue-100 mb-6">
                  {productImage ? (
                    <img
                      src={productImage.src}
                      alt={productImage.alt}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-gray-400 font-semibold text-center px-6">
                      Product Photo — {product.name.replace(/ \d+ml$/, '').replace(/ \d+pk$/, '')}
                    </div>
                  )}
                </div>
                
                <div className="flex-grow flex flex-col px-2 pb-2">
                  <div className="mb-2">
                    <span className="text-xs font-bold text-accent uppercase tracking-wider bg-blue-50 px-2 py-1 rounded">
                      Product
                    </span>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-foreground mb-2">
                    {product.name}
                  </h3>
                  
                  <p className="text-accent font-semibold italic mb-4 text-sm">
                    "{product.hook}"
                  </p>
                  
                  <p className="text-gray-600 mb-6 text-sm leading-relaxed">
                    {product.copy}
                  </p>
                  
                  <div className="mb-8 flex-grow">
                    <strong className="block text-xs uppercase tracking-wider text-gray-400 mb-3">Best For:</strong>
                    <ul className="space-y-2">
                      {product.useCases.map((useCase, caseIdx) => (
                        <li key={caseIdx} className="flex items-start gap-2 text-sm text-gray-700">
                          <CheckCircle2 size={16} className="text-accent flex-shrink-0 mt-0.5" />
                          <span>{useCase}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="mt-auto border-t border-gray-100 pt-6">
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-xl font-bold text-foreground">
                        {product.price}
                      </span>
                      <a 
                        href={`https://wa.me/27665884466?text=Hi%2C%20I%27d%20like%20to%20order%20${encodeURIComponent(product.name)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-primary py-2.5 px-6 text-sm flex-shrink-0"
                      >
                        Order via WhatsApp
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              );
            })}
          </div>
        </div>
      </section>
    </Layout>
  );
}
