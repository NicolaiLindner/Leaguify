import { Text } from "@nextui-org/react";
import { Box } from "./Box";

const Footer = () => {
  return (
    <Box
      as="footer"
      css={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "60px",
        backgroundColor: "#f7f7f7",
        borderTop: "1px solid #eaeaea",
        bottom: 0,
        width: "100%",
      }}
    >
      <Text size="small">© 2023 Leaguify. All rights reserved.</Text>
    </Box>
  );
};

export default Footer;
