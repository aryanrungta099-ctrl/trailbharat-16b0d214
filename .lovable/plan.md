
## Phase 1: Foundation & Data (Trek interface updates, new components)
- Add `photos`, `latitude`, `longitude` fields to Trek interface
- Add photo URLs to 5 popular treks + coordinates to all treks
- Install leaflet + react-leaflet

## Phase 2: Photo Gallery (Feature #1)
- Create `src/components/PhotoLightbox.tsx` - fullscreen lightbox with keyboard nav
- Create `src/components/TrekPhotoGallery.tsx` - hero gallery layout
- Update `TrekDetail.tsx` to use gallery at top

## Phase 3: Interactive Map (Feature #2)
- Create `src/components/TrekMap.tsx` - Leaflet map with markers & popups
- Add Map/List toggle to Routes.tsx
- Import Leaflet CSS in index.css

## Phase 4: Contextual HikerAI (Feature #3)
- Update JarvisChat with `trekContext` prop
- Update jarvis-chat edge function to handle system context
- Pass trek data from TrekDetail.tsx

## Phase 5: Wishlist & Trip Planner (Feature #4)
- Create `src/hooks/useWishlist.ts` - wishlist CRUD hook
- Create `src/components/WishlistButton.tsx` - heart button
- Create `src/components/TripPlannerModal.tsx` - trip planner
- Update Profile.tsx with wishlist tab
- Add heart to trek cards

## Phase 6: Live Weather (Feature #5)
- Create `src/components/LiveWeather.tsx` - weather component with Open-Meteo
- Replace static weather in TrekDetail safety tab

## Phase 7: Trek Comparison Enhancement (Feature #6)
- Create `src/components/TrekCompareModal.tsx` - comparison modal
- Update Routes.tsx comparison tray

## Phase 8: Polish & Mobile Nav (Features #7 & #8)
- Fix star flickering with useMemo
- Standardize stats to use treks.length
- Create `src/components/BackToTop.tsx`
- Create `src/components/MobileBottomNav.tsx`
- Update Navbar.tsx for mobile
- Make HikerAI fullscreen on mobile
- Add skeleton loading states
- Add "No results" illustration
