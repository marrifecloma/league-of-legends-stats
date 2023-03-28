import { Avatar, Stack } from '@mui/material';
import * as React from 'react'

interface Props {
    summonerItems: any
}

export default function SummonerItems({summonerItems}: Props) {
  return (summonerItems) ? (
    <Stack direction="row" spacing={1} padding={2}>
        {summonerItems.map((item: any, index: number) => {
            const itemImage = (item)
                ? (
                    <Avatar
                        variant="square"
                        src={item.image}
                        alt={item.name}
                    />
                )
                : (
                    <Avatar variant="square" sx={{ bgColor: "#1C2833"}}>{' '}</Avatar>
                )
            return (
                <span key={`item-${index}`}>{itemImage}</span>
            )
        })}
    </Stack>
  ) : null
}
