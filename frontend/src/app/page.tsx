import { NavigationGrid } from "@/components/NavigationGrid";
import { Hero } from "@/components/Hero";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Hero />
      <div className="container mx-auto px-4 py-8">
        <NavigationGrid />
      </div>
    </div>
  );
}