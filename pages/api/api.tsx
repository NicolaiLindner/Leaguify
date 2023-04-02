import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

// Interfaces for the different data structures used in the script
interface SummonerInfo {
  name: string;
  level: number;
  icon: string;
}

interface RankedInfo {
  rank: string;
  tier: string;
  lp: number;
  wins: number;
  losses: number;
  winrate: number;
}

interface ChampionMasteryInfo {
  championName: string;
  championLevel: number;
  championPoints: number;
}

interface ItemInfo {
  [itemId: string]: {
    name: string;
    icon: string;
    stats: {
      [statName: string]: number;
    };
  };
}

interface RuneMasteryInfo {
  runes: {
    id: number;
    key: string;
    icon: string;
    name: string;
    shortDesc: string;
    longDesc: string;
  }[];
  masteries: {
    id: number;
    key: string;
    icon: string;
    name: string;
    ranks: {
      [rank: number]: {
        effect: string;
      };
    };
  }[];
}

interface MatchDetails {
  championName: string;
  kda: string;
  items: {
    name: string;
    icon: string;
  }[];
  summonerSpells: {
    name: string;
    icon: string;
  }[];
  runes: {
    name: string;
    icon: string;
  }[];
  masteries: {
    name: string;
    ranks: {
      [rank: number]: {
        effect: string;
      };
    };
  }[];
}

interface MatchSummary {
  championName: string;
  kda: string;
  items: string[];
  summonerSpells: string[];
  runes: string[];
  masteries: string[];
}

interface SummonerData {
  summonerInfo: SummonerInfo;
  rankedInfo: RankedInfo;
  championMasteryInfo: ChampionMasteryInfo[];
  itemInfo: ItemInfo;
  runeMasteryInfo: RuneMasteryInfo;
  matchHistory: string[];
  matchSummaries: MatchSummary[];
}

// Function to get basic Summoner information (name, level, icon) based on a summoner name
async function getSummonerInfo(summonerName: string): Promise<SummonerInfo> {
  const { data } = await axios.get(
    `https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${encodeURIComponent(
      summonerName
    )}?api_key=${process.env.RIOT_API_KEY}`
  );
  // Fetch the data from Riot's API
  return {
    name: data.name,
    level: data.summonerLevel,
    icon: `http://ddragon.leagueoflegends.com/cdn/${process.env.LATEST_DDRAGON_VERSION}/img/profileicon/${data.profileIconId}.png`,
  };
}
// Function to get ranked information (rank, tier, LP, wins, losses, winrate) based on an encrypted Summoner ID, fetch data from Riot's API and extract relevant ranked information
async function getRankedInfo(encryptedSummonerId: string): Promise<RankedInfo> {
  const { data } = await axios.get(
    `https://euw1.api.riotgames.com/lol/league/v4/entries/by-summoner/${encodeURIComponent(
      encryptedSummonerId
    )}?api_key=${process.env.RIOT_API_KEY}`
  );

  const soloRanked = data.find(
    (entry) => entry.queueType === "RANKED_SOLO_5x5"
  );

  return {
    rank: soloRanked?.tier || "Unranked",
    tier: soloRanked?.rank || "",
    lp: soloRanked?.leaguePoints || 0,
    wins: soloRanked?.wins || 0,
    losses: soloRanked?.losses || 0,
    winrate:
      (soloRanked?.wins / (soloRanked?.wins + soloRanked?.losses)) * 100 || 0,
  };
}
// Function to get champion mastery information (champion name, level, points) based on an encrypted Summoner ID
async function getChampionMasteryInfo(
  encryptedSummonerId: string
): Promise<ChampionMasteryInfo[]> {
  const { data } = await axios.get(
    `https://euw1.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-summoner/${encodeURIComponent(
      encryptedSummonerId
    )}?api_key=${process.env.RIOT_API_KEY}`
  );

  return data.map((championMastery) => ({
    championName: championMastery.championName,
    championLevel: championMastery.championLevel,
    championPoints: championMastery.championPoints,
  }));
}

async function getItemInfo(): Promise<ItemInfo> {
  const { data } = await axios.get(
    `http://ddragon.leagueoflegends.com/cdn/${process.env.LATEST_DDRAGON_VERSION}/data/en_US/item.json`
  );

  const itemInfo: ItemInfo = {};

  for (const itemId in data.data) {
    const item = data.data[itemId];

    itemInfo[itemId] = {
      name: item.name,
      icon: `http://ddragon.leagueoflegends.com/cdn/${process.env.LATEST_DDRAGON_VERSION}/img/item/${itemId}.png`,
      stats: item.stats,
    };
  }

  return itemInfo;
}

