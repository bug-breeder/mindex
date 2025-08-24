import { Link } from "@heroui/link";
import { Snippet } from "@heroui/snippet";
import { Code } from "@heroui/code";
import { button as buttonStyles } from "@heroui/theme";

import { siteConfig } from "@/config/site";
import { title, subtitle } from "@/components/primitives";
import { GithubIcon } from "@/components/icons";
import DefaultLayout from "@/layouts/default";

export default function IndexPage() {
  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div className="inline-block max-w-lg text-center justify-center">
          <span className={title()}>Transform&nbsp;</span>
          <span className={title({ color: "violet" })}>content&nbsp;</span>
          <br />
          <span className={title()}>
            into beautiful mind maps with AI.
          </span>
          <div className={subtitle({ class: "mt-4" })}>
            Convert web pages, documents, and videos into organized visual maps.
          </div>
        </div>

        <div className="flex gap-3">
          <Link
            className={buttonStyles({
              color: "primary",
              radius: "full",
              variant: "shadow",
            })}
            href="/maps"
          >
            Get Started
          </Link>
          <Link
            className={buttonStyles({ variant: "bordered", radius: "full" })}
            href="/import"
          >
            Import Content
          </Link>
        </div>

        <div className="mt-8">
          <Snippet hideCopyButton hideSymbol variant="bordered">
            <span>
              Start by creating your first mind map or{" "}
              <Code color="primary">importing content</Code>
            </span>
          </Snippet>
        </div>
      </section>
    </DefaultLayout>
  );
}
