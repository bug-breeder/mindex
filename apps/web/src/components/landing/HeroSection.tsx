import { Button } from "@heroui/button";
import { Link } from "@heroui/link";
import { title, subtitle } from "@/components/primitives";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-violet-50/50 to-transparent dark:from-violet-950/20" />
      
      <div className="relative container mx-auto px-4 py-12 sm:px-6 sm:py-20 md:py-32">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          {/* Hero Title */}
          <h1 className={title({ size: "lg", class: "mb-4 sm:mb-6 leading-tight" })}>
            Transform{" "}
            <span className={title({ color: "violet", size: "lg" })}>
              content
            </span>
            <br />
            into beautiful mind maps
            <br />
            <span className={title({ color: "violet", size: "lg" })}>
              with AI
            </span>
          </h1>
          
          {/* Subtitle */}
          <p className={subtitle({ class: "mb-6 sm:mb-8 max-w-2xl px-2 sm:px-0" })}>
            Convert web pages, documents, and videos into organized visual maps. 
            Transform complex information into clear, actionable insights.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full max-w-sm sm:max-w-none sm:w-auto">
            <Button 
              as={Link} 
              href="/maps"
              color="primary" 
              size="lg" 
              radius="full"
              variant="shadow"
              className="px-6 py-3 sm:px-8 sm:py-6 text-base font-semibold min-h-12 sm:min-h-14"
            >
              Get Started
            </Button>
            <Button 
              as={Link}
              href="#features"
              variant="bordered" 
              size="lg" 
              radius="full"
              className="px-6 py-3 sm:px-8 sm:py-6 text-base min-h-12 sm:min-h-14"
            >
              Learn More
            </Button>
          </div>
          
          {/* Stats or Social Proof */}
          <div className="mt-8 sm:mt-16 flex flex-col sm:flex-row items-center gap-4 sm:gap-8 text-sm text-default-600">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0" />
              <span className="text-center sm:text-left">No limits. No restrictions.</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
              <span className="text-center sm:text-left">AI-powered organization</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full flex-shrink-0" />
              <span className="text-center sm:text-left">Beautiful visual maps</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
