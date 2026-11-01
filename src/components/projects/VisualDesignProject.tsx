import Link from "next/link";
import { Button, Column, Heading, Row, Schema, Text } from "@once-ui-system/core";
import { baseURL, person } from "@/resources";
import { ArtworkGallery } from "./ArtworkGallery";
import styles from "./VisualDesign.module.scss";

interface VisualDesignProjectProps {
  title: string;
  summary: string;
  slug: string;
}

export function VisualDesignProject({ title, summary, slug }: VisualDesignProjectProps) {
  return (
    <Column as="main" maxWidth="l" className={styles.galleryPage} gap="40">
      <Schema as="webPage" baseURL={baseURL} path={"/projects/" + slug} title={title} description={summary} image="/images/projects/ukm-musik/senandung-poster.webp" author={{ name: person.name, url: baseURL + "/about", image: baseURL + person.avatar }} />
      <Column gap="20" maxWidth={46}>
        <Link href="/projects" className={styles.backLink}>← Semua Projects</Link>
        <Text variant="label-default-s" className={styles.eyebrow}>Selected Visual Work</Text>
        <Heading as="h1" variant="display-strong-m">{title}</Heading>
        <Text as="p" variant="body-default-l" className={styles.description}>{summary}</Text>
      </Column>
      <Row wrap gap="32" className={styles.projectMeta}>
        <Column gap="4"><Text variant="label-default-xs" onBackground="neutral-weak">Peran</Text><Text variant="body-strong-s">Koordinator / Creative Director & Desainer</Text></Column>
        <Column gap="4"><Text variant="label-default-xs" onBackground="neutral-weak">Organisasi</Text><Text variant="body-strong-s">UKM Musik UDINUS</Text></Column>
        <Column gap="4"><Text variant="label-default-xs" onBackground="neutral-weak">Periode organisasi</Text><Text variant="body-strong-s">2022–2025</Text></Column>
      </Row>
      <ArtworkGallery />
      <Row wrap gap="16" paddingTop="24">
        <Button href="/projects" variant="secondary">Kembali ke Projects</Button>
        <Button href="/about" variant="tertiary" suffixIcon="arrowRight">Tentang saya</Button>
      </Row>
    </Column>
  );
}
