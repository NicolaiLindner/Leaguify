import Project1 from "../components/MatchHistoryComponent";
import { useState, useEffect } from "react";
import SearchBar from "../components/SearchBar";
import { SummonerData, RankedData } from "./api/api";
import {
  Match,
  ParticipantDto,
  PerksDto,
  PerkStatsDto,
  PerkStyleDto,
  PerkStyleSelectionDto,
  TeamDto,
  BanDto,
  ObjectivesDto,
  ObjectiveDto,
} from "../pages/project1";
import {
  Grid,
  Avatar,
  User,
  Badge,
  Text,
  Card,
  Spacer,
  Container,
  Col,
  Row,
} from "@nextui-org/react";
import MatchHistoryComponent from "../components/MatchHistoryComponent";

interface ExtendedSummonerData extends SummonerData {
  profileIconUrl: string;
}

const Project3 = () => {
  const [summonerData, setSummonerData] = useState<ExtendedSummonerData | null>(
    null
  );
  const [rankedData, setRankedData] = useState<RankedData[]>([]);

  // Add the relevant state variables from the test project
  const [level, setLevel] = useState<number | null>(null);
  const [puuid, setPuuid] = useState<string | null>(null);
  const [matchIds, setMatchIds] = useState<
    { matchId: string; matchDetails: any }[] | null
  >(null);

  // Relevant match data
  const [gameMode, setGameMode] = useState<string | null>(null);
  const [gameType, setGameType] = useState<string | null>(null);
  const [gameDuration, setGameDuration] = useState<number | null>(null);
  const [gameStartTimestamp, setGameStartTimestamp] = useState<number | null>(
    null
  );

  const findParticipantData = (
    participants: Match["info"]["participants"],
    puuid: string
  ) => {
    return participants.find((participant) => participant.puuid === puuid);
  };

  const findTeamData = (teams: Match["info"]["teams"], teamId: number) => {
    return teams.find((team) => team.teamId === teamId);
  };

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

  const fetchSummonerData = async (summonerName: string, region: string) => {
    try {
      const summonerResponse = await fetch(
        `/api/api?summonerName=${encodeURIComponent(
          summonerName
        )}&region=${encodeURIComponent(region)}`
      );

      if (!summonerResponse.ok) {
        const errorData = await summonerResponse.json();
        throw new Error(errorData.error);
      }

      const summonerData = await summonerResponse.json();
      const profileIconUrl = `https://ddragon.leagueoflegends.com/cdn/11.21.1/img/profileicon/${summonerData.summonerData.profileIconId}.png`;
      setSummonerData({ ...summonerData.summonerData, profileIconUrl });

      if (summonerData.rankedData && summonerData.rankedData.length > 0) {
        setRankedData(summonerData.rankedData);
      } else {
        setRankedData([]);
      }

      // Set level and puuid for later use
      setLevel(summonerData.summonerData.summonerLevel);
      setPuuid(summonerData.summonerData.puuid);
    } catch (error) {
      console.error("Error fetching summoner data:", error);
      setSummonerData(null);
      setRankedData([]);
    }
  };

  //Color coding the winrate
  const getWinRateColor = (winRate: number) => {
    if (winRate >= 80) return "#FFD700"; // Gold
    if (winRate >= 65) return "#32CD32"; // Lime Green
    if (winRate >= 50) return "#00BFFF"; // Deep Sky Blue
    if (winRate >= 40) return "#FF6347"; // Tomato
    return "#8B0000"; // Dark Red
  };

  return (
    <div>
      <SearchBar onSearch={fetchSummonerData} />
      <Grid.Container gap={2} justify="center">
        <Grid xs={12} md={3}>
          {summonerData && (
            <Card>
              <div style={{ textAlign: "left", padding: "1rem" }}>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <Avatar
                    src={summonerData.profileIconUrl}
                    alt={summonerData.name}
                    zoomed
                    css={{ size: "$40" }}
                    bordered
                    color="gradient"
                  />
                  <div style={{ marginLeft: "10px" }}>
                    <h3
                      style={{
                        marginBottom: "0",
                        fontSize: "32px",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {summonerData.name}
                    </h3>
                    <Badge color="primary" size="lg" variant="bordered">
                      Level: {summonerData.summonerLevel}
                    </Badge>
                  </div>
                </div>
              </div>
            </Card>
          )}
        </Grid>
        <Grid xs={12} md={3}>
          {rankedData.map((data) => (
            <Card key={`${data.tier}-${data.rank}`}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "1rem",
                }}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
                  <Avatar
                    src={data.imageUrl}
                    alt={`${data.tier} ${data.rank}`}
                    zoomed
                    css={{ size: "$40" }}
                    bordered
                    color="gradient"
                  />
                </div>
                <div style={{ marginLeft: "10px" }}>
                  <h3
                    style={{
                      marginBottom: "0",
                      fontSize: "32px",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {`${
                      data.tier.charAt(0).toUpperCase() +
                      data.tier.slice(1).toLowerCase()
                    } ${data.rank}`}
                  </h3>
                  <Badge color="primary" size="lg" variant="bordered">
                    {data.leaguePoints} LP
                  </Badge>
                </div>
                <div style={{ marginLeft: "20px" }}>
                  {data.provisional && (
                    <div>
                      <Text>Provisional games:</Text>
                      <Text>Wins: {data.miniSeries?.wins}</Text>
                      <Text>Losses: {data.miniSeries?.losses}</Text>
                      <Text>Progress: {data.miniSeries?.progress}</Text>
                    </div>
                  )}
                  {!data.provisional && (
                    <div>
                      <Text>Wins: {data.wins}</Text>
                      <Text>Losses: {data.losses}</Text>
                      <Text>
                        Win Rate:{" "}
                        <span style={{ color: getWinRateColor(data.winRate) }}>
                          {data.winRate.toFixed(2)}%
                        </span>
                      </Text>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </Grid>
        <Grid xs={12} md={3}>
          {rankedData.map((data) => (
            <Card key={`${data.tier}-${data.rank}`}>
              *Placeholder for future content*
            </Card>
          ))}
        </Grid>
        <Grid xs={12} md={3}>
          {rankedData.map((data) => (
            <Card key={`${data.tier}-${data.rank}`}>
              *Placeholder for future content*
            </Card>
          ))}
        </Grid>
        <Grid xs={3}>
          <Card>Champion Information Placeholder</Card>
        </Grid>
        <Grid xs={9}>
          <Card>
            <Project1 />
          </Card>
        </Grid>
      </Grid.Container>
    </div>
  );
};

export default Project3;
