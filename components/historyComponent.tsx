import React, { useState, useEffect } from "react";
import { Collapse } from "@nextui-org/react";
import {
  getChampionIconURL,
  getSummonerSpellURL,
  getRuneURL,
} from "./dataDragonUtils";

export interface MatchHistoryComponentProps {
  summonerName: string;
  region: string;
}

export interface Match {
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

export interface ParticipantDto {
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

export interface PerksDto {
  statPerks: PerkStatsDto;
  styles: PerkStyleDto[];
}

export interface PerkStatsDto {
  defense: number;
  flex: number;
  offense: number;
}

export interface PerkStyleDto {
  description: string;
  selections: PerkStyleSelectionDto[];
  style: number;
}

export interface PerkStyleSelectionDto {
  perk: number;
  var1: number;
  var2: number;
  var3: number;
}

export interface TeamDto {
  bans: BanDto[];
  objectives: ObjectivesDto;
  teamId: number;
  win: boolean;
}

export interface BanDto {
  championId: number;
  pickTurn: number;
}

export interface ObjectivesDto {
  baron: ObjectiveDto;
  champion: ObjectiveDto;
  dragon: ObjectiveDto;
  inhibitor: ObjectiveDto;
  riftHerald: ObjectiveDto;
  tower: ObjectiveDto;
}

export interface ObjectiveDto {
  first: boolean;
  kills: number;
}

//Helper functions:
const formatTimeDifference = (timestamp: number) => {
  const now = Date.now();
  const difference = now - timestamp;
  const minutes = Math.floor(difference / 1000 / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days >= 1) {
    return `${days} day(s) ago`;
  } else if (hours >= 1) {
    return `${hours} hour(s) ${minutes % 60} min ago`;
  } else {
    return `${minutes} min ago`;
  }
};

const getGameModeDescription = (queueId: number) => {
  switch (queueId) {
    case 420:
      return "Ranked Solo";
    case 440:
      return "Ranked Flex";
    case 400:
      return "Normal";
    case 700:
      return "Clash";
    case 450:
      return "ARAM";
    default:
      return "Undefined";
  }
};

const findParticipantData = (
  participants: Match["info"]["participants"],
  puuid: string
) => {
  return participants.find((participant) => participant.puuid === puuid);
};

const findTeamData = (teams: Match["info"]["teams"], teamId: number) => {
  return teams.find((team) => team.teamId === teamId);
};

const historyComponent: React.FC<MatchHistoryComponentProps> = ({
  summonerName,
  region,
}) => {
  const [level, setLevel] = useState<number | null>(null);
  const [puuid, setPuuid] = useState<string | null>(null);
  const [matchIds, setMatchIds] = useState<
    { matchId: string; matchDetails: any }[] | null
  >(null);

  // Initialize state variable to store the data
  const [gameMode, setGameMode] = useState<string | null>(null);
  const [gameType, setGameType] = useState<string | null>(null);
  const [gameDuration, setGameDuration] = useState<number | null>(null);
  const [gameStartTimestamp, setGameStartTimestamp] = useState<number | null>(
    null
  );
  // Add kills, deaths, and assists state variables
  const [kills, setKills] = useState<number | null>(null);
  const [deaths, setDeaths] = useState<number | null>(null);
  const [assists, setAssists] = useState<number | null>(null);
  //Game won
  const [won, setWon] = useState<boolean | null>(null);

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

  const handleMatchClick = (match: {
    matchId: string;
    matchDetails: Match;
  }) => {
    // Update relevant match data variables
    setGameMode(match.matchDetails.info.gameMode);
    setGameType(match.matchDetails.info.gameType);
    setGameDuration(match.matchDetails.info.gameDuration);
    setGameStartTimestamp(match.matchDetails.info.gameStartTimestamp);

    // Find participant data and extract kills, deaths, and assists and won status
    if (puuid) {
      const participantData = findParticipantData(
        match.matchDetails.info.participants,
        puuid
      );
      if (participantData) {
        setKills(participantData.kills);
        setDeaths(participantData.deaths);
        setAssists(participantData.assists);
        setWon(participantData.win);
      }
    }
  };
  return (
    <div>
      {matchIds && (
        <div>
          <Collapse.Group>
            {matchIds.map((match) => {
              let participantData;
              if (puuid) {
                participantData = findParticipantData(
                  match.matchDetails.info.participants,
                  puuid
                );
              }
              return (
                <Collapse
                  title={
                    <>
                      <div>Match ID: {match.matchId}</div>
                      {participantData && (
                        <div>
                          <p>
                            Game Mode:{" "}
                            {getGameModeDescription(
                              match.matchDetails.info.queueId
                            )}
                          </p>
                          <p>Champion: {participantData.championName}</p>
                          <p>Role: {participantData.teamPosition}</p>
                          <p>Kills: {participantData.kills}</p>
                          <p>Deaths: {participantData.deaths}</p>
                          <p>Assists: {participantData.assists}</p>
                          <p>{participantData.win ? "Won" : "Lost"}</p>
                          <p>
                            Played:{" "}
                            {formatTimeDifference(
                              match.matchDetails.info.gameStartTimestamp
                            )}
                          </p>
                          <img
                            src={getChampionIconURL(
                              participantData.championId.toString()
                            )}
                            alt={participantData.championName}
                            width={50}
                            height={50}
                          />
                          <img
                            src={getSummonerSpellURL(
                              participantData.summoner1Id.toString()
                            )}
                            alt={`Summoner Spell 1`}
                            width={25}
                            height={25}
                          />
                          <img
                            src={getSummonerSpellURL(
                              participantData.summoner2Id.toString()
                            )}
                            alt={`Summoner Spell 2`}
                            width={25}
                            height={25}
                          />
                          <img
                            src={getRuneURL(
                              participantData.perks.styles[0].style.toString()
                            )}
                            alt={`Primary Rune`}
                            width={25}
                            height={25}
                          />
                          <img
                            src={getRuneURL(
                              participantData.perks.styles[1].style.toString()
                            )}
                            alt={`Secondary Rune`}
                            width={25}
                            height={25}
                          />
                        </div>
                      )}
                    </>
                  }
                  key={match.matchId}
                  style={{ backgroundColor: "#151517" }} // Add a custom background color here
                >
                  <ul>
                    <li>
                      <p>Game Mode: {match.matchDetails.info.gameMode}</p>
                    </li>
                    <li>
                      <p>Game Type: {match.matchDetails.info.gameType}</p>
                    </li>
                    <li>
                      <p>
                        Game Duration: {match.matchDetails.info.gameDuration}s
                      </p>
                    </li>
                  </ul>
                </Collapse>
              );
            })}
          </Collapse.Group>
        </div>
      )}
    </div>
  );
};

export default historyComponent;
