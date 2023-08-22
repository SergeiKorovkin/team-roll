import React, { useState } from 'react'
import Box from '@mui/material/Box'
import { useAuthContext } from '../../context/AuthContext'
import { useGetAllUsers } from '../../hooks/api/useGetAllUsers'

import { Card, Button, Modal, CardMedia, CardContent, Typography, CardActions } from '@mui/material'
import { useGenerateNumber } from '../../hooks/useGenerateNumber'
import { useCloseBet } from '../../hooks/api/useCloseBet'
import { Wheel } from 'react-custom-roulette'

const Roll = () => {
	const { user } = useAuthContext()
	const { response: users } = useGetAllUsers()
	const usersPlay = users.filter(({ playInGame }: any) => playInGame)
	const { randomNumber, rerollNumber } = useGenerateNumber(usersPlay.length - 1)
	const { closeBet } = useCloseBet()
	const { role } = user
	const [startRoll, setStartRoll] = useState(false)
	const [openModal, setOpenModal] = useState(false)

	return (
		<Box
			sx={{
				backgroundColor: 'secondary.main',
				height: '100%',
				flex: ' 1 1 auto',
				justifyContent: 'end',
				display: 'flex',
				alignItems: 'center',
				flexDirection: 'column',
			}}
		>
			{!!usersPlay.length && (
				<Wheel
					mustStartSpinning={startRoll}
					prizeNumber={randomNumber}
					data={usersPlay.map((item: any) => ({
						option: item.name,
					}))}
					onStopSpinning={() => {
						setStartRoll(false)
						setOpenModal(true)
					}}
					fontSize={16}
					backgroundColors={['#FF5733', '#5733FF', '#FF33A1', '#33D2FF', '#FFD633']}
					textColors={['#ffffff']}
				/>
			)}
			{role === 'ADMIN' && (
				<Button
					onClick={() => setStartRoll(true)}
					variant='contained'
					size='large'
					sx={{ marginLeft: '15px', width: '170px' }}
				>
					Крутить
				</Button>
			)}
			<Modal
				open={openModal}
				onClose={() => {
					setOpenModal(false)
				}}
				closeAfterTransition
			>
				<Card
					sx={{
						position: 'absolute',
						top: '50%',
						left: '50%',
						transform: 'translate(-50%, -50%)',
						width: 500,
						bgcolor: 'background.paper',
						boxShadow: 24,
						p: 4,
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
					}}
				>
					<CardMedia
						sx={{ height: 436, width: 436, margin: '0 auto' }}
						component='img'
						alt='image'
						image={usersPlay[randomNumber]?.avatar ? usersPlay[randomNumber]?.avatar : '/assets/ironman-ava.webp'}
					/>
					<CardContent>
						<Typography gutterBottom variant='h5' component='div'>
							{usersPlay[randomNumber]?.name}
						</Typography>
					</CardContent>
					<CardActions>
						<Button
							onClick={() => {
								setOpenModal(false)
								rerollNumber()
								setStartRoll(true)
							}}
							variant='outlined'
							color='error'
						>
							Рерол
						</Button>
						<Button
							onClick={() => {
								closeBet({
									winUser: usersPlay[randomNumber]?.name,
								})
								setOpenModal(false)
								rerollNumber()
							}}
							variant='contained'
							color='success'
						>
							Подтвердить
						</Button>
					</CardActions>
				</Card>
			</Modal>
		</Box>
	)
}

export default Roll
