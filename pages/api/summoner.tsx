import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const summonerName = req.query.summonerName as string;

  try {
    const [summonerResponse, versionResponse] = await Promise.all([
      axios.get(
        `https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${summonerName}?api_key=${process.env.RIOT_API_KEY}`
      ),
      axios.get("https://ddragon.leagueoflegends.com/api/versions.json"),
    ]);

    const summonerData = summonerResponse.data;
    const version = versionResponse.data[0];

    const [rankedResponse, championMasteriesResponse] = await Promise.all([
      axios.get(
        `https://euw1.api.riotgames.com/lol/league/v4/entries/by-summoner/${summonerData.id}?api_key=${process.env.RIOT_API_KEY}`
      ),
      axios.get(
        `https://euw1.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-summoner/${summonerData.id}?api_key=${process.env.RIOT_API_KEY}`
      ),
    ]);

    const rankedData = rankedResponse.data[0];
    const championMasteries = championMasteriesResponse.data;

    // additional data
    const lp = rankedData?.leaguePoints ?? "Unknown";
    const wins = rankedData?.wins ?? "Unknown";
    const losses = rankedData?.losses ?? "Unknown";
    const winrate =
      rankedData && wins + losses > 0
        ? Math.round((wins / (wins + losses)) * 100) + "%"
        : "Unknown";

    // get profile icon ID
    const profileIconId = summonerData.profileIconId;

    // construct profile icon URL
    const profileIconUrl = `https://ddragon.leagueoflegends.com/cdn/${version}/img/profileicon/${profileIconId}.png`;

    // return summoner, ranked, and champion masteries data to client
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
      summonerIconUrl: profileIconUrl,
      championMasteries: championMasteries,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Unable to fetch summoner data" });
  }
}

export default handler;
