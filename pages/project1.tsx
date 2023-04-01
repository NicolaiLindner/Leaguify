import { useState } from "react";
import {
  Grid,
  Spacer,
  Input,
  Button,
  Image,
  Card,
  Text,
} from "@nextui-org/react";

export default function Project1() {
  const [summonerName, setSummonerName] = useState("");
  const [summonerLevel, setSummonerLevel] = useState(0);
  const [summonerId, setSummonerId] = useState("");
  const [summonerRank, setSummonerRank] = useState("");
  const [summonerTier, setSummonerTier] = useState("");
  const [summonerLp, setSummonerLp] = useState("");
  const [summonerWins, setSummonerWins] = useState("");
  const [summonerLosses, setSummonerLosses] = useState("");
  const [summonerWinrate, setSummonerWinrate] = useState("");
  const [summonerIconUrl, setSummonerIconUrl] = useState("");

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `/api/summoner?summonerName=${summonerName}`
      );
      const data = await response.json();
      setSummonerName(data.summonerName);
      setSummonerLevel(data.summonerLevel);
      setSummonerId(data.summonerId);
      setSummonerRank(data.summonerRank);
      setSummonerTier(data.summonerTier);
      setSummonerLp(data.summonerLp);
      setSummonerWins(data.summonerWins);
      setSummonerLosses(data.summonerLosses);
      setSummonerWinrate(data.summonerWinrate);
      setSummonerIconUrl(data.summonerIconUrl);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <div className="search-container">
        <form onSubmit={handleFormSubmit}>
          <Grid.Container justify="center" alignItems="center">
            <Grid xs={12} sm={4}>
              <Input
                placeholder="Summoner Name"
                value={summonerName}
                onChange={(e) => setSummonerName(e.target.value)}
                size="lg"
              />
            </Grid>
            <Grid xs={12} sm={2}>
              <Spacer x={1} />
              <Button type="submit" size="lg" aria-label="Search">
                Search
              </Button>
            </Grid>
          </Grid.Container>
        </form>
      </div>
      {summonerId && (
        <div className="summoner-details">
          <Card>
            <Image
              src={summonerIconUrl}
              alt={`${summonerName}'s profile icon`}
            />
            <div className="summoner-info">
              <Text h4>Summoner name: {summonerName}</Text>
              <Text>Summoner level: {summonerLevel}</Text>
              <Text>Summoner ID: {summonerId}</Text>
              <Text>Summoner rank: {summonerRank}</Text>
              <Text>Summoner tier: {summonerTier}</Text>
              <Text>Summoner LP: {summonerLp}</Text>
              <Text>Summoner wins: {summonerWins}</Text>
              <Text>Summoner losses: {summonerLosses}</Text>
              <Text>Summoner winrate: {summonerWinrate}</Text>
            </div>
          </Card>
        </div>
      )}
      <style jsx>{`
        .search-container {
          padding: 2rem 0;
        }
        @media (max-width: 767px) {
          .search-container {
            padding: 1rem 0;
          }
        }
        .summoner-details {
          margin: 2rem auto;
          max-width: 600px;
        }
        .summoner-info {
          padding: 1rem;
        }
      `}</style>
    </div>
  );
}
