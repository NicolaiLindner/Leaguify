import React, { useState } from "react";
import SearchBar from "../components/SearchBar";
import MatchHistory from "./api/matchhistory";

interface Match {
  metadata: {
    dataVersion: string;
    matchId: string;
    participants: string[];
  };
  info: {
    gameCreation: number;
    gameDuration: number;
    gameEndTimestamp?: number;
    gameId: number;
    gameMode: string;
    gameName: string;
    gameStartTimestamp: number;
    gameType: string;
    gameVersion: string;
    mapId: number;
    participants: ParticipantDto[];
    platformId: string;
    queueId: number;
    teams: TeamDto[];
    tournamentCode?: string;
  };
}

interface ParticipantDto {
  assists: number;
  baronKills: number;
  bountyLevel: number;
  champExperience: number;
  champLevel: number;
  championId: number;
  championName: string;
  championTransform: number;
  consumablesPurchased: number;
  damageDealtToBuildings: number;
  damageDealtToObjectives: number;
  damageDealtToTurrets: number;
  damageSelfMitigated: number;
  deaths: number;
  detectorWardsPlaced: number;
  doubleKills: number;
  dragonKills: number;
  firstBloodAssist: boolean;
  firstBloodKill: boolean;
  firstTowerAssist: boolean;
  firstTowerKill: boolean;
  gameEndedInEarlySurrender: boolean;
  gameEndedInSurrender: boolean;
  goldEarned: number;
  goldSpent: number;
  individualPosition: string;
  inhibitorKills: number;
  inhibitorTakedowns: number;
  inhibitorsLost: number;
  item0: number;
  item1: number;
  item2: number;
  item3: number;
  item4: number;
  item5: number;
  item6: number;
  itemsPurchased: number;
  killingSprees: number;
  kills: number;
  largestCriticalStrike: number;
  largestKillingSpree: number;
  largestMultiKill: number;
  longestTimeSpentLiving: number;
  magicDamageDealt: number;
  magicDamageDealtToChampions: number;
  magicDamageTaken: number;
  neutralMinionsKilled: number;
  nexusKills: number;
  nexusTakedowns: number;
  nexusLost: number;
  objectivesStolen: number;
  objectivesStolenAssists: number;
  participantId: number;
  pentaKills: number;
  perks: PerksDto;
  physicalDamageDealt: number;
  physicalDamageDealtToChampions: number;
  physicalDamageTaken: number;
  profileIcon: number;
  puuid: string;
  quadraKills: number;
  riotIdName: string;
  riotIdTagline: string;
  role: string;
  sightWardsBoughtInGame: number;
  spell1Casts: number;
  spell2Casts: number;
  spell3Casts: number;
  spell4Casts: number;
  summoner1Casts: number;
  summoner1Id: number;
  summoner2Casts: number;
  summoner2Id: number;
  summonerId: string;
  summonerLevel: number;
  summonerName: string;
  teamEarlySurrendered: boolean;
  teamId: number;
  teamPosition: string;
  timeCCingOthers: number;
  timePlayed: number;
  totalDamageDealt: number;
  totalDamageDealtToChampions: number;
  totalDamageShieldedOnTeammates: number;
  totalDamageTaken: number;
  totalHeal: number;
  totalHealsOnTeammates: number;
  totalMinionsKilled: number;
  totalTimeCCDealt: number;
  totalTimeSpentDead: number;
  totalUnitsHealed: number;
  tripleKills: number;
  trueDamageDealt: number;
  trueDamageDealtToChampions: number;
  trueDamageTaken: number;
  turretKills: number;
  turretTakedowns: number;
  turretsLost: number;
  unrealKills: number;
  visionScore: number;
  visionWardsBoughtInGame: number;
  wardsKilled: number;
  wardsPlaced: number;
  win: boolean;
}

interface PerksDto {
  statPerks: PerkStatsDto;
  styles: PerkStyleDto[];
}

interface PerkStatsDto {
  defense: number;
  flex: number;
  offense: number;
}

