import { Card, CardBody } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { title } from "@/components/primitives";

export function FeaturesSection() {
  const features = [
    {
      title: "AI-Powered Organization",
      description: "Our intelligent algorithms automatically structure your content into logical, easy-to-understand mind maps.",
      icon: "🤖"
    },
    {
      title: "Multiple Content Types",
      description: "Import from web pages, documents, PDFs, videos, and more. We support all your favorite content formats.",
      icon: "📚"
    },
    {
      title: "Beautiful Visual Design",
      description: "Clean, modern mind maps with customizable themes and colors that make your ideas shine.",
      icon: "🎨"
    },
    {
      title: "Real-time Collaboration",
      description: "Share and collaborate on mind maps with your team in real-time. Perfect for brainstorming sessions.",
      icon: "👥"
    },
    {
      title: "Export Anywhere",
      description: "Export your mind maps to PDF, PNG, SVG, or popular formats like OPML and Markdown.",
      icon: "📤"
    },
    {
      title: "Cloud Sync",
      description: "Access your mind maps from anywhere. All your work is automatically saved and synced across devices.",
      icon: "☁️"
    }
  ];

  return (
    <section id="features" className="py-12 sm:py-20 md:py-32 bg-content1/30 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-8 sm:mb-16">
          <div className="flex justify-center mb-3 sm:mb-4">
            <Chip 
              color="primary" 
              variant="flat" 
              size="lg"
            >
              Features
            </Chip>
          </div>
          <h2 className={title({ size: "lg", class: "mb-3 sm:mb-4 px-2 sm:px-0" })}>
            Everything you need to{" "}
            <span className={title({ color: "violet", size: "lg" })}>
              organize
            </span>
            {" "}your ideas
          </h2>
          <p className="text-default-600 text-base sm:text-lg max-w-2xl mx-auto px-4 sm:px-0">
            Powerful features designed to help you create, organize, and share your mind maps effortlessly
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <Card 
              key={index}
              className="group hover:scale-105 transition-all duration-300"
              shadow="sm"
            >
              <CardBody className="p-4 sm:p-6 text-center">
                <div className="text-3xl sm:text-4xl mb-3 sm:mb-4 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">{feature.title}</h3>
                <p className="text-default-600 text-sm sm:text-base leading-relaxed">{feature.description}</p>
              </CardBody>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
