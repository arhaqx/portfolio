"use client";

import React from "react";
import Link from "next/link";
import {
  AvatarGroup,
  Column,
  Heading,
  Icon,
  Text,
} from "@once-ui-system/core";
import { DepthCard, DepthLayer } from "@/components/motion";
import styles from "./ProjectCard.module.scss";

interface ProjectCardProps {
  href: string;
  priority?: boolean;
  images: string[];
  title: string;
  content: string;
  description: string;
  avatars: { src: string }[];
  link: string;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  href,
  priority = false,
  images = [],
  title,
  content,
  description,
  avatars = [],
  link,
}) => {
  return (
    <div className={styles.projectCardWrapper}>
      <DepthCard
        maxRotation={12}
        maxTranslation={12}
        spotlight={true}
        disableOnMobile={true}
      >
        {/* Parallax Layer 1: Single Featured Project Cover Image (No Slide / Carousel) */}
        {images.length > 0 && (
          <DepthLayer depth={18}>
            <Link
              href={href}
              className={styles.imageLink}
              aria-label={`Buka studi kasus ${title}`}
            >
              <div className={styles.imageFrame}>
                <img
                  src={images[0]}
                  alt={title}
                  loading={priority ? "eager" : "lazy"}
                  className={styles.coverImage}
                />
              </div>
            </Link>
          </DepthLayer>
        )}

        {/* Parallax Layer 2: Project Details & Meta */}
        <div className={styles.detailsWrapper}>
          <Column fillWidth gap="12" flex={1}>
            {title && (
              <DepthLayer depth={36}>
                <Link href={href} className={styles.titleLink}>
                  <Heading
                    as="h2"
                    wrap="balance"
                    variant="heading-strong-l"
                    className={styles.projectTitle}
                  >
                    {title}
                  </Heading>
                </Link>
              </DepthLayer>
            )}

            {avatars?.length > 0 && (
              <DepthLayer depth={30}>
                <AvatarGroup avatars={avatars} size="s" reverse />
              </DepthLayer>
            )}

            {description?.trim() && (
              <DepthLayer depth={26}>
                <Text
                  variant="body-default-s"
                  onBackground="neutral-strong"
                  className={styles.projectDescription}
                >
                  {description}
                </Text>
              </DepthLayer>
            )}

            {/* Flexible spacer so actions align at bottom across all cards */}
            <div className={styles.actionsSpacer} />

            <DepthLayer depth={44}>
              <div className={styles.actionsRow}>
                {content?.trim() && (
                  <Link href={href} className={styles.actionPill}>
                    <span>Baca studi kasus</span>
                    <Icon name="arrowRight" size="xs" />
                  </Link>
                )}
                {link && (
                  <a
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.actionPill}
                  >
                    <span>Lihat proyek</span>
                    <Icon name="arrowUpRightFromSquare" size="xs" />
                  </a>
                )}
              </div>
            </DepthLayer>
          </Column>
        </div>
      </DepthCard>
    </div>
  );
};
