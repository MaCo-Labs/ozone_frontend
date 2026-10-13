"use client";

import { useEffect, useRef, useState, type CSSProperties, type MouseEvent } from "react";
import { useMotionValueEvent, useReducedMotion, useScroll } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./Header.module.css";

const MENU_ITEMS = [
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Projects", href: "/projects" },
  { label: "Clients", href: "/clients" },
  { label: "Process", href: "/process" },
  { label: "Quality & Safety", href: "/quality-safety" },
  { label: "Contact", href: "/contact" },
];

const SHORTCUTS = MENU_ITEMS.filter(({ href }) =>
  ["/projects", "/services", "/contact"].includes(href),
);

const FEATURED_PROJECTS = [
  { name: "Qatar Rail", label: "Featured transit", href: "/projects/qatar-rail", image: "/brochure/qatar-rail.jpg" },
  { name: "Maestro Medical Centre", label: "Featured healthcare", href: "/projects/maestro", image: "/brochure/maestro-medical-centre.jpg" },
  { name: "Apparel Group Head Office", label: "Featured workplace", href: "/projects/apparel-group", image: "/brochure/apparel-head-office.jpg" },
  { name: "360 Play - Mall of Qatar", label: "Featured leisure", href: "/projects#360-play---mall-of-qatar", image: "/reference/photo-1555529669-e69e7aa0ba9a.webp" },
  { name: "Tim Hortons", label: "Featured hospitality", href: "/projects#tim-hortons", image: "/reference/photo-1517248135467-4c7edcad34c4.webp" },
] as const;

export function Header() {
  const pathname = usePathname();
  const reducedMotion = useReducedMotion();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [featuredIndex, setFeaturedIndex] = useState(0);
  const { scrollY } = useScroll();
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const closeMenu = (returnFocus = true) => {
    setOpen(false);
    if (returnFocus) window.requestAnimationFrame(() => menuButtonRef.current?.focus());
  };

  const handleLogoClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (pathname !== "/") return;
    event.preventDefault();
    setOpen(false);
    window.history.replaceState(null, "", "/");
    window.scrollTo({ top: 0, behavior: "auto" });
  };

  useMotionValueEvent(scrollY, "change", (latest) => {
    const nextScrolled = latest > 32;
    setScrolled((current) => (current === nextScrolled ? current : nextScrolled));
  });

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = open ? "hidden" : previousOverflow;
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const panel = panelRef.current;
    panel?.querySelector<HTMLAnchorElement>("a[href]")?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeMenu();
        return;
      }
      if (event.key !== "Tab" || !panel) return;

      const header = menuButtonRef.current?.closest("header");
      const focusable = Array.from(header?.querySelectorAll<HTMLElement>("a[href], button:not([disabled])") ?? [])
        .filter((element) => element.getClientRects().length > 0);
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable.at(-1);
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  useEffect(() => {
    if (!open || reducedMotion) return;
    const timer = window.setInterval(() => {
      setFeaturedIndex((current) => (current + 1) % FEATURED_PROJECTS.length);
    }, 6200);
    return () => window.clearInterval(timer);
  }, [open, reducedMotion]);

  const featuredProject = FEATURED_PROJECTS[featuredIndex];

  return (
    <header className={styles.header} data-solid={pathname !== "/" || scrolled || open} data-open={open}>
      <div className={styles.rail}>
        <Link href="/" className={styles.logoLink} aria-label="OZONE home" onClick={handleLogoClick}>
          <Image
            src="/brand/ozone-logo.png"
            alt="OZONE Fitout & Contracting W.L.L."
            width={853}
            height={316}
            sizes="(max-width: 700px) 148px, 180px"
            className={styles.logo}
            preload
          />
        </Link>

        <div className={styles.actions}>
          <nav className={styles.shortcuts} aria-label="Quick navigation">
            {SHORTCUTS.map((item) => (
              <Link key={item.href} href={item.href} aria-current={pathname === item.href ? "page" : undefined}>
                {item.label}
              </Link>
            ))}
          </nav>

          <button
            ref={menuButtonRef}
            type="button"
            className={styles.menuButton}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="primary-navigation"
            onClick={() => (open ? closeMenu(false) : setOpen(true))}
          >
            <span>{open ? "Close" : "Menu"}</span>
            <span className={styles.menuGlyph} aria-hidden="true">
              <i />
              <i />
            </span>
          </button>
        </div>
      </div>

      <div
        ref={panelRef}
        id="primary-navigation"
        className={styles.menuPanel}
        data-open={open}
        role="dialog"
        aria-modal="true"
        aria-label="Primary navigation"
        aria-hidden={!open}
        inert={!open}
      >
        <div className={styles.menuFrame}>
          <div className={styles.menuDirectory}>
            <p>Explore OZONE</p>
            <nav className={styles.menuNav} aria-label="Primary navigation">
              {MENU_ITEMS.map((item, index) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={styles.menuLink}
                  aria-current={pathname === item.href ? "page" : undefined}
                  onClick={() => closeMenu(false)}
                  style={{ "--menu-index": index } as CSSProperties}
                >
                  <span>{item.label}</span>
                  <i aria-hidden="true" />
                </Link>
              ))}
            </nav>
          </div>

          <aside className={styles.menuAside}>
            <Link href={featuredProject.href} className={styles.featuredProject} onClick={() => closeMenu(false)}>
              <span className={styles.featuredImage}>
                <Image
                  key={featuredProject.image}
                  src={featuredProject.image}
                  alt={featuredProject.name}
                  fill
                  sizes="(max-width: 760px) 100vw, 34vw"
                />
              </span>
              <span className={styles.featuredLabel}>{featuredProject.label}</span>
              <strong>{featuredProject.name}</strong>
            </Link>
            <div className={styles.menuMeta}>
              <span>Doha, Qatar</span>
              <a href="mailto:info@ozonefitout.com">info@ozonefitout.com</a>
            </div>
          </aside>
        </div>
      </div>
    </header>
  );
}
