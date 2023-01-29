import { Avatar, Badge, Box, Grid, Stack, styled, Typography } from '@mui/material';
import * as React from 'react'
import SummonerItems from './summonerItems';

interface Props {
    matchHistory: any
}

const Div = styled('div')(({ theme }) => ({
    ...theme.typography.button,
    padding: theme.spacing(1)
  }));

  const SmallAvatar = styled(Avatar)(({ theme }) => ({
    width: 22,
    height: 22,
    border: `2px solid ${theme.palette.background.paper}`,
    fontSize: 11
  }));

export default function MatchBox({matchHistory}: Props) {
  const backgroundColor = matchHistory.gameWon ? '#AFE1AF' : '#E34234'
  const gameWonText
    = matchHistory.gameWon ? (
        <Typography variant="body2" align="center" color={'#228B22'} sx={{fontWeight: 'bold'}}>
            Victory
        </Typography>
    ) : (
        <Typography variant="body2" align="center" color={"#880808"} sx={{fontWeight: 'bold'}}>
            Lose
        </Typography>
    )

  const gameDuration = Math.floor(matchHistory.gameDuration / 60) + ':' + ('0' + Math.floor(matchHistory.gameDuration % 60)).slice(-2);

  const kdaRatio = ((matchHistory.kills + matchHistory.assists) / matchHistory.deaths).toFixed(2)

  return (
    <Box style={{ backgroundColor }}>
        <Grid container padding={1} spacing={12}>
            <Grid item justifyContent={"center"} alignContent={"center"}>
                <Grid container padding={1}>
                <Grid item sx={{ marginRight: 2}}>
                    <Badge
                        overlap="circular"
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                        badgeContent={
                            <SmallAvatar>{matchHistory.championLevel}</SmallAvatar>
                        }
                    >
                        <Avatar
                            alt={matchHistory.championName}
                            src={matchHistory.championImage}
                            sx={{ width: 80, height: 80 }}
                        />
                    </Badge>
                    <Typography variant="h6" align="center">
                        {matchHistory.championName}
                    </Typography>
                    <Div>{gameWonText}</Div>
                    <Typography variant="body2" align="center">
                        {gameDuration}
                    </Typography>
                </Grid>
                <Grid item>
                    <Stack>
                        {matchHistory.summonerSpells.map((spell: any, index: number) => {
                            return (
                                <>
                                    <Avatar
                                        key={`spell-${index}`}
                                        variant="square"
                                        src={spell.image}
                                        title={spell.description}
                                    />
                                    <Typography variant="body2" align="center" color={"#A9A9A9"} fontSize={10}>
                                        {spell.name}
                                    </Typography>
                                </>
                            )
                        })}
                    </Stack>
                </Grid>
                </Grid>
            </Grid>
            <Grid item sx={{paddingLeft: 1}} xs={3}  justifyContent={"center"} alignContent={"center"}>
                <Typography align="center" fontSize={18}>
                    {`${matchHistory.kills} / ${matchHistory.deaths} / ${matchHistory.assists}`}
                </Typography>
                <Typography align="center" fontSize={14}>
                    {`${kdaRatio}:1 KDA`}
                </Typography>
                <br />
                <Typography align="center" fontSize={14}>
                    {`CS ${matchHistory.creepScore} (${(matchHistory.creepScorePerMinute).toFixed(1)})`}
                </Typography>
            </Grid>
            <Grid item sx={{paddingLeft: 1}}>
                <SummonerItems summonerItems={matchHistory.summonerItems} />
            </Grid>
        </Grid>
    </Box>
  )
}
