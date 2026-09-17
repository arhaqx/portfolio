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
    <Column fillWidth gap="24">
      {/* Notion-Style Quick Stats / KPI Metrics */}
      <RevealFx translateY="8" delay={0.1}>
        <Card
          fillWidth
          padding="24"
          s={{ padding: "16" }}
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
                  <Text variant="body-strong-xs">
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
                <Text variant="body-strong-xs">
                  {overallPercentage}%
                </Text>
              </Row>
              <ProgressBar value={overallPercentage} max={100} label={false} />
            </Column>

            <Line background="neutral-alpha-weak" />

            {/* Stats Grid */}
            <Grid columns={4} s={{ columns: 2 }} gap="12" fillWidth>
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
                <Text variant="body-strong-s">
                  30 Sept 2026
                </Text>
              </Column>
            </Grid>
          </Column>
        </Card>
      </RevealFx>

      {/* Filter Navigation Tabs */}
      <RevealFx translateY="8" delay={0.2}>
        <Row fillWidth horizontal="between" vertical="center" wrap gap="12">
          <Row gap="8" wrap fillWidth s={{ gap: "4" }}>
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
        </Row>
      </RevealFx>

      {/* Notion-Style Program Tracks List */}
      <Column fillWidth gap="24">
        {filteredTracks.map((track, trackIndex) => (
          <RevealFx key={track.id} translateY="12" delay={0.25 + trackIndex * 0.1}>
            <Card
              fillWidth
              radius="l"
              border="neutral-medium"
              background="surface"
              padding="24"
              s={{ padding: "16" }}
            >
              <Column fillWidth gap="20">
                {/* Track Header - Responsive Column on Mobile */}
                <Row
                  fillWidth
                  horizontal="between"
                  vertical="start"
                  s={{ direction: "column", gap: "12" }}
                  gap="16"
                >
                  <Column gap="8" fillWidth>
                    <Row vertical="center" gap="8" wrap>
                      <Tag size="s">
                        <Icon name="graduationCap" size="xs" />
                        {track.provider}
                      </Tag>
                      <Tag size="s">{track.level}</Tag>
                    </Row>
                    <Heading as="h3" variant="heading-strong-m" wrap="balance">
                      {track.program}
                    </Heading>
                    <Text variant="body-strong-m" onBackground="brand-strong">
                      {track.trackName}
                    </Text>
                  </Column>

                  {/* Status Badges & Deadline */}
                  <Row
                    horizontal="end"
                    s={{ horizontal: "start", fillWidth: true }}
                    vertical="center"
                    wrap
                    gap="8"
                  >
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
                        <Text variant="body-strong-xs" onBackground="accent-strong">
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
                        <Text variant="body-strong-xs" onBackground="brand-strong">
                          {track.statusLabel}
                        </Text>
                      </Row>
                    )}

                    {track.deadlineLabel && (
                      <Text variant="body-default-xs" onBackground="neutral-weak">
                        {track.deadlineLabel}
                      </Text>
                    )}
                  </Row>
                </Row>

                {/* Progress Bar Component */}
                <Column fillWidth gap="8">
                  <Row fillWidth horizontal="between" vertical="center">
                    <Text variant="body-default-xs" onBackground="neutral-weak">
                      Progress Kurikulum:{" "}
                      {track.modules.filter((m) => m.status === "completed").length} dari{" "}
                      {track.modules.length} Modul
                    </Text>
                    <Text variant="body-strong-xs">
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
                    <Column gap="4" fillWidth>
                      <Text variant="body-strong-s">
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
                        <Column
                          key={`${track.id}-${modIndex}`}
                          fillWidth
                          padding="12"
                          paddingX="16"
                          s={{ paddingX: "12" }}
                          radius="m"
                          background="surface"
                          border={
                            isInProgress
                              ? "brand-alpha-strong"
                              : isCompleted
                              ? "neutral-alpha-medium"
                              : "neutral-alpha-weak"
                          }
                          gap="8"
                          style={{
                            transition: "all 0.2s ease",
                            backgroundColor: isInProgress
                              ? "var(--brand-alpha-weak)"
                              : isCompleted
                              ? "var(--surface)"
                              : "var(--neutral-alpha-weak)",
                          }}
                        >
                          {/* Top: Icon + Title & Note */}
                          <Row fillWidth vertical="start" gap="12">
                            <Row paddingTop="2">
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
                                  style={{ width: 16, height: 16, marginTop: 2 }}
                                />
                              ) : isLocked ? (
                                <Icon name="lock" size="s" onBackground="neutral-weak" />
                              ) : (
                                <Icon name="clock" size="s" onBackground="neutral-weak" />
                              )}
                            </Row>

                            <Column gap="2" fillWidth>
                              <Text
                                variant={isInProgress ? "body-strong-m" : "body-default-m"}
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

                          {/* Bottom: Tags & Status Badges (Responsive Flow) */}
                          <Row
                            fillWidth
                            horizontal="between"
                            vertical="center"
                            wrap
                            gap="8"
                            paddingTop="4"
                          >
                            {module.tags && module.tags.length > 0 ? (
                              <Row gap="4" wrap>
                                {module.tags.map((tag, tIndex) => (
                                  <Tag key={tIndex} size="s">
                                    {tag}
                                  </Tag>
                                ))}
                              </Row>
                            ) : (
                              <Row />
                            )}

                            {/* Status Badges */}
                            {isCompleted && (
                              <Row
                                padding="4"
                                paddingX="8"
                                radius="full"
                                background="accent-alpha-weak"
                                border="accent-alpha-medium"
                              >
                                <Text
                                  variant="body-strong-xs"
                                  onBackground="accent-strong"
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
                                  variant="body-strong-xs"
                                  onBackground="brand-weak"
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
                        </Column>
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
                        <Text variant="body-strong-xs" onBackground="brand-strong">
                          TARGET TAHAP SELANJUTNYA
                        </Text>
                      </Row>
                      <Tag size="s">{track.nextTarget.status}</Tag>
                    </Row>
                    <Text variant="body-strong-m">
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
