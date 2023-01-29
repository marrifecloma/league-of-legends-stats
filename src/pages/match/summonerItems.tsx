import { Avatar, ImageList, ImageListItem } from '@mui/material';
import * as React from 'react'

interface Props {
    summonerItems: any
}

export default function SummonerItems({summonerItems}: Props) {
  return (
    <ImageList>
        {summonerItems.map((item: any) => {
            return (item)
                ? (
                    <ImageListItem>
                        <Avatar
                            variant="square"
                            src={item.image}
                            alt={item.name}
                        />
                    </ImageListItem>
                )
                : (
                    <ImageListItem>
                        <Avatar variant="square" sx={{ bgColor: "#1C2833"}}>{' '}</Avatar>
                    </ImageListItem>
                )
        })}
    </ImageList>
  )
}
