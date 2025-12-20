import Features from "@/components/landing/Features";
import Hero from "@/components/landing/Hero";
import Modes from "@/components/landing/Modes";

export default function LandingPage() {
  return (
    <div className="flex flex-col gap-16">
      <Hero />
      <Modes />
      <Features />
    </div>
  );
}
