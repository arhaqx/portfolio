"use client";

import { useState } from "react";
import {
  Badge,
  Card,
  Column,
  Grid,
  Heading,
  Icon,
  Line,
  ProgressBar,
  Row,
  Tag,
  Text,
  ToggleButton,
} from "@once-ui-system/core";
import { learning } from "@/resources";

type FilterType = "all" | "in-progress" | "completed";

export default function LearningTracker() {
  const [filter, setFilter] = useState<FilterType>("all");
  // Manage accordion dropdown state: trackId -> boolean (default: collapsed)
  const [expandedTracks, setExpandedTracks] = useState<Record<string, boolean>>({});

  const tracks = learning.tracks;

  const filteredTracks = tracks.filter((track) => {
    if (filter === "all") return true;
    return track.status === filter;
  });

  const toggleTrack = (trackId: string) => {
    setExpandedTracks((prev) => ({
      ...prev,
      [trackId]: !prev[trackId],
    }));
  };

  const areAllExpanded =
    filteredTracks.length > 0 && filteredTracks.every((t) => !!expandedTracks[t.id]);

  const toggleAllTracks = () => {
    if (areAllExpanded) {
      setExpandedTracks({});
    } else {
      const allOpen: Record<string, boolean> = {};
      filteredTracks.forEach((t) => {
        allOpen[t.id] = true;
      });
      setExpandedTracks(allOpen);
    }
  };

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
      {/* Quick Stats / KPI Metrics */}
      <Card
        data-reveal
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
                background="neutral-alpha-weak"
                border="neutral-alpha-medium"
                vertical="center"
                horizontal="center"
              >
                <Icon name="graduationCap" onBackground="neutral-strong" size="m" />
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
                <Icon name="checkCircle" size="xs" onBackground="neutral-strong" />
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
              <Text variant="body-strong-xs">{overallPercentage}%</Text>
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
              background="neutral-alpha-weak"
              border="neutral-alpha-medium"
              gap="4"
            >
              <Text variant="body-default-xs" onBackground="neutral-weak">
                Modul Tuntas (100%)
              </Text>
              <Text variant="heading-strong-m" onBackground="neutral-strong">
                {completedModules} Kelas
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
                Sedang Berjalan
              </Text>
              <Text variant="heading-strong-m" onBackground="neutral-strong">
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
                Pencapaian Terbaru
              </Text>
              <Text variant="body-strong-s">IBM Certified (Okt 2026)</Text>
            </Column>
          </Grid>
        </Column>
      </Card>

      {/* Filter Navigation Tabs */}
      <Row data-reveal fillWidth horizontal="between" vertical="center" wrap gap="12">
        <Row gap="8" wrap s={{ gap: "4" }}>
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

        <button
          type="button"
          onClick={toggleAllTracks}
          style={{
            background: "transparent",
            border: "1px solid var(--neutral-alpha-medium)",
            borderRadius: "999px",
            padding: "0.4rem 0.85rem",
            color: "var(--neutral-on-background-weak)",
            cursor: "pointer",
            fontSize: "0.75rem",
            fontWeight: 500,
            display: "inline-flex",
            alignItems: "center",
            gap: "0.4rem",
            transition: "all 0.2s ease",
          }}
        >
          <Icon name={areAllExpanded ? "chevronUp" : "chevronDown"} size="xs" />
          <span>{areAllExpanded ? "Tutup Semua Materi" : "Buka Semua Materi"}</span>
        </button>
      </Row>

      {/* Program Tracks List */}
      <Column fillWidth gap="24" data-stagger>
        {filteredTracks.map((track) => {
          const isExpanded = !!expandedTracks[track.id];
          const completedCount = track.modules.filter((m) => m.status === "completed").length;

          return (
            <Card
              key={track.id}
            fillWidth
            radius="l"
            border="neutral-medium"
            background="surface"
            padding="24"
            s={{ padding: "16" }}
          >
            <Column fillWidth gap="20">
              {/* Track Header */}
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
                    {track.link && (
                      <a
                        href={track.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "4px",
                          fontSize: "0.75rem",
                          color: "var(--brand-strong)",
                          textDecoration: "underline",
                          fontWeight: 500,
                        }}
                      >
                        Verifikasi Kredensial ↗
                      </a>
                    )}
                  </Row>
                  <Heading as="h3" variant="heading-strong-m" wrap="balance">
                    {track.program}
                  </Heading>
                  <Text variant="body-strong-m" onBackground="neutral-strong">
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
                      background="neutral-alpha-weak"
                      border="neutral-alpha-strong"
                      vertical="center"
                      gap="4"
                    >
                      <Icon name="checkCircle" size="xs" onBackground="neutral-strong" />
                      <Text variant="body-strong-xs" onBackground="neutral-strong">
                        {track.statusLabel}
                      </Text>
                    </Row>
                  ) : (
                    <Row
                      padding="4"
                      paddingX="12"
                      radius="full"
                      background="neutral-alpha-weak"
                      border="neutral-alpha-medium"
                      vertical="center"
                      gap="4"
                    >
                      <Icon name="clock" size="xs" onBackground="neutral-weak" />
                      <Text variant="body-strong-xs" onBackground="neutral-weak">
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
                  <Text variant="body-strong-xs">{track.progress}%</Text>
                </Row>
                <ProgressBar value={track.progress} max={100} label={false} />
              </Column>

              {/* Callout Announcement Box */}
              {track.announcement && (
                <Row
                  fillWidth
                  padding="16"
                  radius="m"
                  gap="12"
                  vertical="start"
                  background="neutral-alpha-weak"
                  border="neutral-alpha-medium"
                >
                  <Icon
                    name={track.announcement.type === "success" ? "trophy" : "rocket"}
                    size="s"
                    onBackground="neutral-strong"
                  />
                  <Column gap="4" fillWidth>
                    <Text variant="body-strong-s">{track.announcement.title}</Text>
                    <Text variant="body-default-xs" onBackground="neutral-weak">
                      {track.announcement.message}
                    </Text>
                  </Column>
                </Row>
              )}

              <Line background="neutral-alpha-weak" />

              {/* Modules Dropdown Trigger */}
              <Column fillWidth gap="12">
                <Row
                  fillWidth
                  horizontal="between"
                  vertical="center"
                  wrap
                  gap="12"
                  paddingY="12"
                  paddingX="16"
                  s={{ paddingX: "12", paddingY: "10" }}
                  radius="m"
                  background="neutral-alpha-weak"
                  border="neutral-alpha-medium"
                  role="button"
                  tabIndex={0}
                  aria-expanded={isExpanded}
                  onClick={() => toggleTrack(track.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      toggleTrack(track.id);
                    }
                  }}
                  style={{
                    cursor: "pointer",
                    userSelect: "none",
                    transition: "all 0.2s ease",
                  }}
                >
                  <Row vertical="center" gap="12" style={{ flex: 1, minWidth: "14rem" }}>
                    <Row
                      padding="4"
                      radius="full"
                      background={isExpanded ? "brand-alpha-medium" : "neutral-alpha-medium"}
                      vertical="center"
                      horizontal="center"
                      style={{
                        transition: "transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)",
                        transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
                        flexShrink: 0,
                      }}
                    >
                      <Icon
                        name="chevronDown"
                        size="xs"
                        onBackground={isExpanded ? "neutral-strong" : "neutral-weak"}
                      />
                    </Row>
                    <Column gap="2" style={{ minWidth: 0 }}>
                      <Text variant="heading-strong-xs" onBackground="neutral-strong">
                        DAFTAR MATERI & KELAS PEMBELAJARAN
                      </Text>
                      <Text variant="body-default-xs" onBackground="neutral-weak">
                        {isExpanded
                          ? "Klik untuk menutup rincian modul"
                          : "Klik untuk membuka rincian kurikulum & modul"}
                      </Text>
                    </Column>
                  </Row>

                  <Row vertical="center" gap="8">
                    <Row
                      paddingY="2"
                      paddingX="8"
                      radius="full"
                      background="neutral-alpha-weak"
                      border="neutral-alpha-medium"
                      vertical="center"
                    >
                      <Text
                        variant="body-default-xs"
                        weight="strong"
                        onBackground="neutral-strong"
                      >
                        {completedCount}/{track.modules.length} Selesai
                      </Text>
                    </Row>
                    <Text
                      variant="body-strong-xs"
                      onBackground="neutral-strong"
                      style={{ minWidth: "2.75rem", textAlign: "right" }}
                    >
                      {isExpanded ? "Tutup ↑" : "Buka ↓"}
                    </Text>
                  </Row>
                </Row>

                {/* Collapsible Modules List */}
                {isExpanded && (
                  <Column fillWidth gap="8" paddingTop="4">
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
                        background={
                          isInProgress
                            ? "brand-alpha-weak"
                            : isCompleted
                            ? "surface"
                            : "neutral-alpha-weak"
                        }
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
                        }}
                      >
                        {/* Top: Icon + Title & Note */}
                        <Row fillWidth vertical="start" gap="12">
                          <Row paddingTop="2">
                            {isCompleted ? (
                              <Icon
                                name="checkCircle"
                                size="s"
                                onBackground="neutral-strong"
                              />
                            ) : isInProgress ? (
                              <Row
                                padding="4"
                                radius="full"
                                background="neutral-strong"
                                style={{ width: 14, height: 14, marginTop: 3 }}
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

                        {/* Bottom: Tags & Status Badges */}
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
                              background="neutral-alpha-weak"
                              border="neutral-alpha-medium"
                            >
                              <Text
                                variant="body-strong-xs"
                                onBackground="neutral-strong"
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
                              background="neutral-alpha-weak"
                              border="neutral-alpha-strong"
                            >
                              <Text
                                variant="body-strong-xs"
                                onBackground="neutral-strong"
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
              )}
            </Column>

              {/* Next Target Block */}
              {track.nextTarget && (
                <Column
                  fillWidth
                  padding="16"
                  radius="m"
                  background="neutral-alpha-weak"
                  border="neutral-alpha-medium"
                  gap="12"
                >
                  <Row
                    fillWidth
                    horizontal="between"
                    vertical="center"
                    wrap
                    gap="8"
                    s={{ direction: "column", horizontal: "start", gap: "8" }}
                  >
                    <Row vertical="center" gap="8">
                      <Icon name="trophy" size="xs" onBackground="neutral-strong" />
                      <Text variant="body-strong-xs" onBackground="neutral-strong">
                        TARGET TAHAP SELANJUTNYA
                      </Text>
                    </Row>
                    <Tag size="s">{track.nextTarget.status}</Tag>
                  </Row>
                  <Text variant="body-strong-m" wrap="balance">
                    {track.nextTarget.title}
                  </Text>
                  <Text variant="body-default-xs" onBackground="neutral-weak">
                    {track.nextTarget.description}
                  </Text>
                </Column>
              )}
            </Column>
          </Card>
        );
      })}
      </Column>
    </Column>
  );
}
