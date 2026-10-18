import { Tabs } from "@mantine/core";

import { DEFAULT_RADIUS } from "../tokens";

// @ts-ignore
import classes from "./tabs.module.scss";

export const TabsComponent = Tabs.extend({
  defaultProps: {
    radius: DEFAULT_RADIUS,
  },
  classNames: {
    tab: classes.tab,
    // root: classes.root,
  },
});
