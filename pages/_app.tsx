import { AppProps } from "next/app";
import Head from "next/head";
import { NextUIProvider, createTheme } from "@nextui-org/react";
import Navbar from "../components/NavbarComponent";
import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { useState } from "react";
import theme from "../styles/theme";

//Navbar
//Box (container for the content)

function MyApp({ Component, pageProps }: AppProps) {
  const [supabaseClient] = useState(() => createBrowserSupabaseClient());

  return (
    <SessionContextProvider supabaseClient={supabaseClient}>
      <NextUIProvider theme={theme}>
        <Navbar />
          <Component {...pageProps} />
      </NextUIProvider>
    </SessionContextProvider>
  );
}

export default MyApp;
