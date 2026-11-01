import Link from "next/link";
import Image from "next/image";
import { Column, Heading, Icon, Row, Text } from "@once-ui-system/core";
import { visualWorkGroups } from "@/resources/visual-work";
import styles from "./VisualDesign.module.scss";

const previews = [
  visualWorkGroups[0].images[0],
  visualWorkGroups[1].images[0],
  visualWorkGroups[2].images[0],
];

export function CreativeWork() {
  return (
    <Column as="section" fillWidth paddingX="l" gap="24" marginTop="32" aria-labelledby="creative-work-heading">
      <Column gap="8">
        <Heading as="h2" id="creative-work-heading" variant="heading-strong-xl">Creative Work</Heading>
        <Text variant="body-default-m" onBackground="neutral-weak">Karya desain visual dari perjalanan saya bersama komunitas musik.</Text>
      </Column>
      <Link href="/projects/ukm-musik-visual-design" className={styles.projectLink}>
        <Row className={styles.previewGrid}>
          {previews.map((preview) => {
            const [width, height] = preview.aspectRatio.split(" / ").map(Number);
            return <Image key={preview.src} src={preview.src} alt={preview.alt} width={width} height={height} sizes="(max-width: 600px) 25vw, (max-width: 900px) 27vw, 180px" className={styles.previewImage} />;
          })}
        </Row>
        <Column gap="16" className={styles.projectCopy}>
          <Text variant="label-default-s" className={styles.eyebrow}>Visual Design · UKM Musik UDINUS</Text>
          <Heading as="h3" variant="heading-strong-xl">Musik, komunitas, dan cerita visual.</Heading>
          <Text as="p" variant="body-default-m">Poster acara, kampanye rekrutmen, dan konten musik dalam satu koleksi.</Text>
          <Row gap="8" vertical="center"><Text variant="label-strong-s">Lihat koleksi</Text><Icon name="arrowRight" size="s" /></Row>
        </Column>
      </Link>
    </Column>
  );
}
