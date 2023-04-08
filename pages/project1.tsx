import React, { useState } from "react";
import SearchBar from "../components/SearchBar";
import MatchHistory from "./api/matchhistory";

const Project1: React.FC = () => {
  const [level, setLevel] = useState<number | null>(null);
  const [puuid, setPuuid] = useState<string | null>(null);
  const [matchIds, setMatchIds] = useState<
    { matchId: string; matchDetails: any }[] | null
  >(null);

  const getMatchRegion = (region: string) => {
    switch (region) {
      case "euw1":
        return "europe";
      case "na1":
        return "americas";
      case "eun1":
        return "europe";
      // Add more regions if needed
      default:
        return region;
    }
  };

  const handleSearch = async (summonerName: string, region: string) => {
    try {
      const response = await fetch(
        `/api/api?summonerName=${encodeURIComponent(
          summonerName
        )}&region=${encodeURIComponent(region)}`
      );

      if (response.ok) {
        const data = await response.json();
        setLevel(data.summonerData.summonerLevel);
        setPuuid(data.puuid);
        fetchMatchHistory(data.puuid, region);
      } else {
        console.error("Failed to fetch summoner data:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching summoner data:", error);
    }
  };

  const fetchMatchHistory = async (puuid: string, region: string) => {
    try {
      const matchRegion = getMatchRegion(region);
      const response = await fetch(
        `/api/matchhistory?puuid=${encodeURIComponent(
          puuid
        )}&region=${encodeURIComponent(matchRegion)}`
      );

      if (response.ok) {
        const data = await response.json();
        setMatchIds(data);
      } else {
        console.error("Failed to fetch match history:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching match history:", error);
    }
  };

  return (
    <div>
      <h1>Project1</h1>
      <SearchBar onSearch={handleSearch} />
      {level && <p>Summoner Level: {level}</p>}
      {puuid && <p>PUUID: {puuid}</p>}
      {matchIds && (
        <div>
          <h2>Last 10 Match IDs:</h2>
          <ul>
            {matchIds?.map((match: { matchId: string; matchDetails: any }) => (
              <li key={match.matchId}>{match.matchId}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Project1;
