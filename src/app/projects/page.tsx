import { Card, Column, Heading, Icon, Meta, Row, Schema, Text } from "@once-ui-system/core";
import { baseURL, about, person, work } from "@/resources";
import { Projects } from "@/components/projects/Projects";

export async function generateMetadata() {
  return Meta.generate({
    title: work.title,
    description: work.description,
    baseURL: baseURL,
    image: `/api/og/generate?title=${encodeURIComponent(work.title)}`,
    path: work.path,
  });
}

export default function ProjectsPage() {
  return (
    <Column fillWidth maxWidth="l" paddingTop="24" paddingBottom="80">
      <Schema
        as="webPage"
        baseURL={baseURL}
        path={work.path}
        title={work.title}
        description={work.description}
        image={`/api/og/generate?title=${encodeURIComponent(work.title)}`}
        author={{
          name: person.name,
          url: `${baseURL}${about.path}`,
          image: `${baseURL}${person.avatar}`,
        }}
      />
      <Heading data-split="lines" marginBottom="l" variant="heading-strong-xl" align="center">
        {work.title}
      </Heading>
      <Projects />

      {/* Guided Next Step: Projects -> Learning */}
      <Column fillWidth paddingX="l" marginTop="24" data-reveal>
        <Card
          href="/learning"
          padding="24"
          radius="l"
          border="brand-alpha-strong"
          background="surface"
          fillWidth
        >
          <Row
            fillWidth
            horizontal="between"
            vertical="center"
            gap="24"
            s={{ direction: "column", horizontal: "start" }}
          >
            <Column gap="8" flex={1}>
              <Row
                paddingY="4"
                paddingX="8"
                radius="full"
                background="brand-alpha-weak"
                border="brand-alpha-strong"
                vertical="center"
                gap="8"
                fitWidth
              >
                <Icon name="graduationCap" size="xs" onBackground="brand-strong" />
                <Text variant="body-default-xs" weight="strong" onBackground="brand-strong">
                  Langkah Selanjutnya • 03 / 03
                </Text>
              </Row>
              <Heading as="h3" variant="heading-strong-l">
                Lanjut ke Active Learning & Roadmap
              </Heading>
              <Text variant="body-default-s" onBackground="neutral-weak">
                Telusuri kurikulum intensif, program beasiswa IDCamp & Dicoding, serta sertifikasi profesional yang sedang saya tempuh saat ini.
              </Text>
            </Column>
            <Row
              vertical="center"
              gap="8"
              paddingY="8"
              paddingX="16"
              radius="full"
              background="brand-alpha-weak"
              border="brand-alpha-medium"
            >
              <Text variant="label-default-s" onBackground="brand-strong">
                Buka Learning Tracker
              </Text>
              <Icon name="arrowRight" size="xs" onBackground="brand-strong" />
            </Row>
          </Row>
        </Card>
      </Column>
    </Column>
  );
}
