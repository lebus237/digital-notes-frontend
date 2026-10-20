import {
  ActionIcon,
  Affix,
  Button,
  Tooltip,
  Tabs,
  type ButtonProps,
  Group,
} from "@mantine/core";
import { IconArrowLeft, IconX } from "@tabler/icons-react";
import { useCanGoBack, useRouter } from "@tanstack/react-router";
import {
  Children,
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useShell, type ShellCrumb } from "../../app-shell/model/shell-context";
import styles from "./page-container.module.scss";

type PagePanel = {
  opened: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
};

export type PageTab = {
  value: string;
  label: ReactNode;
  leftSection?: ReactNode;
  rightSection?: ReactNode;
  disabled?: boolean;
};

export type PageAction = {
  key: string;
  label: string;
  icon?: ReactNode;
  onClick: () => void;
  variant?: ButtonProps["variant"];
  color?: ButtonProps["color"];
  size?: ButtonProps["size"];
  disabled?: boolean;
  loading?: boolean;
  tabValue?: string;
};

function actionLabelAbbreviation(label: string) {
  const initials = label
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("");
  return initials.toUpperCase() || "?";
}

type PageContainerProps = {
  breadcrumbs: ShellCrumb[];
  title?: ReactNode;
  description?: ReactNode;
  actions?: PageAction[];
  panel?: PagePanel;
  children?: ReactNode;
  tabs?: PageTab[];
  tabValue?: string | null;
  defaultTabValue?: string;
  onTabChange?: (value: string | null) => void;
  keepMounted?: boolean;
};

