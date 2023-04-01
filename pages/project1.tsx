import { useState } from "react";
import { Pie } from "react-chartjs-2";

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
  const [chartData, setChartData] = useState({});

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
    } catch (error) {
      console.error(error);
    }
  };

  const winPercentage = parseInt(summonerWinrate) || 0;
  const lossPercentage = 100 - winPercentage;

  return (
    <div>
      <form onSubmit={handleFormSubmit}>
        <label>
          Summoner Name:
          <input
            type="text"
            value={summonerName}
            onChange={(e) => setSummonerName(e.target.value)}
          />
        </label>
        <button type="submit">Search</button>
      </form>

      {summonerId && (
        <div>
          Summoner name: {summonerName}
          <br />
          Summoner level: {summonerLevel}
          <br />
          Summoner ID: {summonerId}
          <br />
          Summoner rank: {summonerRank}
          <br />
          Summoner tier: {summonerTier}
          <br />
          Summoner LP: {summonerLp}
          <br />
          Summoner wins: {summonerWins}
          <br />
          Summoner losses: {summonerLosses}
          <br />
          Summoner winrate: {summonerWinrate}
          <br />
        </div>
      )}
    </div>
  );
}
