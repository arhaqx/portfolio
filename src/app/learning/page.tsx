import { Column, Heading, Meta, RevealFx, Row, Schema, Text } from "@once-ui-system/core";
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
      <RevealFx translateY="8">
        <Column fillWidth gap="12" marginBottom="16">
          <Row vertical="center" gap="8">
            <Text
              variant="body-default-s"
              weight="strong"
              onBackground="brand-strong"
              style={{ textTransform: "uppercase", letterSpacing: "0.08em" }}
            >
              Continuous Learning & Upskilling
            </Text>
          </Row>
          <Heading as="h1" variant="display-strong-s">
            {learning.headline}
          </Heading>
          <Text variant="body-default-l" onBackground="neutral-weak" style={{ maxWidth: "48rem" }}>
            {learning.subline}
          </Text>
        </Column>
      </RevealFx>

      {/* Main Notion-Style Tracker Component */}
      <LearningTracker />
    </Column>
  );
}
