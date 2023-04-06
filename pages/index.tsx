import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import { Text, Spacer } from "@nextui-org/react";

export default function Home() {
  return (
    <>
      <Text h2> The Future of League of Legends Analysis</Text>
      <Spacer y={1} />
      <Text size="$lg">
        Get summoner specific informations through machine learning and deep
        learning.
      </Text>
    </>
  );
}
