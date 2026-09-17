"use client";

import { useState } from "react";
import {
  Badge,
  Card,
  Column,
  Flex,
  Grid,
  Heading,
  Icon,
  Line,
  ProgressBar,
  RevealFx,
  Row,
  Tag,
  Text,
  ToggleButton,
} from "@once-ui-system/core";
import { learning } from "@/resources";
import { CourseModule, LearningTrack } from "@/types";

type FilterType = "all" | "in-progress" | "completed";

export default function LearningTracker() {
  const [filter, setFilter] = useState<FilterType>("all");

  const tracks = learning.tracks;

  const filteredTracks = tracks.filter((track) => {
    if (filter === "all") return true;
    return track.status === filter;
  });

  // Calculate overall statistics
  const totalModules = tracks.reduce((acc, t) => acc + t.modules.length, 0);
  const completedModules = tracks.reduce(
    (acc, t) => acc + t.modules.filter((m) => m.status === "completed").length,
    0
  );
  const inProgressModules = tracks.reduce(
    (acc, t) => acc + t.modules.filter((m) => m.status === "in-progress").length,
    0
  );
  const overallPercentage = Math.round((completedModules / totalModules) * 100);

  return (
    <Column fillWidth gap="32">
      {/* Notion-Style Quick Stats / KPI Metrics */}
      <RevealFx translateY="8" delay={0.1}>
        <Card
          fillWidth
          padding="24"
          radius="l"
          border="neutral-medium"
          background="surface"
        >
          <Column fillWidth gap="20">
            <Row fillWidth horizontal="between" vertical="center" wrap gap="12">
              <Row vertical="center" gap="12">
                <Row
                  padding="8"
                  radius="m"
                  background="brand-alpha-weak"
                  border="brand-alpha-medium"
                  vertical="center"
                  horizontal="center"
                >
                  <Icon name="graduationCap" onBackground="brand-strong" size="m" />
                </Row>
                <Column gap="2">
                  <Text variant="heading-strong-s">Statistik & Progres Belajar</Text>
                  <Text variant="body-default-xs" onBackground="neutral-weak">
                    Akumulasi kurikulum teknologi aktif dan sertifikasi
                  </Text>
                </Column>
              </Row>

              <Badge arrow={false} effect={false}>
                <Row vertical="center" gap="8">
                  <Icon name="sparkles" size="xs" onBackground="brand-strong" />
                  <Text variant="body-default-xs" weight="strong">
                    {completedModules}/{totalModules} Modul ({overallPercentage}%)
                  </Text>
                </Row>
              </Badge>
            </Row>

            {/* Overall Progress Bar */}
            <Column fillWidth gap="8">
              <Row fillWidth horizontal="between" vertical="center">
                <Text variant="body-default-xs" onBackground="neutral-weak">
                  Rata-rata Penyelesaian Keseluruhan
                </Text>
                <Text variant="body-default-xs" weight="strong">
                  {overallPercentage}%
                </Text>
              </Row>
              <ProgressBar value={overallPercentage} max={100} label={false} />
            </Column>

            <Line background="neutral-alpha-weak" />

            {/* Stats Grid */}
            <Grid columns={4} s={{ columns: 2 }} gap="16" fillWidth>
              <Column
                padding="12"
                radius="m"
                background="neutral-alpha-weak"
                border="neutral-alpha-medium"
                gap="4"
              >
                <Text variant="body-default-xs" onBackground="neutral-weak">
                  Program Aktif
                </Text>
                <Text variant="heading-strong-m">{tracks.length} Program</Text>
              </Column>
              <Column
                padding="12"
                radius="m"
                background="accent-alpha-weak"
                border="accent-alpha-medium"
                gap="4"
              >
                <Text variant="body-default-xs" onBackground="accent-strong">
                  Modul Tuntas (100%)
                </Text>
                <Text variant="heading-strong-m" onBackground="accent-strong">
                  {completedModules} Kelas
                </Text>
              </Column>
              <Column
                padding="12"
                radius="m"
                background="brand-alpha-weak"
                border="brand-alpha-medium"
                gap="4"
              >
                <Text variant="body-default-xs" onBackground="brand-strong">
                  Sedang Berjalan
                </Text>
                <Text variant="heading-strong-m" onBackground="brand-strong">
                  {inProgressModules} Modul
                </Text>
              </Column>
              <Column
                padding="12"
                radius="m"
                background="neutral-alpha-weak"
                border="neutral-alpha-medium"
                gap="4"
              >
                <Text variant="body-default-xs" onBackground="neutral-weak">
                  Milestone Penting
                </Text>
                <Text variant="body-default-s" weight="strong">
                  30 Sept 2026
                </Text>
              </Column>
            </Grid>
          </Column>
        </Card>
      </RevealFx>

      {/* Filter Navigation Tabs */}
      <RevealFx translateY="8" delay={0.2}>
        <Row fillWidth horizontal="between" vertical="center" wrap gap="16">
          <Row gap="8" wrap>
            <ToggleButton
              selected={filter === "all"}
              onClick={() => setFilter("all")}
              label={`Semua (${tracks.length})`}
            />
            <ToggleButton
              selected={filter === "in-progress"}
              onClick={() => setFilter("in-progress")}
              label={`Sedang Berjalan (${tracks.filter((t) => t.status === "in-progress").length})`}
            />
            <ToggleButton
              selected={filter === "completed"}
              onClick={() => setFilter("completed")}
              label={`Selesai 100% (${tracks.filter((t) => t.status === "completed").length})`}
            />
          </Row>

          <Row vertical="center" gap="8" s={{ hide: true }}>
            <Icon name="clock" size="xs" onBackground="neutral-weak" />
            <Text variant="body-default-xs" onBackground="neutral-weak">
              Diperbarui berkala sesuai progres belajar
            </Text>
          </Row>
        </Row>
      </RevealFx>

      {/* Notion-Style Program Tracks List */}
      <Column fillWidth gap="32">
        {filteredTracks.map((track, trackIndex) => (
          <RevealFx key={track.id} translateY="12" delay={0.25 + trackIndex * 0.1}>
            <Card
              fillWidth
              radius="l"
              border="neutral-medium"
              background="surface"
              padding="24"
            >
              <Column fillWidth gap="24">
                {/* Track Header */}
                <Row fillWidth horizontal="between" vertical="start" wrap gap="16">
                  <Column gap="8" flex={3} minWidth={260}>
                    <Row vertical="center" gap="8" wrap>
                      <Tag size="m">
                        <Icon name="graduationCap" size="xs" />
                        {track.provider}
                      </Tag>
                      <Tag size="m">{track.level}</Tag>
                    </Row>
                    <Heading as="h3" variant="heading-strong-l">
                      {track.program}
                    </Heading>
                    <Text variant="body-default-m" onBackground="brand-strong" weight="strong">
                      {track.trackName}
                    </Text>
                  </Column>

                  <Column horizontal="end" s={{ horizontal: "start" }} gap="8" flex={1}>
                    {track.status === "completed" ? (
                      <Row
                        padding="4"
                        paddingX="12"
                        radius="full"
                        background="accent-alpha-weak"
                        border="accent-alpha-strong"
                        vertical="center"
                        gap="4"
                      >
                        <Icon name="checkCircle" size="xs" onBackground="accent-strong" />
                        <Text variant="body-default-xs" onBackground="accent-strong" weight="strong">
                          {track.statusLabel}
                        </Text>
                      </Row>
                    ) : (
                      <Row
                        padding="4"
                        paddingX="12"
                        radius="full"
                        background="brand-alpha-weak"
                        border="brand-alpha-strong"
                        vertical="center"
                        gap="4"
                      >
                        <Icon name="clock" size="xs" onBackground="brand-strong" />
                        <Text variant="body-default-xs" onBackground="brand-strong" weight="strong">
                          {track.statusLabel}
                        </Text>
                      </Row>
                    )}

                    {track.deadlineLabel && (
                      <Text variant="body-default-xs" onBackground="neutral-weak">
                        {track.deadlineLabel}
                      </Text>
                    )}
                  </Column>
                </Row>

                {/* Progress Bar Component */}
                <Column fillWidth gap="8">
                  <Row fillWidth horizontal="between" vertical="center">
                    <Text variant="body-default-xs" onBackground="neutral-weak">
                      Progress Kurikulum:{" "}
                      {track.modules.filter((m) => m.status === "completed").length} dari{" "}
                      {track.modules.length} Modul
                    </Text>
                    <Text variant="body-default-xs" weight="strong">
                      {track.progress}%
                    </Text>
                  </Row>
                  <ProgressBar value={track.progress} max={100} label={false} />
                </Column>

                {/* Notion-Style Callout Announcement Box */}
                {track.announcement && (
                  <Row
                    fillWidth
                    padding="16"
                    radius="m"
                    gap="12"
                    vertical="start"
                    background={
                      track.announcement.type === "success"
                        ? "accent-alpha-weak"
                        : "brand-alpha-weak"
                    }
                    border={
                      track.announcement.type === "success"
                        ? "accent-alpha-medium"
                        : "brand-alpha-medium"
                    }
                  >
                    <Icon
                      name={track.announcement.type === "success" ? "trophy" : "sparkles"}
                      size="s"
                      onBackground={
                        track.announcement.type === "success"
                          ? "accent-strong"
                          : "brand-strong"
                      }
                    />
                    <Column gap="4" flex={1}>
                      <Text variant="body-default-s" weight="strong">
                        {track.announcement.title}
                      </Text>
                      <Text variant="body-default-xs" onBackground="neutral-medium">
                        {track.announcement.message}
                      </Text>
                    </Column>
                  </Row>
                )}

                <Line background="neutral-alpha-weak" />

                {/* Notion Database Table View of Modules */}
                <Column fillWidth gap="12">
                  <Row fillWidth horizontal="between" vertical="center" marginBottom="4">
                    <Text variant="heading-strong-xs" onBackground="neutral-weak">
                      DAFTAR MATERI & KELAS PEMBELAJARAN
                    </Text>
                    <Text variant="body-default-xs" onBackground="neutral-weak">
                      {track.modules.length} Modul
                    </Text>
                  </Row>

                  <Column fillWidth gap="8">
                    {track.modules.map((module, modIndex) => {
                      const isCompleted = module.status === "completed";
                      const isInProgress = module.status === "in-progress";
                      const isLocked = module.status === "locked";

                      return (
                        <Row
                          key={`${track.id}-${modIndex}`}
                          fillWidth
                          padding="12"
                          paddingX="16"
                          radius="m"
                          background="surface"
                          border={
                            isInProgress
                              ? "brand-alpha-strong"
                              : isCompleted
                              ? "neutral-alpha-medium"
                              : "neutral-alpha-weak"
                          }
                          vertical="center"
                          horizontal="between"
                          wrap
                          gap="12"
                          style={{
                            transition: "all 0.2s ease",
                            backgroundColor: isInProgress
                              ? "var(--brand-alpha-weak)"
                              : isCompleted
                              ? "var(--surface)"
                              : "var(--neutral-alpha-weak)",
                          }}
                        >
                          <Row vertical="center" gap="12" flex={3} minWidth={240}>
                            {/* Icon Indicator */}
                            {isCompleted ? (
                              <Icon
                                name="checkCircle"
                                size="s"
                                onBackground="accent-strong"
                              />
                            ) : isInProgress ? (
                              <Row
                                padding="4"
                                radius="full"
                                background="brand-strong"
                                style={{ width: 16, height: 16 }}
                              />
                            ) : isLocked ? (
                              <Icon name="lock" size="s" onBackground="neutral-weak" />
                            ) : (
                              <Icon name="clock" size="s" onBackground="neutral-weak" />
                            )}

                            <Column gap="2">
                              <Text
                                variant="body-default-m"
                                weight={isInProgress ? "strong" : "default"}
                                style={{
                                  textDecoration: isCompleted ? "none" : "none",
                                }}
                              >
                                {module.title}
                              </Text>
                              {module.note && (
                                <Text
                                  variant="body-default-xs"
                                  onBackground="neutral-weak"
                                >
                                  {module.note}
                                </Text>
                              )}
                            </Column>
                          </Row>

                          {/* Tags & Status Badges */}
                          <Row vertical="center" gap="8" wrap horizontal="end">
                            {module.tags && module.tags.length > 0 && (
                              <Row gap="4" wrap s={{ hide: true }}>
                                {module.tags.map((tag, tIndex) => (
                                  <Tag key={tIndex} size="s">
                                    {tag}
                                  </Tag>
                                ))}
                              </Row>
                            )}

                            {isCompleted && (
                              <Row
                                padding="4"
                                paddingX="8"
                                radius="full"
                                background="accent-alpha-weak"
                                border="accent-alpha-medium"
                              >
                                <Text
                                  variant="body-default-xs"
                                  onBackground="accent-strong"
                                  weight="strong"
                                >
                                  Selesai 100%
                                </Text>
                              </Row>
                            )}

                            {isInProgress && (
                              <Row
                                padding="4"
                                paddingX="8"
                                radius="full"
                                background="brand-strong"
                              >
                                <Text
                                  variant="body-default-xs"
                                  onBackground="brand-weak"
                                  weight="strong"
                                >
                                  Aktif Berjalan
                                </Text>
                              </Row>
                            )}

                            {isLocked && (
                              <Row
                                padding="4"
                                paddingX="8"
                                radius="full"
                                background="neutral-alpha-weak"
                                border="neutral-alpha-medium"
                              >
                                <Text
                                  variant="body-default-xs"
                                  onBackground="neutral-weak"
                                >
                                  Terkunci (Antrean)
                                </Text>
                              </Row>
                            )}

                            {module.status === "upcoming" && (
                              <Row
                                padding="4"
                                paddingX="8"
                                radius="full"
                                background="neutral-alpha-weak"
                              >
                                <Text
                                  variant="body-default-xs"
                                  onBackground="neutral-weak"
                                >
                                  Belum Dimulai
                                </Text>
                              </Row>
                            )}
                          </Row>
                        </Row>
                      );
                    })}
                  </Column>
                </Column>

                {/* Next Target / Beasiswa Lanjutan Block */}
                {track.nextTarget && (
                  <Column
                    fillWidth
                    padding="16"
                    radius="m"
                    background="neutral-alpha-weak"
                    border="brand-alpha-medium"
                    gap="8"
                  >
                    <Row fillWidth horizontal="between" vertical="center" wrap gap="8">
                      <Row vertical="center" gap="8">
                        <Icon name="trophy" size="xs" onBackground="brand-strong" />
                        <Text variant="body-default-xs" weight="strong" onBackground="brand-strong">
                          TARGET TAHAP SELANJUTNYA
                        </Text>
                      </Row>
                      <Tag size="s">{track.nextTarget.status}</Tag>
                    </Row>
                    <Text variant="body-default-m" weight="strong">
                      {track.nextTarget.title}
                    </Text>
                    <Text variant="body-default-xs" onBackground="neutral-weak">
                      {track.nextTarget.description}
                    </Text>
                  </Column>
                )}
              </Column>
            </Card>
          </RevealFx>
        ))}
      </Column>
    </Column>
  );
}
