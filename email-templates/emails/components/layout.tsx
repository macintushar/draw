import {
  Body,
  Container,
  Head,
  Html,
  Img,
  Preview,
  Section,
  Tailwind,
  Text,
  pixelBasedPreset,
} from "react-email";
import type { ReactNode } from "react";

const baseUrl = process.env.EMAIL_ASSETS_BASE_URL ?? "";

interface EmailLayoutProps {
  preview: string;
  children: ReactNode;
}

export function EmailLayout({ preview, children }: EmailLayoutProps) {
  return (
    <Html lang="en">
      <Tailwind
        config={{
          presets: [pixelBasedPreset],
          theme: {
            extend: {
              colors: {
                brand: "#18181b",
              },
            },
          },
        }}
      >
        <Head />
        <Body className="bg-gray-100 font-sans">
          <Preview>{preview}</Preview>
          <Container className="mx-auto my-10">
            <Section className="overflow-hidden rounded-lg border border-solid border-gray-200 bg-white">
              <Section className="bg-zinc-950 px-8 py-5">
                <Img
                  src={`${baseUrl}/static/draw-logo.png`}
                  alt="Draw"
                  width="114"
                  height="40"
                />
              </Section>
              <Section className="px-8 py-8">{children}</Section>
            </Section>
            <Section className="px-8 py-6 text-center">
              <Text className="m-0 text-xs leading-5 text-gray-500">
                Draw — the digital drawing tool.
              </Text>
              <Text className="m-0 text-xs leading-5 text-gray-400">
                © {new Date().getFullYear()} Draw. All rights reserved.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
