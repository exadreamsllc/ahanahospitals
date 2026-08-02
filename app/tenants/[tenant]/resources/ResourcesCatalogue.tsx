"use client";

import { useState } from "react";
import { RESOURCES } from "@/lib/content/resources";
import { ResourceCard } from "@/components/marketing/ResourceCard";
import styles from "./resources.module.css";

type ResourcesCatalogueProps = {
  isAuthenticated: boolean;
  savedResourceIds: string[];
  onToggleSave?: (resourceId: string, currentSaved: boolean) => Promise<void>;
};

// Extract unique categories from RESOURCES catalog
const CATEGORIES = ["All", ...Array.from(new Set(RESOURCES.map((r) => r.category)))];

export function ResourcesCatalogue({
  isAuthenticated,
  savedResourceIds,
  onToggleSave,
}: ResourcesCatalogueProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Filter resources based on search query and category tab
  const filteredResources = RESOURCES.filter((resource) => {
    const matchesCategory =
      selectedCategory === "All" || resource.category === selectedCategory;

    const query = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !query ||
      resource.title.toLowerCase().includes(query) ||
      resource.description.toLowerCase().includes(query) ||
      resource.category.toLowerCase().includes(query);

    return matchesCategory && matchesSearch;
  });

  const available = filteredResources.filter((r) => r.status === "available");
  const upcoming = filteredResources.filter((r) => r.status === "coming-soon");

  const hasResults = filteredResources.length > 0;

  return (
    <div className={styles.stack}>
      {/* Search and Category Filter Section */}
      <div className={styles.controls}>
        <div className={styles.searchContainer}>
          <svg
            className={styles.searchIcon}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="search"
            placeholder="Search brochures, guides and stories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
            aria-label="Search resources"
          />
        </div>

        <nav aria-label="Categories" className={styles.categories}>
          <ul className={`ahana-list-reset ${styles.categoriesList}`}>
            {CATEGORIES.map((category) => (
              <li key={category}>
                <button
                  type="button"
                  onClick={() => setSelectedCategory(category)}
                  className={`${styles.categoryButton} ${
                    selectedCategory === category ? styles.categoryButtonActive : ""
                  }`}
                  aria-current={selectedCategory === category ? "page" : undefined}
                >
                  {category}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Results Rendering */}
      {!hasResults ? (
        <div className={styles.emptyState} role="status">
          <h3 className={styles.emptyTitle}>No matching resources</h3>
          <p className={styles.emptyText}>
            We couldn&apos;t find anything matching your search filters. Try refining your keywords or choosing another category.
          </p>
        </div>
      ) : (
        <>
          {available.length > 0 && (
            <section aria-labelledby="available-heading">
              <h2 id="available-heading" className={styles.groupTitle}>
                Available now
              </h2>
              <ul className={`ahana-list-reset ${styles.grid}`}>
                {available.map((resource) => (
                  <ResourceCard
                    key={resource.id}
                    resource={resource}
                    showSaveButton={isAuthenticated}
                    isSaved={savedResourceIds.includes(resource.id)}
                    onToggleSave={onToggleSave}
                  />
                ))}
              </ul>
            </section>
          )}

          {upcoming.length > 0 && (
            <section aria-labelledby="upcoming-heading">
              <h2 id="upcoming-heading" className={styles.groupTitle}>
                In preparation
              </h2>
              <p className={styles.groupNote}>
                Each of these categories will fill up as material is reviewed and published.
              </p>
              <ul className={`ahana-list-reset ${styles.grid}`}>
                {upcoming.map((resource) => (
                  <ResourceCard
                    key={resource.id}
                    resource={resource}
                    showSaveButton={false}
                    isSaved={false}
                  />
                ))}
              </ul>
            </section>
          )}
        </>
      )}
    </div>
  );
}
