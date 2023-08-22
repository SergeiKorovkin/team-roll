import React, { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import styles from './User.module.css'
import { useAuthContext } from '../../context/AuthContext'
import {
	Alert,
	Avatar,
	Card,
	Button,
	CardActions,
	CardContent,
	CardMedia,
	Input,
	List,
	ListItem,
	ListItemAvatar,
	ListItemText,
	Typography,
} from '@mui/material'
import { useUpdateAvatar } from '../../hooks/api/useUpdateAvatar'
import { useGetAllUsers } from '../../hooks/api/useGetAllUsers'

const User = () => {
	const { user, logout } = useAuthContext()
	const { updateUserHandler, isLoading, error } = useUpdateAvatar()
	const { response: users } = useGetAllUsers()
	const [file, setFile] = useState<ArrayBuffer | string | null>(null)
	const { avatar, name, coins } = user

	useEffect(() => {
		if (file) {
			updateUserHandler(file)
		}
	}, [updateUserHandler, file])

	return (
		<Box
			className={styles.mainWrap}
			sx={{
				height: '100%',
				width: 400,
				backgroundColor: 'secondary.light',
				flexShrink: 0,
				display: 'flex',
				flexDirection: 'column',
				position: 'relative',
			}}
		>
			<Card
				sx={{
					p: 4,
					backgroundColor: 'primary.light',
					maxHeight: 350,
					height: '100%',
					overflow: 'visible',
				}}
			>
				<Button
					sx={{
						position: 'absolute',
						top: 10,
						left: 10,
					}}
					onClick={logout}
					variant='contained'
					color='error'
				>
					Выйти
				</Button>
				<CardMedia
					sx={{ height: 200, width: 200, borderRadius: '50%', margin: '0 auto' }}
					component='img'
					alt='image'
					image={avatar ? avatar : '/assets/ironman-ava.webp'}
				/>
				<CardContent>
					<Input
						sx={{ width: 105 }}
						disabled={isLoading}
						onChange={(e: any) => {
							const selectedFile = e.target.files[0]
							const reader = new FileReader()
							reader.onloadend = () => {
								setFile(reader.result)
							}
							if (selectedFile) reader.readAsDataURL(selectedFile)
						}}
						type='file'
						disableUnderline
						fullWidth={false}
					/>
					{error && <Alert severity='warning'>Файл слишком большой</Alert>}
					<Typography gutterBottom variant='h5' component='div'>
						{name}
					</Typography>
					<Typography variant='body2' color='text.secondary'>
						{coins} Монет
					</Typography>
				</CardContent>
				<CardActions sx={{ justifyContent: 'end' }}></CardActions>
			</Card>
			<Box
				sx={{
					boxShadow: '0 2px 4px rgba(0, 0, 0, .2)',
					display: 'flex',
					flexDirection: 'column',
					m: 4,
					mb: 2,
					height: 'calc(100% - 382px)',
				}}
			>
				<Typography sx={{ fontSize: 22, pt: 2, pl: 2 }}>Топ</Typography>
				<List sx={{ overflowY: 'scroll' }}>
					{[...users]
						.sort((a, b) => b.coins - a.coins)
						.map((item: any, index: number) => {
							return (
								<ListItem key={item.id}>
									<ListItemAvatar>
										<Avatar alt={item.name} src={item.avatar ? item.avatar : ''} />
									</ListItemAvatar>
									<ListItemText primary={`${index + 1}. ${item.name}`} secondary={item.coins} />
								</ListItem>
							)
						})}
				</List>
			</Box>
		</Box>
	)
}

export default User
