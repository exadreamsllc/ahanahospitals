import Link from "next/link";
import Image from "next/image";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { SecondaryLink } from "@/components/ui/SecondaryLink";
import {
  MEMBER_NAV,
  PUBLIC_NAV,
  ROUTES,
  SITE_NAME,
  type NavItem,
} from "@/lib/constants/site";
import styles from "./AppHeader.module.css";

export type AppHeaderProps = {
  /** Drives which navigation set and actions are rendered. */
  isAuthenticated?: boolean;
  /** Overrides the default nav for a given shell. */
  nav?: readonly NavItem[];
};

/**
 * Site header with brand, primary navigation and session actions.
 *
 * Sign-out is a POST form rather than a link: a GET sign-out can be triggered
 * by prefetching or a cross-site image tag.
 */
export function AppHeader({ isAuthenticated = false, nav }: AppHeaderProps) {
  const navItems = nav ?? (isAuthenticated ? MEMBER_NAV : PUBLIC_NAV);

  return (
    <header className={styles.header}>
      <div className={`ahana-container ${styles.inner}`}>
        <Link href={ROUTES.home} className={styles.brand}>
          <Image
            src="/assets/logo.webp"
            alt="Ahana Hospitals"
            width={150}
            height={41}
            className={styles.logo}
            priority
          />
          <span className="ahana-visually-hidden">
            {SITE_NAME} - Mental Health &amp; Rehabilitation
          </span>
        </Link>

        <nav className={styles.nav} aria-label="Primary">
          <ul className={styles.navList}>
            {navItems.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className={styles.navLink}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className={styles.actions}>
            {isAuthenticated ? (
              <form
                action={ROUTES.signOut}
                method="post"
                className={styles.signOutForm}
              >
                <PrimaryButton type="submit" variant="secondary">
                  Sign out
                </PrimaryButton>
              </form>
            ) : (
              <>
                <SecondaryLink href={ROUTES.login}>Log in</SecondaryLink>
                <SecondaryLink href={ROUTES.register} appearance="button">
                  Create account
                </SecondaryLink>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
