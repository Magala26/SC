import img01 from '@/assets/sneakercare-uploads/01-gallery-page-gallery-work.webp';
import img02 from '@/assets/sneakercare-uploads/02-gallery-page-gallery-work.webp';
import img03 from '@/assets/sneakercare-uploads/03-gallery-page-gallery-work.webp';
import img04 from '@/assets/sneakercare-uploads/04-gallery-page-gallery-work.webp';
import img05 from '@/assets/sneakercare-uploads/05-gallery-page-gallery-work.webp';
import img06 from '@/assets/sneakercare-uploads/06-gallery-page-gallery-work.webp';
import img07 from '@/assets/sneakercare-uploads/07-gallery-page-gallery-work.webp';
import img08 from '@/assets/sneakercare-uploads/08-gallery-page-gallery-work.webp';
import img09 from '@/assets/sneakercare-uploads/09-gallery-page-gallery-work.webp';
import img10 from '@/assets/sneakercare-uploads/10-gallery-page-gallery-work.webp';
import img11 from '@/assets/sneakercare-uploads/11-gallery-page-gallery-work.webp';
import img12 from '@/assets/sneakercare-uploads/12-gallery-page-gallery-work.webp';
import img13 from '@/assets/sneakercare-uploads/13-products-page-crease-guards.webp';
import img14 from '@/assets/sneakercare-uploads/14-products-page-sneaker-deodorizer-250ml.webp';
import img15 from '@/assets/sneakercare-uploads/15-gallery-page-gallery-work.webp';
import img16 from '@/assets/sneakercare-uploads/16-products-page-sneaker-shampoo-250ml.webp';
import img17 from '@/assets/sneakercare-uploads/17-additional-services-page-undergrail-tape.webp';
import img18 from '@/assets/sneakercare-uploads/18-products-page-sneaker-protector-200ml.webp';
import img19 from '@/assets/sneakercare-uploads/19-additional-services-page-nano-coating.webp';
import img20 from '@/assets/sneakercare-uploads/20-products-page-sneaker-wipes.webp';
import img21 from '@/assets/sneakercare-uploads/21-rotation-refresh-offer-page-rotation-refresh-plan.webp';
import img22 from '../../../images/WhatsApp Image 2026-05-05 at 10.49.43.jpeg';
import img23 from '@/assets/sneakercare-uploads/23-homepage-services-the-95-deluxe.webp';
import img24 from '@/assets/sneakercare-uploads/24-homepage-services-deep-clean.webp';
import img25 from '@/assets/sneakercare-uploads/25-homepage-services-intense-deep-clean.webp';
import img26 from '@/assets/sneakercare-uploads/26-homepage-services-suede-nubuck-maintenance.webp';
import img27 from '@/assets/sneakercare-uploads/27-rotation-refresh-plan-offer-poster.webp';

export type SneakercareImage = {
  id: string;
  src: string;
  alt: string;
  caption: string;
  category: 'work' | 'product-offer' | 'service-offer' | 'subscription-offer';
  matchedItem?: string;
};

export const workImages: SneakercareImage[] = [
  { id: 'work-sneaker-care-display', src: img01, alt: 'Sneakers displayed with Sneaker Care branding', caption: 'Premium sneaker display', category: 'work' },
  { id: 'work-sneaker-heel-detail', src: img02, alt: 'Close-up sneaker heel detail after care work', caption: 'Detailed sneaker finish', category: 'work' },
  { id: 'work-yellow-paint-prep', src: img03, alt: 'Gloved hands preparing yellow leather paint', caption: 'Custom colour preparation', category: 'work' },
  { id: 'work-yellow-paint-application', src: img04, alt: 'Gloved hand applying yellow paint during sneaker restoration', caption: 'Hand-painted restoration', category: 'work' },
  { id: 'work-yellow-sneaker-detail', src: img05, alt: 'Close-up sneaker restoration painting in progress', caption: 'Precision colour work', category: 'work' },
  { id: 'work-custom-studio-process', src: img06, alt: 'Sneaker customisation process in studio', caption: 'Custom sneaker artwork', category: 'work' },
  { id: 'work-shoelaces-air-detail', src: img07, alt: 'Close-up sneaker detail with shoelaces and Air text', caption: 'Finished detail shot', category: 'work' },
  { id: 'work-preparer-deglazer', src: img08, alt: 'Leather preparer and deglazer used during sneaker care process', caption: 'Material preparation', category: 'work' },
  { id: 'work-orange-paint-process', src: img09, alt: 'Orange paint and brush used for sneaker customisation', caption: 'Orange accent repair', category: 'work' },
  { id: 'work-orange-paint-bottles', src: img10, alt: 'Shattered orange acrylic leather paint bottles', caption: 'Professional colour materials', category: 'work' },
  { id: 'work-orange-bottle-closeup', src: img11, alt: 'Orange acrylic leather paint bottle held during customisation work', caption: 'Colour restoration tools', category: 'work' },
  { id: 'work-black-orange-sneaker', src: img12, alt: 'Black sneaker with orange swoosh', caption: 'Black and orange sneaker finish', category: 'work' },
  { id: 'work-black-orange-closeup', src: img15, alt: 'Close-up of black sneaker with orange swoosh', caption: 'Restored colourway close-up', category: 'work' },
];

