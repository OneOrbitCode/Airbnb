import Header from "@/components/Header";
import Categories from "@/components/Categories";
import ListingCard from "@/components/ListingCard";

const mockListings = [
  {
    id: 1,
    imageSrc: "https://a0.muscache.com/im/pictures/hosting/Hosting-1726967218722300135/original/efaa58e3-5c47-449b-8513-b903e03288d2.png?im_w=720",
    location: "Puducherry, India",
    distance: "1,234 kilometers away",
    dateRange: "Oct 15 - 20",
    price: "4,899",
    rating: 5.0,
    guestFavorite: true,
  },
  {
    id: 2,
    imageSrc: "https://a0.muscache.com/im/pictures/hosting/Hosting-979349165403113668/original/1273f626-0f45-4e56-bc51-b3cbe887b970.png?im_w=720",
    location: "Puducherry, India",
    distance: "Beach and ocean views",
    dateRange: "Nov 2 - 7",
    price: "11,431",
    rating: 4.86,
    guestFavorite: true,
  },
  {
    id: 3,
    imageSrc: "https://a0.muscache.com/im/pictures/hosting/Hosting-1521928536703773082/original/d60a8b44-c32a-4560-876d-f33a7dd06029.jpeg?im_w=720",
    location: "Puducherry, India",
    distance: "2 kilometers away",
    dateRange: "Dec 1 - 5",
    price: "4,247",
    rating: 4.86,
    guestFavorite: false,
  },
  {
    id: 4,
    imageSrc: "https://a0.muscache.com/im/pictures/hosting/Hosting-1488409011195823542/original/1b2923fb-32f4-4665-8a55-0bf416a68116.jpeg?im_w=720",
    location: "Puducherry, India",
    distance: "Designed by renowned architect",
    dateRange: "Jan 10 - 15",
    price: "5,129",
    rating: 4.92,
    guestFavorite: true,
  },
  {
    id: 5,
    imageSrc: "https://a0.muscache.com/im/pictures/hosting/Hosting-1740676245981804536/original/6ce30cbd-e641-40f2-be70-2aba57bd394c.jpeg?im_w=720",
    location: "Puducherry, India",
    distance: "Pool with a view",
    dateRange: "Feb 5 - 10",
    price: "7,735",
    rating: 5.0,
    guestFavorite: false,
  },
  {
    id: 6,
    imageSrc: "https://a0.muscache.com/im/pictures/miso/Hosting-1094771440597889199/original/396e39d5-12b4-4442-ae8b-3c09940b693b.jpeg?im_w=720",
    location: "Kottaikuppam, India",
    distance: "Near Auroville beach",
    dateRange: "Mar 12 - 18",
    price: "7,811",
    rating: 4.86,
    guestFavorite: true,
  },
  {
    id: 7,
    imageSrc: "https://a0.muscache.com/im/pictures/hosting/Hosting-1711443031025343915/original/5fb14498-9c7a-46d0-8537-b7efc00d326f.jpeg?im_w=720",
    location: "Puducherry, India",
    distance: "French quarter heritage",
    dateRange: "Apr 2 - 8",
    price: "7,417",
    rating: 4.88,
    guestFavorite: false,
  },
  {
    id: 8,
    imageSrc: "https://a0.muscache.com/im/pictures/miso/Hosting-1391798296611221576/original/d2e616f6-c9e1-4418-b9ba-7d54220d18d0.jpeg?im_w=720",
    location: "Puducherry, India",
    distance: "Entire villa",
    dateRange: "May 1 - 5",
    price: "17,146",
    rating: 4.98,
    guestFavorite: true,
  }
];

export default function Home() {
  return (
    <main className="pb-20">
      <Header />
      <div className="sticky top-20 z-40 bg-white shadow-sm pb-4">
        <Categories />
      </div>
      
      <div className="max-w-[2520px] mx-auto px-4 sm:px-6 md:px-10 xl:px-20 pt-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
          {mockListings.map((listing) => (
            <ListingCard 
              key={listing.id}
              imageSrc={listing.imageSrc}
              location={listing.location}
              distance={listing.distance}
              dateRange={listing.dateRange}
              price={listing.price}
              rating={listing.rating}
              guestFavorite={listing.guestFavorite}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
