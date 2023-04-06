import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

const RIOT_API_KEY = process.env.REACT_RIOT_API_KEY;

export interface SummonerData {
  id: string;
  accountId: string;
  puuid: string;
  name: string;
  profileIconId: number;
  revisionDate: number;
  summonerLevel: number;
  hotStreak: boolean;
  veteran: boolean;
  freshBlood: boolean;
  inactive: boolean;
}

export interface RankedData {
  tier: string;
  rank: string;
  leaguePoints: number;
  wins: number;
  losses: number;
  winRate: number;
  imageUrl: string;
  provisional: boolean;
  miniSeries?: {
    target: number;
    wins: number;
    losses: number;
    progress: string;
  };
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { summonerName, region } = req.query;

  if (!summonerName || typeof summonerName !== "string") {
    res.status(400).json({ error: "Invalid summoner name" });
    return;
  }

  if (!region || typeof region !== "string") {
    res.status(400).json({ error: "Invalid region" });
    return;
  }

  try {
    const summonerResponse = await axios.get<SummonerData>(
      `https://${region}.api.riotgames.com/lol/summoner/v4/summoners/by-name/${summonerName}`,
      {
        headers: {
          "X-Riot-Token": RIOT_API_KEY,
        },
      }
    );

    const rankedResponse = await axios.get(
      `https://${region}.api.riotgames.com/lol/league/v4/entries/by-summoner/${summonerResponse.data.id}`,
      {
        headers: {
          "X-Riot-Token": RIOT_API_KEY,
        },
      }
    );

    const rankedData: RankedData[] = rankedResponse.data.length
      ? rankedResponse.data.map((entry: any) => {
          const imageUrl = entry.hasOwnProperty("miniSeries")
            ? "/ranked_images/provisional.webp"
            : `/ranked_images/${entry.tier.toLowerCase()}_${entry.rank.toLowerCase()}.webp`;

          return {
            tier: entry.tier,
            rank: entry.rank,
            leaguePoints: entry.leaguePoints,
            wins: entry.wins,
            losses: entry.losses,
            winRate: (entry.wins / (entry.wins + entry.losses)) * 100,
            imageUrl,
            provisional: entry.hasOwnProperty("miniSeries"),
            miniSeries: entry.miniSeries,
          };
        })
      : [
          {
            tier: "Unranked",
            rank: "",
            leaguePoints: 0,
            wins: 0,
            losses: 0,
            winRate: 0,
            imageUrl: "/ranked_images/unranked.webp",
            provisional: false,
          },
        ];

    console.log("rankedData:", rankedData);

    res.status(200).json({ summonerData: summonerResponse.data, rankedData });
  } catch (error: any) {
    res.status(error.response?.status || 500).json({ error: error.message });
  }
};

export default handler;