export const serviceImages: SneakercareImage[] = [
  { id: 'service-standard-clean', src: img22, alt: 'Yellow leather paint application for Standard Clean service', caption: 'Standard Clean', category: 'work', matchedItem: 'Standard Clean' },
  { id: 'service-the-95-deluxe', src: img23, alt: 'Sneaker restoration with yellow accent for The 95 Deluxe service', caption: 'The 95 Deluxe', category: 'work', matchedItem: 'The 95 Deluxe' },
  { id: 'service-deep-clean', src: img24, alt: 'Premium sneaker detail for Deep Clean service', caption: 'Deep Clean', category: 'work', matchedItem: 'Deep Clean' },
  { id: 'service-intense-deep-clean', src: img25, alt: 'Sneaker wings emblem detail for Intense Deep Clean service', caption: 'Intense Deep Clean', category: 'work', matchedItem: 'Intense Deep Clean' },
  { id: 'service-suede-nubuck', src: img26, alt: 'Suede cleaning tools for Suede and Nubuck Maintenance Clean service', caption: 'Suede/Nubuck Maintenance Clean', category: 'work', matchedItem: 'Suede/Nubuck Maintenance Clean' },
];

export const productOfferImages: SneakercareImage[] = [
  { id: 'product-crease-guards', src: img13, alt: 'Crease Guards offer poster', caption: 'Crease Guards', category: 'product-offer', matchedItem: 'Crease Guards' },
  { id: 'product-deodorizer', src: img14, alt: 'Sneaker Deodorizer offer poster', caption: 'Sneaker Deodorizer', category: 'product-offer', matchedItem: 'Sneaker Deodorizer 250ml' },
  { id: 'product-shampoo', src: img16, alt: 'Sneaker Shampoo offer poster', caption: 'Sneaker Shampoo', category: 'product-offer', matchedItem: 'Sneaker Shampoo 250ml' },
  { id: 'product-protector', src: img18, alt: 'Sneaker Protector offer poster', caption: 'Sneaker Protector', category: 'product-offer', matchedItem: 'Sneaker Protector 200ml' },
  { id: 'product-wipes', src: img20, alt: 'Sneaker Wipes offer poster', caption: 'Sneaker Wipes', category: 'product-offer', matchedItem: 'Sneaker Wipes' },
];

export const additionalServiceOfferImages: SneakercareImage[] = [
  { id: 'service-undergrail-tape', src: img17, alt: 'Undergrail Tape additional service offer poster', caption: 'Undergrail Tape', category: 'service-offer', matchedItem: 'Undergrail Tape' },
  { id: 'service-nano-coating', src: img19, alt: 'Nano Coating additional service offer poster', caption: 'Nano Coating', category: 'service-offer', matchedItem: 'Nano Coating' },
];

export const subscriptionOfferImages: SneakercareImage[] = [
  { id: 'subscription-rotation-refresh-plan', src: img21, alt: 'Monthly subscription Rotation Refresh Plan offer poster', caption: 'Rotation Refresh Plan', category: 'subscription-offer', matchedItem: 'Rotation Refresh Plan' },
  { id: 'subscription-rotation-refresh-plan-premium', src: img27, alt: 'Premium Sneaker Care Monthly Subscription offer poster', caption: 'Premium Monthly Subscription', category: 'subscription-offer', matchedItem: 'Premium Monthly Subscription' },
];

export const galleryImages: SneakercareImage[] = [
  ...workImages,
];

export const homepageSliderImages = workImages;
