import Layout from '@/components/Layout';
import { additionalServiceOfferImages } from '@/data/sneakercareImages';

export default function AdditionalServices() {
  const addOns = [
    {
      name: 'Sole Whitening',
      price: 'R400/pair',
      description: 'Yellow soles are a dead giveaway. We take them back to that fresh-out-the-box white — the detail that makes every pair look new again.'
    },
    {
      name: 'Sneaker Customisations',
      price: 'From R500',
      description: 'Your pair, your vision. Custom colourways, designs, and personalisation that turns a sneaker into a statement. Let\'s talk about what you have in mind.'
    },
    {
      name: 'Colour Restoration (All Colours)',
      price: 'From R250',
      description: 'Faded, scuffed, or stripped colour brought back to life. Works across all colourways — because a great sneaker shouldn\'t lose its identity.'
    },
    {
      name: 'Sneaker Protector',
      price: 'R50/pair',
      description: 'A shield against the streets. Applied after your clean to repel stains and water before they make contact. The cheapest insurance for expensive kicks.'
    },
    {
      name: 'Nano Coating',
      price: 'R120/pair',
      description: 'An invisible, molecular-level barrier. Nano coating bonds to the material to repel liquids and contaminants at a level standard protectors can\'t reach.'
    },
    {
      name: 'Undergrail Tape',
      price: 'R150/pair',
      description: 'Protect the outsole before it wears through. Extends the life of your sole unit — critical on limited pairs you\'re actually wearing.'
    }
  ];

  const imageByAddOn = new Map(additionalServiceOfferImages.map((image) => [image.matchedItem, image]));

  return (
    <Layout>
      {/* Header */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-16 md:py-24">
        <div className="container text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">Additional Services</h1>
          <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto">
            Specialised add-ons to protect, restore, and elevate your collection.
          </p>
        </div>
      </section>

      {/* Blue Divider */}
      <div className="red-divider" />

      {/* Add-ons List */}
      <section className="bg-white py-20 md:py-28">
        <div className="container max-w-4xl">
          <div className="flex flex-col gap-8">
            {addOns.map((addon, idx) => {
              const addOnImage = imageByAddOn.get(addon.name);

              return (
              <div
                key={idx}
                className="bg-white border border-blue-100 rounded-2xl p-6 md:p-8 shadow-sm hover:shadow-xl transition-shadow flex flex-col md:flex-row md:items-center gap-6 overflow-hidden"
              >
                {addOnImage && (
                  <div className="md:w-48 lg:w-56 flex-shrink-0 overflow-hidden rounded-2xl bg-blue-50 border border-blue-100 shadow-sm">
                    <img
                      src={addOnImage.src}
                      alt={addOnImage.alt}
                      className="h-72 md:h-64 w-full object-cover transition-transform duration-700 hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                )}
                <div className="flex-grow">
                  <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mb-3">
                    <h3 className="text-2xl font-bold text-foreground">
                      {addon.name}
                    </h3>
                    <span className="inline-block bg-blue-50 text-accent font-bold px-3 py-1 rounded-md text-sm md:ml-auto whitespace-nowrap">
                      {addon.price}
                    </span>
                  </div>
                  <p className="text-gray-600 leading-relaxed text-base mb-6 md:mb-0">
                    {addon.description}
                  </p>
                </div>
                
                <div className="md:flex-shrink-0 md:min-w-[200px]">
                  <a 
                    href={`https://wa.me/27665884466?text=Hi%2C%20I%27d%20like%20to%20add%20${encodeURIComponent(addon.name)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full text-center uppercase font-bold py-3 px-6 rounded-lg bg-outline border-2 border-foreground text-foreground hover:bg-foreground hover:text-white transition-all duration-300 whitespace-nowrap"
                  >
                    Add to Service
                  </a>
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
