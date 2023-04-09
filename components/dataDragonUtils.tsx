const dataDragonVersion = "13.7.1";
const dataDragonBaseURL = "/data-dragon";

export function getChampionIconURL(championKey: string): string {
  return `${dataDragonBaseURL}/${dataDragonVersion}/img/champion/${championKey}.png`;
}

export function getSummonerSpellURL(summonerSpellId: string): string {
  return `${dataDragonBaseURL}/${dataDragonVersion}/img/spell/${summonerSpellId}.png`;
}

export function getRuneURL(runeId: string): string {
  return `${dataDragonBaseURL}/${dataDragonVersion}/img/rune/${runeId}.png`;
}
