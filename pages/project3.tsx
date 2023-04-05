import { useState } from "react";
import SearchBar from "../components/SearchBar";
import { SummonerData } from "./api/api";
import { Grid, Avatar, User, Badge } from "@nextui-org/react";

interface ExtendedSummonerData extends SummonerData {
  profileIconUrl: string;
}

const Project3 = () => {
  const [summonerData, setSummonerData] = useState<ExtendedSummonerData | null>(
    null
  );

  const fetchSummonerData = async (summonerName: string, region: string) => {
    try {
      const response = await fetch(
        `/api/api?summonerName=${summonerName}&region=${region}`
      );

      // Log the raw response and status code
      console.log("Raw response:", response);
      console.log("Status code:", response.status);

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error);
      }

      const profileIconUrl = `https://ddragon.leagueoflegends.com/cdn/11.21.1/img/profileicon/${data.summonerData.profileIconId}.png`;

      setSummonerData({ ...data.summonerData, profileIconUrl });
    } catch (error: any) {
      console.error("Failed to fetch summoner data:", error.message);
    }
  };

  return (
    <div>
      <SearchBar onSearch={fetchSummonerData} />
      <Grid.Container gap={2} justify="center">
        <Grid xs={4}>
          {summonerData && (
            <div style={{ display: "flex", alignItems: "center" }}>
              <Avatar
                src={summonerData.profileIconUrl}
                alt={summonerData.name}
                zoomed
                css={{ size: "$40" }}
                bordered
                color="gradient"
              />
              <div style={{ marginLeft: "px" }}>
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
                {/* Display more information as needed */}
              </div>
            </div>
          )}
        </Grid>
        <Grid xs={4}>{/* Other content for the middle grid */}</Grid>
      </Grid.Container>
    </div>
  );
};

export default Project3;
