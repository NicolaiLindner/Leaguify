import React, { useState } from "react";
import MatchHistoryComponent, {
  MatchHistoryComponentProps,
} from "../components/historyComponent";
import SearchBar from "@/components/SearchBar";

function Project2() {
  const [summonerName, setSummonerName] = useState("exampleSummoner");
  const [region, setRegion] = useState("euw1");

  const handleSearch = (newSummonerName: string, newRegion: string) => {
    setSummonerName(newSummonerName);
    setRegion(newRegion);
  };

  return (
    <div>
      <SearchBar onSearch={handleSearch} />
      <MatchHistoryComponent summonerName={summonerName} region={region} />
    </div>
  );
}

export default Project2;
