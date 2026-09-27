export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  badge?: string;
}

export const products: Product[] = [
  {
    id: 1,
    name: "NovaBass Pro X",
    description:
      "Premium wireless over-ear headphones with active noise cancellation, 40-hour battery life, and Hi-Res audio support.",
    price: 249.99,
    image: "/product_headphones.png",
    category: "Audio",
    badge: "Best Seller",
  },
  {
    id: 2,
    name: "Apex Watch Ultra",
    description:
      "Advanced smartwatch with health tracking, GPS, AMOLED display, and 7-day battery. Water-resistant to 50m.",
    price: 399.99,
    image: "/product_smartwatch.png",
    category: "Wearables",
    badge: "New",
  },
  {
    id: 3,
    name: "HyperKeys TKL",
    description:
      "Tenkeyless mechanical keyboard with per-key RGB lighting, hot-swap switches, and aluminum frame for competitive gaming.",
    price: 159.99,
    image: "/product_keyboard.png",
    category: "Peripherals",
  },
  {
    id: 4,
    name: "AirPods Freedom 3",
    description:
      "True wireless earbuds with spatial audio, adaptive transparency, and 36-hour total battery life with charging case.",
    price: 189.99,
    image: "/product_earbuds.png",
    category: "Audio",
    badge: "Hot",
  },
  {
    id: 5,
    name: "BoomCore 360",
    description:
      "Portable 360° Bluetooth speaker with IPX7 waterproofing, 24-hour playback, and immersive surround sound.",
    price: 129.99,
    image: "/product_speaker.png",
    category: "Audio",
  },
  {
    id: 6,
    name: "PhantomClick G900",
    description:
      "Ergonomic gaming mouse with honeycomb shell, 25,600 DPI sensor, ultra-lightweight design, and 70-hour battery.",
    price: 89.99,
    image: "/product_headphones.png",
    category: "Peripherals",
    badge: "Sale",
  },
];
