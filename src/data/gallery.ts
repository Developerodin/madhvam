export type GallerySlide = {
  category: string;
  also?: string | string[];
  title: string;
  lines?: string[];
  caption?: string;
  feature?: boolean;
  png?: string;
  webp?: string;
  placeholder?: boolean;
  contain?: boolean;
};

export const GALLERY_SLIDES: GallerySlide[] = [
  {
    category: "aerial",
    title: "A Planned Community Amidst Nature",
    lines: ["A Planned", "Community", "Amidst Nature"],
    caption: "",
    feature: true,
    png: "/assets/Residential Aerial View.png",
    webp: "/assets/residential-aerial-view.webp",
  },
  {
    category: "amenities",
    also: "landscapes",
    title: "Park Gazebo",
    caption: "Relax. Reconnect. Belong.",
    png: "/assets/Golden-Hour Luxury Garden Pavilion.png",
    webp: "/assets/golden-hour-luxury-garden-pavilion.webp",
  },
  {
    category: "amenities",
    title: "Kids Play Area",
    caption: "A Safer, Happier Tomorrow",
    png: "/assets/Playground Oasis.png",
    webp: "/assets/playground-oasis.webp",
  },
  {
    category: "roads",
    title: "Internal Roads",
    caption: "Wide. Well Planned. Serene.",
    png: "/assets/ Street.png",
    webp: "/assets/street.webp",
  },
  {
    category: "roads",
    also: "landscapes",
    title: "Entrance Plaza",
    caption: "A grand welcome home.",
    placeholder: true,
  },
  {
    category: "amenities",
    also: "landscapes",
    title: "Flower Garden",
    caption: "Green spaces for a healthier life.",
    png: "/assets/ Courtyard.png",
    webp: "/assets/courtyard.webp",
  },
  {
    category: "amenities",
    title: "Badminton Court",
    caption: "A court set among the trees.",
    png: "/assets/Badminton Courtyard.png",
    webp: "/assets/badminton-courtyard.webp",
  },
  {
    category: "amenities",
    also: ["landscapes", "clubhouse"],
    title: "Club Madhavam",
    caption: "The heart of the community.",
    png: "/assets/clubhouseelevation.png",
  },
  {
    category: "amenities",
    also: "clubhouse",
    title: "Multi Purpose Hall",
    caption: "A hall for a hundred, with a pantry.",
    png: "/assets/Elegant Banquet Hall Interior.png",
    webp: "/assets/elegant-banquet-hall-interior.webp",
  },
  {
    category: "amenities",
    also: "landscapes",
    title: "Lush Green Lawn with Jogging Track",
    caption: "A lawn to run, walk, and gather.",
    png: "/assets/ Garden Jogging Park.png",
    webp: "/assets/garden-jogging-park.webp",
  },
  {
    category: "amenities",
    also: "clubhouse",
    title: "Gymnasium",
    caption: "Training with a view of the gardens.",
    png: "/assets/ Gym with Garden Views.png",
    webp: "/assets/gym-with-garden-views.webp",
  },
  {
    category: "amenities",
    also: "clubhouse",
    title: "Yoga and Zumba Room",
    caption: "A quiet room for yoga and dance.",
    png: "/assets/Yoga and Dance Studio.png",
    webp: "/assets/yoga-and-dance-studio.webp",
  },
  {
    category: "amenities",
    also: "landscapes",
    title: "Sculpture Platform",
    caption: "A plaza to pause in the garden.",
    png: "/assets/Garden Sculpture Plaza.png",
    webp: "/assets/garden-sculpture-plaza.webp",
  },
  {
    category: "amenities",
    title: "Cricket Net Practice",
    caption: "Nets for an evening session.",
    png: "/assets/Cricket Practice Courtyard.png",
    webp: "/assets/cricket-practice-courtyard.webp",
  },
  {
    category: "amenities",
    title: "Yoga Lawn",
    caption: "An open lawn for morning practice.",
  },
  {
    category: "amenities",
    title: "Pet Park",
    caption: "A corner of the garden for pets.",
  },
  {
    category: "amenities",
    also: "clubhouse",
    title: "Indoor Games Room",
    caption: "Board games and indoor play.",
    png: "/assets/indoorGames Room .png",
  },
  {
    category: "amenities",
    also: "clubhouse",
    title: "Toddler Play Area",
    caption: "A softer space for the smallest.",
    png: "/assets/Toddler Play Area.png",
    webp: "/assets/toddler-play-area.webp",
  },
];

export const GALLERY_FILTERS = [
  { id: "all", label: "All", icon: "gallery-ico-image" },
  { id: "aerial", label: "Aerial View", icon: "gallery-ico-drone" },
  { id: "amenities", label: "Amenities", icon: "gallery-ico-megaphone" },
  { id: "landscapes", label: "Landscapes", icon: "gallery-ico-tree" },
  { id: "clubhouse", label: "Clubhouse", icon: "gallery-ico-buildings" },
  { id: "roads", label: "Internal Roads", icon: "gallery-ico-path" },
] as const;