interface PerkStyleDto {
  description: string;
  selections: PerkStyleSelectionDto[];
  style: number;
}

interface PerkStyleSelectionDto {
  perk: number;
  var1: number;
  var2: number;
  var3: number;
}

interface TeamDto {
  bans: BanDto[];
  objectives: ObjectivesDto;
  teamId: number;
  win: boolean;
}

interface BanDto {
  championId: number;
  pickTurn: number;
}

interface ObjectivesDto {
  baron: ObjectiveDto;
  champion: ObjectiveDto;
  dragon: ObjectiveDto;
  inhibitor: ObjectiveDto;
  riftHerald: ObjectiveDto;
  tower: ObjectiveDto;
}

interface ObjectiveDto {
  first: boolean;
  kills: number;
}

const findParticipantData = (
  participants: Match["info"]["participants"],
  puuid: string
) => {
  return participants.find((participant) => participant.puuid === puuid);
};

const findTeamData = (teams: Match["info"]["teams"], teamId: number) => {
  return teams.find((team) => team.teamId === teamId);
};

const Project1: React.FC = () => {
  const [level, setLevel] = useState<number | null>(null);
  const [puuid, setPuuid] = useState<string | null>(null);
  const [matchIds, setMatchIds] = useState<
    { matchId: string; matchDetails: any }[] | null
  >(null);

  // Relevant match data
  const [gameMode, setGameMode] = useState<string | null>(null);
  const [gameType, setGameType] = useState<string | null>(null);
  const [gameDuration, setGameDuration] = useState<number | null>(null);
  const [gameStartTimestamp, setGameStartTimestamp] = useState<number | null>(
    null
  );

  const getMatchRegion = (region: string) => {
    switch (region) {
      case "euw1":
        return "europe";
      case "na1":
        return "americas";
      case "eun1":
        return "europe";
      // Add more regions if needed
      default:
        return region;
    }
  };

  const handleSearch = async (summonerName: string, region: string) => {
    try {
      const response = await fetch(
        `/api/api?summonerName=${encodeURIComponent(
          summonerName
        )}&region=${encodeURIComponent(region)}`
      );

      if (response.ok) {
        const data = await response.json();
        setLevel(data.summonerData.summonerLevel);
        setPuuid(data.puuid);
        fetchMatchHistory(data.puuid, region);
      } else {
        console.error("Failed to fetch summoner data:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching summoner data:", error);
    }
  };

  const fetchMatchHistory = async (puuid: string, region: string) => {
    try {
      const matchRegion = getMatchRegion(region);
      const response = await fetch(
        `/api/matchhistory?puuid=${encodeURIComponent(
          puuid
        )}&region=${encodeURIComponent(matchRegion)}`
      );

      if (response.ok) {
        const data = await response.json();
        setMatchIds(data);
      } else {
        console.error("Failed to fetch match history:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching match history:", error);
    }
  };

  const handleMatchClick = (match: { matchId: string; matchDetails: any }) => {
    // Update relevant match data variables
    setGameMode(match.matchDetails.info.gameMode);
    setGameType(match.matchDetails.info.gameType);
    setGameDuration(match.matchDetails.info.gameDuration);
    setGameStartTimestamp(match.matchDetails.info.gameStartTimestamp);
  };

  return (
    <div>
      <h1>Project1</h1>
      <SearchBar onSearch={handleSearch} />
      {level && <p>Summoner Level: {level}</p>}
      {puuid && <p>PUUID: {puuid}</p>}
      {matchIds && (
        <div>
          <h2>Last 10 Match IDs:</h2>
          <ul>
            {matchIds.map((match) => (
              <li key={match.matchId}>
                <p>Match ID: {match.matchId}</p>
                <p>Game Mode: {match.matchDetails.info.gameMode}</p>
                <p>Game Type: {match.matchDetails.info.gameType}</p>
                <p>Game Duration: {match.matchDetails.info.gameDuration}s</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Project1;
