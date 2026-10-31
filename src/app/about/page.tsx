import {
  Avatar,
  Button,
  Card,
  Column,
  Heading,
  Icon,
  IconButton,
  Line,
  Media,
  Tag,
  Text,
  Meta,
  Schema,
  Row,
} from "@once-ui-system/core";
import { baseURL, about, person, social } from "@/resources";
import TableOfContents from "@/components/about/TableOfContents";
import styles from "@/components/about/about.module.scss";
import React from "react";

export async function generateMetadata() {
  return Meta.generate({
    title: about.title,
    description: about.description,
    baseURL: baseURL,
    image: `/api/og/generate?title=${encodeURIComponent(about.title)}`,
    path: about.path,
  });
}

export default function About() {
  const structure = [
    {
      title: about.intro.title,
      display: about.intro.display,
      items: [],
    },
    {
      title: about.work.title,
      display: about.work.display,
      items: about.work.experiences.map((experience) => experience.company),
    },
    {
      title: about.studies.title,
      display: about.studies.display,
      items: about.studies.institutions.map((institution) => institution.name),
    },
    {
      title: about.technical.title,
      display: about.technical.display,
      items: about.technical.skills.map((skill) => skill.title),
    },
  ];
  return (
    <Column maxWidth="m" paddingBottom="128" s={{ paddingBottom: "160" }}>
      <Schema
        as="webPage"
        baseURL={baseURL}
        title={about.title}
        description={about.description}
        path={about.path}
        image={`/api/og/generate?title=${encodeURIComponent(about.title)}`}
        author={{
          name: person.name,
          url: `${baseURL}${about.path}`,
          image: `${baseURL}${person.avatar}`,
        }}
      />
      {about.tableOfContent.display && (
        <Column
          left="0"
          style={{ top: "50%", transform: "translateY(-50%)" }}
          position="fixed"
          paddingLeft="24"
          gap="32"
          s={{ hide: true }}
        >
          <TableOfContents structure={structure} about={about} />
        </Column>
      )}
      <Row fillWidth s={{ direction: "column" }} horizontal="center">
        {about.avatar.display && (
          <Column
            className={styles.avatar}
            top="64"
            fitHeight
            position="sticky"
            s={{ position: "relative", style: { top: "auto" } }}
            xs={{ style: { top: "auto" } }}
            minWidth="160"
            paddingX="l"
            paddingBottom="xl"
            gap="m"
            flex={3}
            horizontal="center"
          >
            <Avatar src={person.avatar} size="xl" />
            <Row gap="8" vertical="center">
              <Icon onBackground="brand-weak" name="globe" />
              Semarang, Indonesia
            </Row>
            {person.languages && person.languages.length > 0 && (
              <Row wrap gap="8">
                {person.languages.map((language, index) => (
                  <Tag key={index} size="l">
                    {language}
                  </Tag>
                ))}
              </Row>
            )}
          </Column>
        )}
        <Column className={styles.blockAlign} flex={9} maxWidth={40}>
          <Column
            id={about.intro.title}
            fillWidth
            minHeight="160"
            vertical="center"
            marginBottom="32"
          >
            {about.calendar.display && (
              <Row
                fitWidth
                border="brand-alpha-medium"
                background="brand-alpha-weak"
                radius="full"
                padding="4"
                gap="8"
                marginBottom="m"
                vertical="center"
                className={styles.blockAlign}
                style={{
                  backdropFilter: "blur(var(--static-space-1))",
                }}
              >
                <Icon paddingLeft="12" name="calendar" onBackground="brand-weak" />
                <Row paddingX="8">Jadwalkan diskusi</Row>
                <IconButton
                  href={about.calendar.link}
                  data-border="rounded"
                  variant="secondary"
                  icon="chevronRight"
                />
              </Row>
            )}
            <Heading data-split="lines" className={styles.textAlign} variant="display-strong-xl">
              {person.name}
            </Heading>
            <Text
              data-reveal
              className={styles.textAlign}
              variant="display-default-xs"
              onBackground="neutral-weak"
            >
              {person.role}
            </Text>
            {social.length > 0 && (
              <Row
                data-reveal
                className={styles.blockAlign}
                paddingTop="20"
                paddingBottom="8"
                gap="8"
                wrap
                horizontal="center"
                fitWidth
                data-border="rounded"
              >
                {social
                  .filter((item) => item.essential)
                  .map(
                    (item) =>
                      item.link && (
                        <React.Fragment key={item.name}>
                          <Row s={{ hide: true }}>
                            <Button
                              key={item.name}
                              href={item.link}
                              prefixIcon={item.icon}
                              label={item.name}
                              size="s"
                              weight="default"
                              variant="secondary"
                            />
                          </Row>
                          <Row hide s={{ hide: false }}>
                            <IconButton
                              size="l"
                              key={`${item.name}-icon`}
                              href={item.link}
                              icon={item.icon}
                              variant="secondary"
                            />
                          </Row>
                        </React.Fragment>
                      ),
                  )}
              </Row>
            )}
          </Column>

          {about.intro.display && (
            <Column data-reveal textVariant="body-default-l" fillWidth gap="m" marginBottom="xl">
              {about.intro.description}
            </Column>
          )}

          {about.work.display && (
            <>
              <Column data-reveal fillWidth gap="8" marginBottom="32">
                <Row vertical="center" gap="8">
                  <Tag size="s" variant="neutral">
                    {about.work.tag || "PENGALAMAN & PROYEK"}
                  </Tag>
                </Row>
                <Heading data-split="lines" as="h2" id={about.work.title} variant="display-strong-s">
                  {about.work.headline || about.work.title}
                </Heading>
                {about.work.description && (
                  <Text variant="body-default-l" onBackground="neutral-weak">
                    {about.work.description}
                  </Text>
                )}
              </Column>
              <Column data-stagger fillWidth gap="l" marginBottom="40">
                {about.work.experiences.map((experience, index) => (
                  <Column key={`${experience.company}-${experience.role}-${index}`} fillWidth gap="8">
                    <Row fillWidth horizontal="between" vertical="center" wrap gap="8">
                      <Row vertical="center" gap="8">
                        <Text variant="body-strong-s" onBackground="neutral-weak">
                          {experience.timeframe}
                        </Text>
                        {experience.tag && (
                          <Tag size="s" variant="neutral">
                            {experience.tag}
                          </Tag>
                        )}
                      </Row>
                    </Row>
                    <Column fillWidth gap="2">
                      <Text
                        id={experience.company}
                        variant="heading-strong-l"
                        className={styles.itemTitle}
                      >
                        {experience.company}
                      </Text>
                      <Text variant="body-default-s" onBackground="brand-medium">
                        {experience.role}
                      </Text>
                    </Column>
                    <Column as="ul" gap="12" s={{ gap: "10", paddingLeft: "16" }}>
                      {experience.achievements.map(
                        (achievement: React.ReactNode, achIndex: number) => (
                          <Text
                            as="li"
                            variant="body-default-m"
                            key={`${experience.company}-${achIndex}`}
                            className={styles.achievementText}
                            style={{ lineHeight: "1.65" }}
                          >
                            {achievement}
                          </Text>
                        ),
                      )}
                    </Column>
                    {experience.images && experience.images.length > 0 && (
                      <Row fillWidth paddingTop="m" s={{ paddingTop: "12" }} gap="12" wrap>
                        {experience.images.map((image, imgIndex) => (
                          <Row
                            key={imgIndex}
                            border="neutral-medium"
                            radius="l"
                            fillWidth
                            style={{ overflow: "hidden" }}
                            s={{ minWidth: "100%", height: "auto" }}
                          >
                            <Media
                              radius="l"
                              sizes="(max-width: 768px) 100vw, 600px"
                              alt={image.alt}
                              src={image.src}
                            />
                          </Row>
                        ))}
                      </Row>
                    )}
                    {index < about.work.experiences.length - 1 && (
                      <Line background="neutral-alpha-weak" marginY="24" s={{ marginY: "16" }} />
                    )}
                  </Column>
                ))}
              </Column>
            </>
          )}

          {about.studies.display && (
            <>
              <Heading
                data-split="lines"
                as="h2"
                id={about.studies.title}
                variant="display-strong-s"
                marginBottom="m"
              >
                {about.studies.title}
              </Heading>
              <Column data-stagger fillWidth gap="l" marginBottom="40">
                {about.studies.institutions.map((institution, index) => (
                  <Column key={`${institution.name}-${index}`} fillWidth gap="4">
                    <Text
                      id={institution.name}
                      variant="heading-strong-l"
                      className={styles.itemTitle}
                    >
                      {institution.name}
                    </Text>
                    <Text variant="heading-default-xs" onBackground="neutral-weak">
                      {institution.description}
                    </Text>
                    {index < about.studies.institutions.length - 1 && (
                      <Line background="neutral-alpha-weak" marginY="16" />
                    )}
                  </Column>
                ))}
              </Column>
            </>
          )}

          {about.technical.display && (
            <>
              <Heading
                data-split="lines"
                as="h2"
                id={about.technical.title}
                variant="display-strong-s"
                marginBottom="40"
              >
                {about.technical.title}
              </Heading>
              <Column data-stagger fillWidth gap="l">
                {about.technical.skills.map((skill, index) => (
                  <Column key={`${skill}-${index}`} fillWidth gap="4">
                    <Text id={skill.title} variant="heading-strong-l" className={styles.itemTitle}>
                      {skill.title}
                    </Text>
                    <Text variant="body-default-m" onBackground="neutral-weak">
                      {skill.description}
                    </Text>
                    {skill.tags && skill.tags.length > 0 && (
                      <Row wrap gap="8" paddingTop="8">
                        {skill.tags.map((tag, tagIndex) => (
                          <Tag key={`${skill.title}-${tagIndex}`} size="l" prefixIcon={tag.icon}>
                            {tag.name}
                          </Tag>
                        ))}
                      </Row>
                    )}
                    {skill.images && skill.images.length > 0 && (
                      <Row fillWidth paddingTop="m" gap="12" wrap s={{ paddingTop: "12" }}>
                        {skill.images.map((image, imgIndex) => (
                          <Row
                            key={imgIndex}
                            border="neutral-medium"
                            radius="m"
                            fillWidth
                            minWidth={image.width}
                            height={image.height}
                            s={{ minWidth: "100%", height: "auto" }}
                            style={{ overflow: "hidden" }}
                          >
                            <Media
                              radius="m"
                              sizes="(max-width: 768px) 100vw, 600px"
                              alt={image.alt}
                              src={image.src}
                            />
                          </Row>
                        ))}
                      </Row>
                    )}
                    {index < about.technical.skills.length - 1 && (
                      <Line background="neutral-alpha-weak" marginY="16" />
                    )}
                  </Column>
                ))}
              </Column>
            </>
          )}

          {/* Guided Next Step: About -> Projects */}
          <Column fillWidth marginTop="64" data-reveal>
            <Card
              href="/projects"
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
                    <Icon name="grid" size="xs" onBackground="brand-strong" />
                    <Text variant="body-default-xs" weight="strong" onBackground="brand-strong">
                      Langkah Selanjutnya • 02 / 03
                    </Text>
                  </Row>
                  <Heading as="h3" variant="heading-strong-l">
                    Lanjut ke Projects & Studi Kasus
                  </Heading>
                  <Text variant="body-default-s" onBackground="neutral-weak">
                    Lihat bagaimana keahlian teknis di atas diterapkan secara nyata pada proyek produksi, mulai dari autonomous AI agent Hermes hingga visualisasi 3D WebGL.
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
                    Eksplorasi Projects
                  </Text>
                  <Icon name="arrowRight" size="xs" onBackground="brand-strong" />
                </Row>
              </Row>
            </Card>
          </Column>
        </Column>
      </Row>
    </Column>
  );
}
