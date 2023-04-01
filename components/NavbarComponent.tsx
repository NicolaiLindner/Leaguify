import { Navbar, Button, Text } from "@nextui-org/react";
import Link from "next/link";
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";

const NavbarComponent = () => {
  const supabaseClient = useSupabaseClient();
  const user = useUser();
  const router = useRouter();

  function signOutUser() {
    supabaseClient.auth.signOut();
    router.push("/"); //localhost:3000
  }

  return (
    <Navbar isBordered isCompact>
      <Navbar.Brand as={Link} href="/">
        Leaguify
      </Navbar.Brand>
      <Navbar.Content hideIn="xs" variant="highlight-rounded">
        <Navbar.Link href="/project1"> Project 1 </Navbar.Link>
        <Navbar.Link href="/project2"> Project 2 </Navbar.Link>
        <Navbar.Link href="/chat-analysis"> Project 3 </Navbar.Link>
      </Navbar.Content>

      <Navbar.Content>
        {!user ? (
          <>
            <Navbar.Link href="/login">
              <Button auto flat>
                Login
              </Button>
            </Navbar.Link>
          </>
        ) : (
          <>
            <Navbar.Item>
              <Text>Hey, {user?.email}</Text>
            </Navbar.Item>
            <Navbar.Item>
              <Button auto flat onPress={() => signOutUser()}>
                Sign Out
              </Button>
            </Navbar.Item>
          </>
        )}
      </Navbar.Content>
    </Navbar>
  );
};

export default NavbarComponent;
