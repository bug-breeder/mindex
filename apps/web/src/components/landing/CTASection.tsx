import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { Link } from "@heroui/link";
import { title } from "@/components/primitives";

export function CTASection() {
  return (
    <section className="py-12 sm:py-20 md:py-32 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6">
        <Card 
          className="bg-gradient-to-r from-violet-500 to-purple-600 text-white overflow-hidden"
          shadow="lg"
        >
          <CardBody className="p-6 sm:p-12 md:p-16 text-center relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-8 translate-x-8" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-6 -translate-x-6" />
            
            <div className="relative z-10 max-w-3xl mx-auto">
              <h2 className={title({ size: "lg", class: "mb-4 sm:mb-6 text-white px-2 sm:px-0" })}>
                Ready to transform your{" "}
                <span className="underline decoration-yellow-300">
                  content
                </span>
                {" "}into mind maps?
              </h2>
              
              <p className="text-lg sm:text-xl text-violet-100 mb-6 sm:mb-8 max-w-2xl mx-auto px-2 sm:px-0">
                Join thousands of users who have already transformed their content 
                into beautiful, organized mind maps with AI.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center max-w-sm sm:max-w-none mx-auto">
                <Button 
                  as={Link}
                  href="/maps"
                  size="lg"
                  radius="full"
                  variant="solid"
                  className="bg-white text-violet-600 font-semibold px-6 py-3 sm:px-8 sm:py-6 text-base hover:bg-violet-50 min-h-12 sm:min-h-14"
                >
                  Get Started Free
                </Button>
                <Button 
                  as={Link}
                  href="/import"
                  size="lg"
                  radius="full"
                  variant="bordered"
                  className="border-white text-white px-6 py-3 sm:px-8 sm:py-6 text-base hover:bg-white/10 min-h-12 sm:min-h-14"
                >
                  Try Import
                </Button>
              </div>
              
              <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 text-sm text-violet-100">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-300 rounded-full flex-shrink-0" />
                  <span>Free to start</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-300 rounded-full flex-shrink-0" />
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-yellow-300 rounded-full flex-shrink-0" />
                  <span>Start in seconds</span>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </section>
  );
}
