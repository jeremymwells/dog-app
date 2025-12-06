"use client";

import { useState, useEffect } from 'react';
import Image from "next/image";
import { PanelRight, X } from 'lucide-react';
import { BreedAndImage } from '@/types/dog';

export default function DogGallery({ initialBreedsAndImages }: { initialBreedsAndImages: BreedAndImage[] }) {
  const [breedsAndImages] = useState(initialBreedsAndImages);
  const [currentBreedAndImage, setCurrentBreedAndImage] = useState(breedsAndImages[0]);
  const [favorites, setFavorites] = useState<BreedAndImage[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const isCurrentFavorited = favorites.some(f => f.image === currentBreedAndImage.image);

  useEffect(() => {
    const stored = localStorage.getItem('favorites');
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (stored) setFavorites(JSON.parse(stored));
  }, []);

  const addToFavorites = (breedAndImage: BreedAndImage) => {
    setFavorites(prev => {
      if (prev.some(f => f.image === breedAndImage.image)) return prev;
      const updated = [...prev, breedAndImage];
      localStorage.setItem('favorites', JSON.stringify(updated));
      return updated;
    });
  };

  const removeFromFavorites = (image: string) => {
    setFavorites(prev => {
      const updated = prev.filter(f => f.image !== image);
      localStorage.setItem('favorites', JSON.stringify(updated));
      if (!updated.length) {
        setDrawerOpen(false);
      }
      return updated;
    });
  };

  const remainingBreedsAndImages = breedsAndImages.filter(
    b => b.image !== currentBreedAndImage.image
  );

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-start pt-12 px-12 bg-white dark:bg-black overflow-hidden">
        
        {/* Current breed display */}
        <div className="flex flex-col items-center gap-6 text-center top-container">
          <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50 breed-name">
            {currentBreedAndImage.breed}
          </h1>
          <Image
            src={currentBreedAndImage.image}
            alt={currentBreedAndImage.breed}
            width={400}
            height={300}
            priority
          />
          {!isCurrentFavorited && (
            <button
              onClick={() => addToFavorites(currentBreedAndImage)}
              className="px-4 py-2 bg-green-500 hover:bg-green-600 text-gray rounded-md font-medium cursor-pointer"
            >
              Add to Favorites
            </button>
          )}
        </div>

        {/* Thumbnails */}
        <div className="relative w-full py-2">
          <span className="absolute inset-y-0 left-0 flex items-center pl-1">←</span>
          <span className="flex justify-center text-sm text-zinc-500">Scroll (click to view)</span>
          <span className="absolute inset-y-0 right-0 flex items-center pr-1">→</span>
        </div>
        <div className="flex w-full gap-4 overflow-x-auto pb-3 pt-4 thumbnail-container">
          {remainingBreedsAndImages.map((breedAndImage, i) => (
            <div key={i} className="flex w-48 flex-shrink-0 flex-col items-center gap-2">
              <Image
                src={breedAndImage.image}
                alt={breedAndImage.breed}
                width={300}
                height={200}
                className="hover-zoom h-32 w-full rounded-md object-cover cursor-pointer"
                onClick={() => setCurrentBreedAndImage(breedAndImage)}
                title="Click to view"
              />
              <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300 breed-name">
                {breedAndImage.breed}
              </p>
            </div>
          ))}
        </div>

        {/* Favorites section */}
        {favorites.length > 0 && (
          <>
            <div className="mt-8 w-full flex items-center justify-between">
              <h2 className="text-xl font-semibold text-black dark:text-zinc-50">
                Favorites ({favorites.length})
              </h2>
              <button
                onClick={() => setDrawerOpen(true)}
                className="p-1 text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 cursor-pointer"
                title="Open favorites drawer"
              >
                <span className="drawer-button-text">open in drawer</span>
                <PanelRight className="w-5 h-5" />
              </button>
            </div>
            <div className="flex w-full gap-4 overflow-x-auto pb-3 pt-4">
              {favorites.map((fav, i) => (
                <div key={i} className="flex w-48 flex-shrink-0 flex-col items-center gap-2">
                  <Image
                    src={fav.image}
                    alt={fav.breed}
                    width={300}
                    height={200}
                    className="h-32 w-full rounded-md object-cover cursor-pointer border-2 border-gray-400"
                    onClick={() => setCurrentBreedAndImage(fav)}
                    title={`View ${fav.breed}`}
                  />
                  <div className="w-full flex items-center justify-between drawer-tools">
                    <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300 breed-name">
                      {fav.breed}
                    </p>
                    <button
                      onClick={() => removeFromFavorites(fav.image)}
                      className="text-xs text-red-500 hover:text-red-700 cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Drawer overlay */}
        {drawerOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setDrawerOpen(false)}
          />
        )}

        {/* Drawer */}
        <div
          className={`fixed top-0 right-0 h-full w-80 bg-white dark:bg-zinc-900 shadow-lg z-50 transform transition-transform duration-300 ${
            drawerOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="flex items-center justify-between p-4 border-b dark:border-zinc-700">
            <h2 className="text-lg font-semibold text-black dark:text-zinc-50">
              Favorites ({favorites.length})
            </h2>
            <button
              onClick={() => setDrawerOpen(false)}
              className="p-1 text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="p-4 overflow-y-auto h-[calc(100%-60px)]">
            <div className="flex flex-col gap-4">
              {favorites.map((fav, i) => (
                <div key={i} className="flex flex-col items-center gap-2">
                  <Image
                    src={fav.image}
                    alt={fav.breed}
                    width={300}
                    height={200}
                    className="w-full rounded-md object-cover cursor-pointer"
                    onClick={() => {
                      setCurrentBreedAndImage(fav);
                    }}
                    title={`View ${fav.breed}`}
                  />
                  <div className="w-full flex items-center justify-between drawer-tools">
                    <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300 breed-name">
                      {fav.breed}
                    </p>
                    <button
                      onClick={() => removeFromFavorites(fav.image)}
                      className="text-xs text-red-500 hover:text-red-700 cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}