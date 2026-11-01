"use client";

import { Column, Heading, Text } from "@once-ui-system/core";
import { visualWorkGroups } from "@/resources/visual-work";
import { ImageGallery } from "./ProjectMedia";

export function ArtworkGallery() {
  return (
    <Column fillWidth gap="48">
      {visualWorkGroups.map((group) => (
        <Column as="section" key={group.id} id={group.id} aria-labelledby={group.id + "-heading"} gap="24">
          <Column gap="8">
            <Heading as="h2" id={group.id + "-heading"} variant="heading-strong-l">{group.title}</Heading>
            <Text as="p" variant="body-default-s" onBackground="neutral-weak">{group.description}</Text>
          </Column>
          <ImageGallery
            label={group.title}
            images={group.images.map((artwork) => {
              const [width, height] = artwork.aspectRatio.split(" / ").map(Number);
              return { ...artwork, width, height };
            })}
          />
        </Column>
      ))}

    </Column>
  );
}
