// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

import * as summonerSpells from './summonerSpellByKeys.json'

import { RiotAPI, RiotAPITypes, PlatformId } from '@fightmegg/riot-api'

type Data = {
  summonerData?: any
  error?: string
}

function getParticiapntByPuuid(participants: RiotAPITypes.MatchV5.ParticipantDTO[], puuId: string) {
    return participants.find((participant) => {
        return participant.puuid === puuId
    })
}

function calculateCreepScorePerMinute(gameDuration: number, creepScore: number) {
    return creepScore / (gameDuration / 60)
}

async function getSummonerItemImages(rAPI: RiotAPI, summonerItems: number[]) {
    const items = await rAPI.ddragon.items({version: '13.1.1'})

    return summonerItems.map((summonerItem) => {
        const data = items.data[summonerItem]

        return (summonerItem)
            ? {
                name: data.name,
                description: data.description,
                image: `http://ddragon.leagueoflegends.com/cdn/13.1.1/img/item/${summonerItem}.png`
            }
            : null
    })
}

async function getSummonerSpells(summonerSpellKeys: number[]) {
    return summonerSpellKeys.map((spellKey) => {
        const {data} = summonerSpells as any
        const {id, name, description} = data[spellKey]

        return {
            name,
            description,
            image: `http://ddragon.leagueoflegends.com/cdn/13.1.1/img/spell/${id}.png`
        }
    })
}

async function getSummonerPerks(summonerPerks: RiotAPITypes.MatchV5.PerksDTO) {
    return summonerPerks
}

async function getMatchesByIds(rAPI: RiotAPI, matchIds: string[], puuId: string, res: NextApiResponse<Data>) {
    const matches = await Promise.all(matchIds.map(async (matchId) => {
        const match = await rAPI.matchV5.getMatchById({
            cluster: PlatformId.AMERICAS,
            matchId
        })

        const gameDuration = match.info.gameDuration

        const participantInfo = getParticiapntByPuuid(match.info.participants, puuId)

        if (participantInfo) {
            const {
                totalMinionsKilled,
                neutralMinionsKilled,

                item0,
                item1,
                item2,
                item3,
                item4,
                item5,
                item6,

                summoner1Id,
                summoner2Id,
                perks,

                win,
                kills,
                deaths,
                assists,

                championId,
                championName,
                champLevel
            } = participantInfo
            const creepScore = (totalMinionsKilled || 0) + (neutralMinionsKilled || 0)

            const items = [
                item0,
                item1,
                item2,
                item3,
                item4,
                item5,
                item6
            ]
    
            const summonerItems = await getSummonerItemImages(rAPI, items)

            const spells = [
                summoner1Id,
                summoner2Id
            ]

            const summonerSpells = await getSummonerSpells(spells)
            const summonerPerks = await getSummonerPerks(perks)
    
            return {
                gameDuration,
                gameWon: win,
                kills,
                deaths,
                assists,
                championId,
                championName,
                championLevel: champLevel,
                championImage: `http://ddragon.leagueoflegends.com/cdn/13.1.1/img/champion/${championName}.png`,
                creepScore,
                creepScorePerMinute: calculateCreepScorePerMinute(gameDuration, creepScore),
                summonerItems,
                summonerSpells,
                summonerPerks
            }
        } else {
            res.status(403).json({error: 'Summoner not found'})
        }
    })).then((values) => {
        return values;
    })

    return matches;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
    const {summonerName} = req.query;

    const rAPI = new RiotAPI(process.env.LEAGUE_API_KEY || '');

    if (typeof summonerName === 'string') {
        const {puuid, name} = await rAPI.summoner.getBySummonerName({
            summonerName,
            region: PlatformId.NA1
        })

        const matchIds = await rAPI.matchV5.getIdsbyPuuid({
            puuid,
            cluster: PlatformId.AMERICAS,
            params: {
                count: 5
            }
        });

        const matches = await getMatchesByIds(rAPI, matchIds, puuid, res)
    
      res.status(200).json({ summonerData: {
        summonerName: name,
        matches
      } })
    }
}
