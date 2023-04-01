import { createTheme, NextUIProvider, Text } from "@nextui-org/react";

// 2. Call `createTheme` and pass your custom values
const theme = createTheme({
  type: "dark",
  theme: {
    colors: {
      // brand colors
      background: "#151517",
      text: "#fff",
      // you can also create your own color
      myDarkColor: "#151517",
      // ...  more colors
    },
    space: {},
    fonts: {},
  },
});

export default theme;
