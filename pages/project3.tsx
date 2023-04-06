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
                <div>
                  <h3
                    style={{
                      fontSize: "32px",
                      marginBottom: "0",
                    }}
                  >
                    {`${data.tier} ${data.rank}`}
                  </h3>
                  <Text style={{ fontSize: "18px" }}>
                    {data.leaguePoints} LP
                  </Text>
                </div>
                <div style={{ marginLeft: "20px" }}>
                  <Text>Wins: {data.wins}</Text>
                  <Text>Losses: {data.losses}</Text>
                  <Text>Win Rate: {data.winRate.toFixed(2)}%</Text>
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
