import { Destination } from '../types';

// Pre-load all images to avoid bundling issues
const images = {
  paris: require('../../assets/images/paris.jpg'),
  tokyo: require('../../assets/images/tokyo.jpg'),
  barcelona: require('../../assets/images/barcelona.jpg'),
  bali: require('../../assets/images/bali.jpg'),
  newyork: require('../../assets/images/newyork.jpg'),
  santorini: require('../../assets/images/santorini.jpg'),
  dubai: require('../../assets/images/dubai.jpg'),
  rome: require('../../assets/images/rome.jpg'),
  kyoto: require('../../assets/images/kyoto.jpg'),
  iceland: require('../../assets/images/iceland.jpg'),
  london: require('../../assets/images/london.jpg'),
};

export const mockDestinations: Destination[] = [
  {
    id: '1',
    title: 'Paris',
    subtitle: 'City of Lights',
    image: images.paris,
    description: 'Experience the romance and culture of the French capital',
    price: '€299',
  },
  {
    id: '2',
    title: 'Tokyo',
    subtitle: 'Modern Metropolis',
    image: images.tokyo,
    description: 'Discover the perfect blend of tradition and innovation',
    price: '¥45,000',
  },
  {
    id: '3',
    title: 'Barcelona',
    subtitle: 'Architectural Wonder',
    image: images.barcelona,
    description: 'Explore Gaudí\'s masterpieces and vibrant street life',
    price: '€189',
  },
  {
    id: '4',
    title: 'Bali',
    subtitle: 'Tropical Paradise',
    image: images.bali,
    description: 'Relax on pristine beaches and immerse in local culture',
    price: 'Rp 2,500,000',
  },
  {
    id: '5',
    title: 'New York',
    subtitle: 'The Big Apple',
    image: images.newyork,
    description: 'Feel the energy of the city that never sleeps',
    price: '$399',
  },
  {
    id: '6',
    title: 'Santorini',
    subtitle: 'Aegean Gem',
    image: images.santorini,
    description: 'Watch stunning sunsets over white-washed buildings',
    price: '€349',
  },
  {
    id: '7',
    title: 'Dubai',
    subtitle: 'Desert Oasis',
    image: images.dubai,
    description: 'Luxury shopping and futuristic architecture await',
    price: 'AED 1,299',
  },
  {
    id: '8',
    title: 'Rome',
    subtitle: 'Eternal City',
    image: images.rome,
    description: 'Walk through history in the heart of ancient civilization',
    price: '€229',
  },
  {
    id: '9',
    title: 'Kyoto',
    subtitle: 'Cultural Heritage',
    image: images.kyoto,
    description: 'Temples, gardens, and traditional Japanese culture',
    price: '¥38,000',
  },
  {
    id: '10',
    title: 'Iceland',
    subtitle: 'Land of Fire and Ice',
    image: images.iceland,
    description: 'Northern lights, geysers, and breathtaking landscapes',
    price: '€449',
  },
  {
    id: '11',
    title: 'London',
    subtitle: 'Historic Capital',
    image: images.london,
    description: 'Explore royal palaces, world-class museums, and vibrant markets',
    price: '£299',
  },
];

export const STORAGE_KEYS = {
  SAVED_DESTINATIONS: 'saved_destinations',
  AB_EXPERIMENTS: 'ab_experiments',
  ONBOARDING_COMPLETE: 'onboarding_complete',
  APP_LOCALE: 'app_locale',
};

