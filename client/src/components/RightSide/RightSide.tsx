import React from 'react'
import Box from '@mui/material/Box'
import styles from './RightSide.module.css'
import { useAuthContext } from '../../context/AuthContext'
import { Avatar, IconButton, List, ListItem, ListItemAvatar, ListItemText, Switch, Typography } from '@mui/material'
import { useGetAllUsers } from '../../hooks/api/useGetAllUsers'
import { useGetHistoryBets } from '../../hooks/api/useGetHistoryBets'
import { useChangeUserSettings } from '../../hooks/api/useChangeUserSettings'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty'
const RightSide = () => {
	const { user } = useAuthContext()
	const { response: users } = useGetAllUsers()
	const { response: bets } = useGetHistoryBets()
	const { role } = user
	const { changePlayInGameHandler } = useChangeUserSettings()

	return (
		<Box
			className={styles.mainWrap}
			sx={{
				p: 4,
				height: '100%',
				width: 400,
				backgroundColor: 'secondary.light',
				flexShrink: 0,
				display: 'flex',
				flexDirection: 'column',
			}}
		>
			<Box
				sx={{
					boxShadow: '0 2px 4px rgba(0, 0, 0, .2)',
					display: 'flex',
					flexDirection: 'column',
					mb: 4,
					maxHeight: 'calc(50% - 16px)',
				}}
			>
				<Typography sx={{ fontSize: 22, pl: 2, pt: 2 }}>Участники</Typography>
				<List sx={{ overflowY: 'scroll' }}>
					{[...users]
						.sort((a, b) => b.coins - a.coins)
						.map((item: any) => {
							return (
								<ListItem key={item.name}>
									<ListItemAvatar>
										<Avatar alt={item.name} src={item.avatar ? item.avatar : ''} />
									</ListItemAvatar>
									<ListItemText primary={item.name} />
									<Switch
										disabled={role !== 'ADMIN'}
										onChange={() => changePlayInGameHandler({ id: item.id, playInGame: !item.playInGame })}
										checked={item.playInGame}
										color='warning'
									/>
								</ListItem>
							)
						})}
				</List>
			</Box>

			<Box
				sx={{
					boxShadow: '0 2px 4px rgba(0, 0, 0, .2)',
					display: 'flex',
					flexDirection: 'column',
					maxHeight: 'calc(50% - 16px)',
					mb: 4,
				}}
			>
				<Typography sx={{ fontSize: 22, pl: 2, pt: 2 }}>История ставок</Typography>
				<List sx={{ overflowY: 'scroll' }}>
					{bets.map((item: any) => {
						return (
							<ListItem
								key={item._id}
								secondaryAction={
									<IconButton edge='end' aria-label='comments'>
										{item.win === null ? (
											<HourglassEmptyIcon />
										) : item.win ? (
											<CheckCircleIcon color='success' />
										) : (
											<ErrorOutlineIcon color='error' />
										)}
									</IconButton>
								}
							>
								<ListItemText primary={`${item.name} поставил на ${item.betNames.join(', ')} – ${item.coins} монет`} />
							</ListItem>
						)
					})}
				</List>
			</Box>
		</Box>
	)
}

export default RightSide
