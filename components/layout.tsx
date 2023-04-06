import React from "react";
import NavbarComponent from "./NavbarComponent";
import SearchBar from "./SearchBar";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <>
      <NavbarComponent />
      <SearchBar
        onSearch={(summonerName, region) => console.log(summonerName, region)}
      />
      {children}
    </>
  );
};

export default Layout;
