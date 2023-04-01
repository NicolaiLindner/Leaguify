import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const summonerName = req.query.summonerName as string;

  try {
    const summonerResponse = await axios.get(
      `https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${summonerName}?api_key=${process.env.RIOT_API_KEY}`
    );
    const summonerData = summonerResponse.data;

    const rankedResponse = await axios.get(
      `https://euw1.api.riotgames.com/lol/league/v4/entries/by-summoner/${summonerData.id}?api_key=${process.env.RIOT_API_KEY}`
    );
    const rankedData = rankedResponse.data[0];

    // additional data
    const lp = rankedData?.leaguePoints ?? "Unknown";
    const wins = rankedData?.wins ?? "Unknown";
    const losses = rankedData?.losses ?? "Unknown";
    const winrate =
      rankedData && wins + losses > 0
        ? Math.round((wins / (wins + losses)) * 100) + "%"
        : "Unknown";

    // return summoner and ranked data to client
    res.status(200).json({
      summonerName: summonerData.name,
      summonerLevel: summonerData.summonerLevel,
      summonerId: summonerData.id,
      summonerRank: rankedData?.rank,
      summonerTier: rankedData?.tier,
      summonerLp: lp,
      summonerWins: wins,
      summonerLosses: losses,
      summonerWinrate: winrate,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Unable to fetch summoner data" });
  }
}

export default handler;
