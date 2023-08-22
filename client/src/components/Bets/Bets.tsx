import React from 'react'
import Box from '@mui/material/Box'
import { Typography } from '@mui/material'
import OneToManyBet from '../OneToManyBet/OneToManyBet'
import OneToTwoBet from '../OneTwoBet/OneToTwoBet'
import { useGetAllUsers } from '../../hooks/api/useGetAllUsers'

const Bets = () => {
	const { response: users } = useGetAllUsers()
	const playUsers = users?.filter(({ playInGame }: any) => playInGame)
	return (
		<Box
			sx={{
				height: '100%',
				backgroundColor: 'secondary.main',
				flex: ' 1 1 auto',
				display: 'flex',
				flexDirection: 'column',
				p: 4,
			}}
		>
			<Typography sx={{ fontSize: 22 }}> Ставка на одного 1 к {playUsers.length}</Typography>
			<OneToManyBet />
			<Typography sx={{ fontSize: 22, mt: 4 }}>Ставка 1 к 2 Выбери половину </Typography>
			<OneToTwoBet />
		</Box>
	)
}

export default Bets
