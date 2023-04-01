import { AppProps } from "next/app";
import Head from "next/head";
import { NextUIProvider, createTheme } from "@nextui-org/react";
import { Box } from "../components/Box";
import Navbar from "../components/NavbarComponent";
import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { useState } from "react";
import Footer from "@/components/FooterComponent";
import theme from "../styles/theme";

//Navbar
//Box (container for the content)

function MyApp({ Component, pageProps }: AppProps) {
  const [supabaseClient] = useState(() => createBrowserSupabaseClient());

  return (
    <SessionContextProvider supabaseClient={supabaseClient}>
      <NextUIProvider theme={theme}>
        <Navbar />
        <Box
          css={{
            px: "$12",
            py: "$15",
            mt: "$12",
            "@xsMax": { px: "$10" },
            maxWidth: "800px",
            margin: "0 auto",
            minHeight: "calc(100vh - 60px)",
          }}
        >
          <Component {...pageProps} />
        </Box>
        <Footer />
      </NextUIProvider>
    </SessionContextProvider>
  );
}

export default MyApp;
