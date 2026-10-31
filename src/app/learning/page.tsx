import { Button, Card, Column, Heading, Icon, Meta, Row, Schema, Text } from "@once-ui-system/core";
import LearningTracker from "@/components/learning/LearningTracker";
import { baseURL, learning, person } from "@/resources";

export async function generateMetadata() {
  return Meta.generate({
    title: learning.title,
    description: learning.description,
    baseURL: baseURL,
    image: `/api/og/generate?title=${encodeURIComponent(learning.title)}`,
    path: learning.path,
  });
}

export default function Learning() {
  return (
    <Column fillWidth maxWidth="l" gap="40" paddingBottom="80">
      <Schema
        as="webPage"
        baseURL={baseURL}
        title={learning.title}
        description={learning.description}
        path={learning.path}
        image={`/api/og/generate?title=${encodeURIComponent(learning.title)}`}
        author={{
          name: person.name,
          url: `${baseURL}${learning.path}`,
          image: `${baseURL}${person.avatar}`,
        }}
      />

      {/* Header Section */}
      <Column fillWidth gap="12" marginBottom="16" data-reveal>
        <Row vertical="center" gap="8">
          <Text
            variant="body-strong-s"
            onBackground="neutral-weak"
            style={{ textTransform: "uppercase", letterSpacing: "0.08em" }}
          >
            Continuous Learning & Upskilling
          </Text>
        </Row>
        <Heading as="h1" variant="display-strong-s" data-split="lines">
          {learning.headline}
        </Heading>
        <Text variant="body-default-l" onBackground="neutral-weak" style={{ maxWidth: "48rem" }}>
          {learning.subline}
        </Text>
      </Column>

      {/* Main Notion-Style Tracker Component */}
      <LearningTracker />

      {/* Guided Exploration Completion Card */}
      <Column fillWidth marginTop="16" data-reveal>
        <Card
          padding="24"
          radius="l"
          border="neutral-medium"
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
                background="neutral-alpha-weak"
                border="neutral-alpha-strong"
                vertical="center"
                gap="8"
                fitWidth
              >
                <Icon name="checkCircle" size="xs" onBackground="neutral-strong" />
                <Text variant="body-default-xs" weight="strong" onBackground="neutral-strong">
                  Eksplorasi Selesai • 03 / 03
                </Text>
              </Row>
              <Heading as="h3" variant="heading-strong-l">
                Tertarik Berdiskusi atau Berkolaborasi?
              </Heading>
              <Text variant="body-default-s" onBackground="neutral-weak">
                Anda telah menjelajahi seluruh alur portofolio saya—mulai dari profil, proyek, hingga kurikulum pembelajaran aktif. Mari terhubung untuk mendiskusikan peluang kerja atau kolaborasi proyek.
              </Text>
            </Column>
            <Row gap="12" wrap vertical="center">
              <Button
                href={`mailto:${person.email}`}
                variant="primary"
                size="m"
                prefixIcon="email"
                data-border="rounded"
              >
                Hubungi Saya
              </Button>
              <Button
                href="/"
                variant="secondary"
                size="m"
                prefixIcon="home"
                data-border="rounded"
              >
                Kembali ke Home
              </Button>
            </Row>
          </Row>
        </Card>
      </Column>
    </Column>
  );
}
