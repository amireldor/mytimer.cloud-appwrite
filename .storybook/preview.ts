import type { Preview } from "storybook-solidjs";

import "../src/main.css";

const preview: Preview = {
  decorators: [],
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
};

export default preview;