export function PageContainer({
  breadcrumbs,
  title,
  description,
  actions,
  panel,
  children,
  tabs,
  tabValue,
  defaultTabValue,
  onTabChange,
  keepMounted = true,
}: Readonly<PageContainerProps>) {
  const { setBreadcrumbs } = useShell();
  const router = useRouter();
  const canGoBack = useCanGoBack();
  const panelOpen = Boolean(panel?.opened);
  const hasTabs = Boolean(tabs && tabs.length > 0);
  const childArray = Children.toArray(children);
  const tabPanels = hasTabs ? childArray.slice(0, tabs?.length) : [];
  const otherChildren = hasTabs ? childArray.slice(tabs?.length) : childArray;
  const [internalTab, setInternalTab] = useState<string | null>(
    defaultTabValue ?? tabs?.[0]?.value ?? null,
  );
  const activeTab = tabValue !== undefined ? tabValue : internalTab;
  const tabsScrollRef = useRef<HTMLDivElement | null>(null);

  const syncTabsScrollShadow = useCallback(() => {
    const host = tabsScrollRef.current;
    const scroller = host?.firstElementChild as HTMLElement | null | undefined;
    if (!host || !scroller) return;
    host.toggleAttribute("data-can-scroll-left", scroller.scrollLeft > 1);
    host.toggleAttribute(
      "data-can-scroll-right",
      scroller.scrollLeft + scroller.clientWidth < scroller.scrollWidth - 1,
    );
  }, []);

  const scrollActiveTabIntoView = useCallback(() => {
    const host = tabsScrollRef.current;
    const scroller = host?.firstElementChild as HTMLElement | null | undefined;
    if (!host || !scroller || scroller.scrollWidth <= scroller.clientWidth + 1)
      return;
    scroller
      .querySelector<HTMLElement>('[role="tab"][aria-selected="true"]')
      ?.scrollIntoView({ block: "nearest", inline: "nearest" });
  }, []);

  useEffect(() => {
    if (!hasTabs) return;
    syncTabsScrollShadow();
    scrollActiveTabIntoView();
    const scroller = tabsScrollRef.current?.firstElementChild as
      HTMLElement | null | undefined;
    if (!scroller) return;
    const observer = new ResizeObserver(syncTabsScrollShadow);
    observer.observe(scroller);
    const tablist = scroller.firstElementChild;
    if (tablist) observer.observe(tablist);
    return () => observer.disconnect();
  }, [hasTabs, activeTab, syncTabsScrollShadow, scrollActiveTabIntoView]);

  function handleTabChange(value: string | null) {
    if (tabValue === undefined) {
      setInternalTab(value);
    }
    onTabChange?.(value);
  }

  function resolveVariant(action: PageAction): ButtonProps["variant"] {
    if (action.variant) {
      return action.variant;
    }
    if (action.tabValue !== undefined && hasTabs) {
      return action.tabValue === activeTab ? "filled" : "light";
    }
    return undefined;
  }

  useEffect(() => {
    setBreadcrumbs(breadcrumbs);
    return () => setBreadcrumbs([]);
  }, [breadcrumbs, setBreadcrumbs]);

  return (
    <div className={styles.frame}>
      <div
        className={`${styles.content} ${panelOpen ? styles.contentShifted : ""}`}
      >
        <header className={styles.actionBar}>
          <Group gap="xs">
            {canGoBack && (
              <ActionIcon
                className={styles.backAction}
                variant="default"
                size="lg"
                onClick={() => router.history.back()}
                aria-label="Go back"
              >
                <IconArrowLeft size={20} />
              </ActionIcon>
            )}
            {(title ?? description) && (
              <div className={styles.titleGroup}>
                <div className={styles.titleText}>
                  {title && <h1 className={styles.pageTitle}>{title}</h1>}
                  {description && (
                    <p className={styles.pageDescription}>{description}</p>
                  )}
                </div>
              </div>
            )}
          </Group>
          <div className={styles.actions}>
            {actions && actions.length > 0 && (
              <div className={styles.desktopActions}>
                {actions.map((action) => (
                  <Button
                    key={action.key}
                    size={action.size}
                    variant={resolveVariant(action)}
                    color={action.color}
                    leftSection={action.icon}
                    disabled={action.disabled}
                    loading={action.loading}
                    onClick={action.onClick}
                  >
                    {action.label}
                  </Button>
                ))}
              </div>
            )}
          </div>
        </header>
        <div className={styles.body}>
          {hasTabs && (
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              keepMounted={keepMounted}
            >
              <div className={styles.tabsScroll} ref={tabsScrollRef}>
                <div
                  className={styles.tabsScroller}
                  onScroll={syncTabsScrollShadow}
                >
                  <Tabs.List>
                    {tabs?.map((tab) => (
                      <Tabs.Tab
                        key={tab.value}
                        value={tab.value}
                        leftSection={tab.leftSection}
                        rightSection={tab.rightSection}
                        disabled={tab.disabled}
                      >
                        {tab.label}
                      </Tabs.Tab>
                    ))}
                  </Tabs.List>
                </div>
              </div>
              {tabs?.map((tab, index) => (
                <Tabs.Panel
                  key={tab.value}
                  value={tab.value}
                  pt="md"
                  bg="transparent"
                >
                  {tabPanels[index]}
                </Tabs.Panel>
              ))}
            </Tabs>
          )}
          {otherChildren}
        </div>
      </div>
      {actions && actions.length > 0 && (
        <Affix position={{ bottom: "1rem", right: "1rem" }}>
          <div className={styles.fabStack}>
            {actions.map((action) => (
              <Tooltip key={action.key} label={action.label} position="left">
                <ActionIcon
                  size="xl"
                  radius="md"
                  variant="filled"
                  color={action.color}
                  disabled={action.disabled}
                  loading={action.loading}
                  onClick={action.onClick}
                  aria-label={action.label}
                >
                  {action.icon ?? (
                    <span className={styles.fabFallback}>
                      {actionLabelAbbreviation(action.label)}
                    </span>
                  )}
                </ActionIcon>
              </Tooltip>
            ))}
          </div>
        </Affix>
      )}
      <aside
        className={`${styles.panel} ${panelOpen ? styles.panelOpen : ""}`}
        aria-hidden={!panelOpen}
        {...(!panelOpen ? { inert: true } : {})}
      >
        <header className={styles.panelHeader}>
          <h1 className={styles.panelTitle}>{panel?.title ?? "Panel"}</h1>
          <button
            type="button"
            className={styles.closeButton}
            onClick={panel?.onClose}
            aria-label="Close panel"
          >
            <IconX size={16} />
          </button>
        </header>
        <div className={styles.panelBody}>{panel?.children}</div>
      </aside>
    </div>
  );
}
