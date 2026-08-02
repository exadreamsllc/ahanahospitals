"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useTransition } from "react";
import type { Resource } from "@/lib/content/resources";
import styles from "./ResourceCard.module.css";

export type ResourceCardProps = {
  resource: Resource;
  isSaved?: boolean;
  onToggleSave?: (resourceId: string, currentSaved: boolean) => Promise<void>;
  showSaveButton?: boolean;
};

/**
 * Knowledge Centre card. Decoupled for a11y compatibility (nested interactivity prevented).
 */
export function ResourceCard({
  resource,
  isSaved = false,
  onToggleSave,
  showSaveButton = false,
}: ResourceCardProps) {
  const isAvailable = resource.status === "available" && resource.href;
  const [isPending, startTransition] = useTransition();
  const [optimisticSaved, setOptimisticSaved] = useState(isSaved);

  const handleSaveToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!onToggleSave) return;
    
    const nextSaved = !optimisticSaved;
    setOptimisticSaved(nextSaved);
    
    startTransition(async () => {
      try {
        await onToggleSave(resource.id, optimisticSaved);
      } catch {
        // Revert on error
        setOptimisticSaved(optimisticSaved);
      }
    });
  };

  const imageElement = resource.image ? (
    <Image
      src={resource.image}
      alt=""
      width={1351}
      height={1800}
      className={styles.image}
    />
  ) : null;

  const mediaContent = (
    <div className={resource.image ? styles.media : styles.mediaFallback}>
      {resource.image ? (
        imageElement
      ) : (
        <span className={styles.fallbackLabel}>{resource.category}</span>
      )}
    </div>
  );

  const cardContent = (
    <div className={styles.content}>
      <div className={styles.meta}>
        <span className={styles.category}>{resource.category}</span>
        {resource.meta ? (
          <span className={styles.metaLabel}>{resource.meta}</span>
        ) : null}
      </div>

      <h3 className={styles.title}>
        {isAvailable ? (
          resource.download ? (
            <a
              href={resource.href}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.titleLink}
            >
              {resource.title}
            </a>
          ) : (
            <Link href={resource.href!} className={styles.titleLink}>
              {resource.title}
            </Link>
          )
        ) : (
          resource.title
        )}
      </h3>
      
      <p className={styles.description}>{resource.description}</p>

      <div className={styles.cardFooter}>
        <span className={styles.action}>
          {isAvailable ? (
            resource.download ? (
              <a
                href={resource.href}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.actionLink}
              >
                Download PDF <span aria-hidden="true">→</span>
              </a>
            ) : (
              <Link href={resource.href!} className={styles.actionLink}>
                Read story <span aria-hidden="true">→</span>
              </Link>
            )
          ) : (
            <span className={styles.comingSoon}>Coming soon</span>
          )}
        </span>

        {isAvailable && showSaveButton && onToggleSave && (
          <button
            onClick={handleSaveToggle}
            className={`${styles.saveButton} ${
              optimisticSaved ? styles.saveButtonActive : ""
            }`}
            aria-label={optimisticSaved ? `Unsave ${resource.title}` : `Save ${resource.title}`}
            disabled={isPending}
          >
            {optimisticSaved ? (
              <>
                <svg className={styles.saveIcon} viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z"/>
                </svg>
                Saved
              </>
            ) : (
              <>
                <svg className={styles.saveIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
                </svg>
                Save
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );

  return (
    <li className={`${styles.card} ${!isAvailable ? styles.cardMuted : ""}`}>
      <div className={styles.inner}>
        {isAvailable ? (
          resource.download ? (
            <a
              href={resource.href}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.mediaLink}
            >
              {mediaContent}
            </a>
          ) : (
            <Link href={resource.href!} className={styles.mediaLink}>
              {mediaContent}
            </Link>
          )
        ) : (
          mediaContent
        )}
        {cardContent}
      </div>
    </li>
  );
}
