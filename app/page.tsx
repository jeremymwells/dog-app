import { unstable_cache } from 'next/cache';
import DogGallery from '../components/DogGallery';
import { BreedAndImage, BreedMeta } from '@/types/dog';

const API_ROOT = 'https://dog.ceo/api'
const ALL_DOGS_ENDPOINT = `${API_ROOT}/breeds/list/all`;
const ALL_IMAGES_FOR_BREED_ENDPOINT = (breed: string) => `${API_ROOT}/breed/${breed}/images`;

const doFetch = async (endpoint: string) => {
  const result = await fetch(endpoint);
  return (await result.json()).message;
}

const getRandomItem = <T,>(items: T[]): T | undefined => {
  if (items.length === 0) return undefined;
  const index = Math.floor(Math.random() * items.length);
  return items[index];
};

const enumerateBreeds = (breeds: Record<string, string[]>): { name: string, path: string }[] => {
  return Object.entries(breeds).flatMap(([breed, subtypes]) =>
    subtypes.length > 0
      ? subtypes.map(subtype => ({ name: `${subtype} ${breed}`, path: `${breed}/${subtype}`}))
      : [{ name: breed, path: breed }]
  );
}

const getElevenRandomDogsAndImages = async (allBreedData: BreedMeta[]) => {
  const result: BreedAndImage[] = [];
  while (result.length < 11) {
    const breed = getRandomItem(allBreedData);
    const image = getRandomItem(breed?.images ?? []);
    if (breed && image) {
      result.push({
        breed: breed.name,
        image: image,
      });
    }
  }
  return result;
}

const getCachedBreedData = unstable_cache(
  async () => {
    return Promise.all(enumerateBreeds(await doFetch(ALL_DOGS_ENDPOINT)).map(async (breed) => {
      const images = await doFetch(ALL_IMAGES_FOR_BREED_ENDPOINT(breed.path));
      return {
        name: breed.name,
        images
      } as BreedMeta;
    }));
  },
  ['breed-data'],
  { revalidate: 3600 } // cache for an hour
);

export default async function Home() {
  const allBreedData = await getCachedBreedData();
  const initialBreedsAndImages = await getElevenRandomDogsAndImages(allBreedData);
  
  return <DogGallery initialBreedsAndImages={initialBreedsAndImages} />;
}
