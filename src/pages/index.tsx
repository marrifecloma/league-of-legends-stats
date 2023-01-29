import Head from 'next/head'

import { Box, Button, Grid, InputAdornment, TextField, ThemeProvider, CircularProgress, Typography } from '@mui/material';

import {theme} from './theme/theme'
import { AccountCircle } from '@mui/icons-material';

import useSWR from 'swr';
import * as React from 'react'
import MatchHistory from './match/matchHistory';

export default function Home() {
  const [name, setName] = React.useState('')
  const [shouldFetch, setShouldFetch] = React.useState(false)

  const fetchWithName = (url: string, summonerName: string) => fetch(`${url}?summonerName=${summonerName}`).then((r) => r.json());
  const {data, error} = useSWR(
    shouldFetch ? [`/api/getSummoner`, name] : null, ([url, summonerName]) => fetchWithName(url, summonerName)
  );

  const summonerNameRef = React.createRef();

  const onSearchClick = () => {
    const nameRef = summonerNameRef.current as any;
    const nameValue = nameRef.value || '';

    if (nameValue !== '') {  
      setName(nameValue)
      setShouldFetch(true)
    } else {
      setName('')
      setShouldFetch(false)
    }
  }

  const clear = () => {
    const nameRef = summonerNameRef.current as any;

    setName('')
    setShouldFetch(false)
    nameRef.value = ''
  }

  return (
    <>
      <Head>
        <title>League of Legends Stats</title>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ThemeProvider theme={theme}>
      <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        style={{ minHeight: '100vh' }}
      >
        <Grid item xs={6}>
          <Box sx={{ '& > :not(style)': { m: 1 } }}>
            <TextField
              id="summonerName"
              label="Summoner name"
              inputRef={summonerNameRef}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AccountCircle />
                  </InputAdornment>
                ),
              }}
              variant="standard"
            />
            <Button
              variant="contained"
              onClick={onSearchClick}
            >
              Search
            </Button>
            <Button
              variant="contained"
              onClick={clear}
            >
              Clear
            </Button>
          </Box>
        </Grid>
        <Grid item xs={6}>
          {
            (error)
              ? (
                <Typography variant="subtitle1" align="center">{`No info found`}</Typography>
              )
              : null
          }
          {
            (data)
              ? <MatchHistory summonerData={data.summonerData} />
              : null
          }
        </Grid>
      </Grid> 
      </ThemeProvider>
    </>
  )
}
