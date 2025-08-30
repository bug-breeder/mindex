import LandingLayout from "@/layouts/LandingLayout";
import { HeroSection } from "@/components/landing/HeroSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { CTASection } from "@/components/landing/CTASection";

export default function IndexPage() {
  return (
    <LandingLayout>
      <HeroSection />
      <FeaturesSection />
      <CTASection />
    </LandingLayout>
  );
}
