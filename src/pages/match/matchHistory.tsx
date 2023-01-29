import { Box, Paper, styled, Typography } from '@mui/material';
import { Stack } from '@mui/system';
import * as React from 'react'
import MatchBox from './matchBox';

interface Props {
    summonerData: any
}

const Item = styled(Paper)(({ theme }) => ({
    ...theme.typography.body2,
    textAlign: 'center',
    color: theme.palette.text.secondary,
  }));

export default function MatchHistory({summonerData}: Props) {
    const matches = (summonerData.matches.length > 0)
        ? (
            summonerData.matches.map((match: any, index: number) => {
                return (
                    <MatchBox matchHistory={match} key={`match-${index}`} />
                )
            })
        )
        : <Typography variant="subtitle1" align="center">{`No matches found for ${summonerData.summonerName}`}</Typography>
  return (
    <>
        <Typography variant="h2">{`Match History: ${summonerData.summonerName}`}</Typography>
        <Stack spacing={2}>
            {matches}
        </Stack>
    </>
  )
}