async function getRuneMasteryInfo(): Promise<RuneMasteryInfo> {
  const { data } = await axios.get(
    `http://ddragon.leagueoflegends.com/cdn/${process.env.LATEST_DDRAGON_VERSION}/data/en_US/runesReforged.json`
  );

  const runeMasteryInfo: RuneMasteryInfo = {
    runes: [],
    masteries: [],
  };

  for (const rune of data) {
    runeMasteryInfo.runes.push({
      id: rune.id,
      key: rune.key,
      icon: `http://ddragon.leagueoflegends.com/cdn/${process.env.LATEST_DDRAGON_VERSION}/img/${rune.icon}`,
      name: rune.name,
      shortDesc: rune.shortDesc,
      longDesc: rune.longDesc,
    });

    for (const mastery of rune.slots[0].runes) {
      runeMasteryInfo.masteries.push({
        id: mastery.id,
        key: mastery.key,
        icon: `http://ddragon.leagueoflegends.com/cdn/${process.env.LATEST_DDRAGON_VERSION}/img/${mastery.icon}`,
        name: mastery.name,
        ranks: mastery.ranks,
      });
    }
  }

  return runeMasteryInfo;
}

async function getMatchHistory(puuid: string): Promise<string[]> {
  const { data } = await axios.get(
    `https://euw1.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?start=0&count=5&api_key=${process.env.RIOT_API_KEY}`
  );

  return data;
}

async function getMatchDetails(matchId: string): Promise<MatchDetails> {
  const { data } = await axios.get(
    `https://euw1.api.riotgames.com/lol/match/v5/matches/${matchId}?api_key=${process.env.RIOT_API_KEY}`
  );

  const participant = data.info.participants.find(
    (participant) => participant.puuid === data.metadata.participants[0]
  );
  const summonerSpells = [
    `http://ddragon.leagueoflegends.com/cdn/${process.env.LATEST_DDRAGON_VERSION}/img/spell/${participant.summoner1Id}.png`,
    `http://ddragon.leagueoflegends.com/cdn/${process.env.LATEST_DDRAGON_VERSION}/img/spell/${participant.summoner2Id}.png`,
  ];
  const matchDetails: MatchDetails = {
    championName: participant.championName,
    kda: `${participant.kills}/${participant.deaths}/${participant.assists}`,
    items: [
      `http://ddragon.leagueoflegends.com/cdn/${process.env.LATEST_DDRAGON_VERSION}/img/item/${participant.item0}.png`,
      `http://ddragon.leagueoflegends.com/cdn/${process.env.LATEST_DDRAGON_VERSION}/img/item/${participant.item1}.png`,
      `http://ddragon.leagueoflegends.com/cdn/${process.env.LATEST_DDRAGON_VERSION}/img/item/${participant.item2}.png`,
      `http://ddragon.leagueoflegends.com/cdn/${process.env.LATEST_DDRAGON_VERSION}/img/item/${participant.item3}.png`,
      `http://ddragon.leagueoflegends.com/cdn/${process.env.LATEST_DDRAGON_VERSION}/img/item/${participant.item4}.png`,
      `http://ddragon.leagueoflegends.com/cdn/${process.env.LATEST_DDRAGON_VERSION}/img/item/${participant.item5}.png`,
    ],
    summonerSpells: [
      `http://ddragon.leagueoflegends.com/cdn/${process.env.LATEST_DDRAGON_VERSION}/img/spell/${participant.summoner1Id}.png`,
      `http://ddragon.leagueoflegends.com/cdn/${process.env.LATEST_DDRAGON_VERSION}/img/spell/${participant.summoner2Id}.png`,
    ],
    runes: participant.perks.styles.flatMap((style) => [
      `http://ddragon.leagueoflegends.com/cdn/img/${style.icon}`,
      ...style.selections.flatMap((selection) =>
        selection.runes.map(
          (rune) => `http://ddragon.leagueoflegends.com/cdn/img/${rune.icon}`
        )
      ),
    ]),
    masteries: participant.perks.styles.flatMap((style) =>
      style.selections.flatMap((selection) =>
        Object.values(selection.perkIds).flatMap((perkId) => {
          const perk = participant.perks.perkIds[perkId];
          return [
            {
              name: perk.name,
              ranks: perk.ranks.reduce(
                (obj, rank) => ({
                  ...obj,
                  [rank]: { effect: perk.effectValues[rank - 1] },
                }),
                {}
              ),
            },
          ];
        })
      )
    ),
  };

  return matchDetails;
}

async function getSummonerData(summonerName: string): Promise<SummonerData> {
  const { data: summoner } = await axios.get(
    `https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${encodeURIComponent(
      summonerName
    )}?api_key=${process.env.RIOT_API_KEY}`
  );

  const [
    summonerInfo,
    rankedInfo,
    championMasteryInfo,
    itemInfo,
    runeMasteryInfo,
    matchHistory,
  ] = await Promise.all([
    getSummonerInfo(summonerName),
    getRankedInfo(summoner.id),
    getChampionMasteryInfo(summoner.id),
    getItemInfo(),
    getRuneMasteryInfo(),
    getMatchHistory(summoner.puuid),
  ]);

  const matchDetails = await Promise.all(
    matchHistory.map((matchId) => getMatchDetails(matchId))
  );

  const summonerData: SummonerData = {
    ...summonerInfo,
    rankedInfo,
    championMasteryInfo,
    itemInfo,
    runeMasteryInfo,
    matchDetails,
  };

  return summonerData;
}
