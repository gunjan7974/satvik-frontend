'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ClientLayout from './client-layout';
import {Hero} from '../components/Hero';
import Menu from '../app/menu/page';
import Events from '../app/events/page';
import Reviews from '../app/reviews/page';
import BlogSection from '../app/blog/page';
import Contacts from '../app/contacts/page';
import { Chatbot } from "../components/Chatbot";
import { HomePage } from '@/components/HomePage';
import { About } from '@/components/About';
import { MobileBottomNav } from '@/components/MobileBottomNav';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState("home");
  const router = useRouter();

  const goToSearch = (query: string = "") => {
    setSearchQuery(query);
    // Navigate to search page with query parameter
    if (query) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
    } else {
      router.push('/search');
    }
  };

  const goToRestaurant = () => {
    router.push('/restaurant');
  };

  const goToEventListing = () => {
    router.push('/events');
  };



  return (
    <ClientLayout>
      <HomePage 
        onOrderFoodClick={goToRestaurant}
        onExploreEventsClick={goToEventListing}
        onSearchClick={goToSearch}
        onRestaurantClick={goToRestaurant}
      />
      {/* <About/>
      <Reviews/>
      <BlogSection/>
      <Contacts/>*/}
      
      
    </ClientLayout>
  );
}