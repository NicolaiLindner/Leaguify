import { useState } from "react";
import SearchBar from "../components/SearchBar";
import { SummonerData, RankedData } from "./api/api";
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

interface ExtendedSummonerData extends SummonerData {
  profileIconUrl: string;
}

const Project3 = () => {
  const [summonerData, setSummonerData] = useState<ExtendedSummonerData | null>(
    null
  );
  const [rankedData, setRankedData] = useState<RankedData[]>([]);

  const fetchSummonerData = async (summonerName: string, region: string) => {
    try {
      const response = await fetch(
        `/api/api?summonerName=${summonerName}&region=${region}`
      );

      // Log the raw response and status code
      console.log("Raw response:", response);
      console.log("Status code:", response.status);

      const data = await response.json();
      console.log("Parsed data:", data); // Add this log statement
      console.log("Image URL:", data.rankedData[0].imageUrl);

      if (!response.ok) {
        throw new Error(data.error);
      }

      const profileIconUrl = `https://ddragon.leagueoflegends.com/cdn/11.21.1/img/profileicon/${data.summonerData.profileIconId}.png`;

      setSummonerData({ ...data.summonerData, profileIconUrl });
      if (data.rankedData && data.rankedData.length > 0) {
        setRankedData(data.rankedData);
        console.log("Image URL:", data.rankedData[0].imageUrl);
      } else {
        setRankedData([]);
      }
    } catch (error: any) {
      console.error("Failed to fetch summoner data:", error.message);
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
        <Grid xs={12} md={6}>
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
                    {summonerData.hotStreak && (
                      <Badge color="success" size="lg" variant="bordered">
                        Hot Streak
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          )}
        </Grid>
        <Grid xs={12} md={6}>
          {rankedData.map((data) => (
            <Card key={`${data.tier}-${data.rank}`}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "1rem",
                }}
              >
                <div style={{ marginRight: "10px" }}>
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
      </Grid.Container>
    </div>
  );
};

export default Project3;
