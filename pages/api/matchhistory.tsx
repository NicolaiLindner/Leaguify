import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import NodeCache from "node-cache";
import Bottleneck from "bottleneck";

const RIOT_API_KEY = process.env.REACT_RIOT_API_KEY;
const MATCH_HISTORY_CACHE_TTL = 60 * 60; // Cache for 1 hour

// Initialize the cache
const cache = new NodeCache({ stdTTL: MATCH_HISTORY_CACHE_TTL });

// Initialize the rate limiter
const limiter = new Bottleneck({
  reservoir: 20, // initial capacity
  reservoirRefreshAmount: 20,
  reservoirRefreshInterval: 1000, // 20 request per second
  minTime: 50, // minimum time between requests
});

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { puuid, region } = req.query;

  console.log("Received request with puuid:", puuid);
  console.log("Received request with region:", region);

  // Validate puuid and region
  if (!puuid || typeof puuid !== "string") {
    res.status(400).json({ error: "Invalid puuid" });
    return;
  }

  if (!region || typeof region !== "string") {
    res.status(400).json({ error: "Invalid region" });
    return;
  }

  // Check cache for existing data
  const cacheKey = `${puuid}_${region}`;
  const cachedData = cache.get(cacheKey);

  if (cachedData) {
    console.log("Found cached data for key:", cacheKey);
    res.status(200).json(cachedData);
    return;
  } else {
    console.log("No cached data found for key:", cacheKey);
  }

  try {
    const fetchMatchHistory = async () => {
      const response = await axios.get(
        `https://${region}.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?count=10&api_key=${RIOT_API_KEY}`
      );
      return response.data;
    };

    const fetchMatchDetails = async (matchId: string) => {
      const response = await axios.get(
        `https://${region}.api.riotgames.com/lol/match/v5/matches/${matchId}?api_key=${RIOT_API_KEY}`
      );
      return response.data;
    };

    const matchHistoryData = await limiter.schedule(fetchMatchHistory);

    console.log("Fetched match history data:", matchHistoryData);

    // Fetch match details in parallel
    const matchDetailsPromises = matchHistoryData.map((matchId: string) =>
      limiter.schedule(() => fetchMatchDetails(matchId))
    );
    const matchDetailsData = await Promise.all(matchDetailsPromises);

    console.log("Fetched match details data:", matchDetailsData);

    const combinedData = matchHistoryData.map(
      (matchId: string, index: number) => ({
        matchId,
        matchDetails: matchDetailsData[index],
      })
    );

    // Store the fetched data in the cache
    cache.set(cacheKey, combinedData);

    // Send the JSON response
    res.status(200).json(combinedData);
  } catch (error: any) {
    console.log(
      "Error response:",
      error.response?.status,
      error.response?.data
    );

    res.status(error.response?.status || 500).json({ error: error.message });
  }
};

export default handler;
