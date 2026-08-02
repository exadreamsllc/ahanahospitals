"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { TeamMember } from "@/lib/content/team";
import styles from "./TeamScroller.module.css";

export type TeamScrollerProps = {
  members: readonly TeamMember[];
};

/**
 * Horizontally scrolling team grid: three rows, scrolling sideways by column.
 *
 * The scroll container is focusable and scrollable with the keyboard. The
 * arrow buttons are a convenience on top of that, and are hidden from
 * assistive technology users only when they cannot scroll further.
 *
 * Selecting a person opens a native `<dialog>`, which gives focus trapping,
 * Escape-to-close and backdrop rendering from the platform.
 */
export function TeamScroller({ members }: TeamScrollerProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [selected, setSelected] = useState<TeamMember | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateArrows = useCallback(() => {
    const element = scrollRef.current;
    if (!element) return;
    const maxScroll = element.scrollWidth - element.clientWidth;
    setCanScrollLeft(element.scrollLeft > 8);
    setCanScrollRight(element.scrollLeft < maxScroll - 8);
  }, []);

  useEffect(() => {
    updateArrows();
    window.addEventListener("resize", updateArrows);
    return () => window.removeEventListener("resize", updateArrows);
  }, [updateArrows]);

  function scrollBy(direction: -1 | 1) {
    const element = scrollRef.current;
    if (!element) return;
    element.scrollBy({
      left: direction * Math.max(element.clientWidth * 0.8, 200),
      behavior: "smooth",
    });
  }

  function openMember(member: TeamMember) {
    setSelected(member);
    dialogRef.current?.showModal();
  }

  function closeDialog() {
    dialogRef.current?.close();
  }

  return (
    <>
      <div className={styles.toolbar}>
        <p className={styles.hint}>
          Swipe or scroll sideways to meet more of the team.
        </p>
        <div className={styles.arrows}>
          <button
            type="button"
            className={styles.arrow}
            onClick={() => scrollBy(-1)}
            disabled={!canScrollLeft}
            aria-label="Scroll team left"
          >
            <span aria-hidden="true">←</span>
          </button>
          <button
            type="button"
            className={styles.arrow}
            onClick={() => scrollBy(1)}
            disabled={!canScrollRight}
            aria-label="Scroll team right"
          >
            <span aria-hidden="true">→</span>
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        onScroll={updateArrows}
        className={styles.scroller}
        tabIndex={0}
        role="group"
        aria-label="Ahana care team, scroll sideways for more"
      >
        {members.map((member) => (
          <button
            key={member.name}
            type="button"
            className={styles.person}
            onClick={() => openMember(member)}
          >
            <Image
              src={member.image}
              alt=""
              width={360}
              height={361}
              className={styles.portrait}
            />
            <span className={styles.name}>{member.name}</span>
            <span className={styles.role}>{member.role}</span>
          </button>
        ))}
      </div>

      <dialog
        ref={dialogRef}
        className={styles.dialog}
        onClose={() => setSelected(null)}
        aria-labelledby="team-member-name"
      >
        {selected ? (
          <div className={styles.dialogBody}>
            <button
              type="button"
              className={styles.close}
              onClick={closeDialog}
              aria-label="Close"
            >
              <span aria-hidden="true">×</span>
            </button>

            <Image
              src={selected.image}
              alt=""
              width={360}
              height={361}
              className={styles.dialogPortrait}
            />

            <h2 id="team-member-name" className={styles.dialogName}>
              {selected.name}
            </h2>
            <p className={styles.dialogRole}>{selected.role}</p>
            <p className={styles.dialogStory}>{selected.story}</p>
          </div>
        ) : null}
      </dialog>
    </>
  );
}
