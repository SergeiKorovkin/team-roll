import React, { ChangeEvent, useCallback, useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import {
	Alert,
	Button,
	Checkbox,
	Grid,
	List,
	ListItem,
	ListItemIcon,
	ListItemText,
	Paper,
	TextField,
	Typography,
} from '@mui/material'
import { useAuthContext } from '../../context/AuthContext'
import { useAddBet } from '../../hooks/api/useAddBet'
import { useGetAllUsers } from '../../hooks/api/useGetAllUsers'

function not(a: string[], b: string[]) {
	return a.filter((value) => !b.includes(value))
}

function intersection(a: string[], b: readonly string[]) {
	return a.filter((name) => b.includes(name))
}

const OneToTwoBet = () => {
	const { user } = useAuthContext()
	const { response: users } = useGetAllUsers()
	const { addBetHandler, isLoading } = useAddBet()

	const [isNotEnough, setIsNotEnough] = useState<boolean>(false)
	const [isInvalidData, setIsInvalidData] = useState<boolean>(false)
	const [errorUsers, setErrorUsers] = useState(false)
	const [oneToTwoCoins, setOneToTwoCoins] = useState<number | ''>('')

	const [checked, setChecked] = React.useState<string[]>([])
	const [left, setLeft] = React.useState<string[]>([])
	const [right, setRight] = React.useState<string[]>([])

	const leftChecked = intersection(checked, left)
	const rightChecked = intersection(checked, right)

	const activeUsers = users
		.filter(({ playInGame }: any) => playInGame)
		.map(({ name, avatar }: any) => ({ name, avatar }))

	useEffect(() => {
		if (users) setLeft(users.filter(({ playInGame }: any) => playInGame).map(({ name }: any) => name))
	}, [users])

	const handleToggle = (value: string) => () => {
		const currentIndex = checked.indexOf(value)
		const newChecked = [...checked]
		if (currentIndex === -1) {
			newChecked.push(value)
		} else {
			newChecked.splice(currentIndex, 1)
		}
		setChecked(newChecked)
	}
	const handleCheckedRight = () => {
		setRight(right.concat(leftChecked))
		setLeft(not(left, leftChecked))
		setChecked(not(checked, leftChecked))
		setErrorUsers(false)
	}
	const handleCheckedLeft = () => {
		setLeft(left.concat(rightChecked))
		setRight(not(right, rightChecked))
		setChecked(not(checked, rightChecked))
	}

	const { coins } = user || {}
	const addOneToManyHandler = () => {
		setIsInvalidData(false)
		setErrorUsers(false)
		if (!oneToTwoCoins) setIsInvalidData(true)
		if (!right.length) return setErrorUsers(true)
		addBetHandler({
			coins: oneToTwoCoins,
			usersBet: right,
		})
		setOneToTwoCoins('')
		setLeft(users.filter(({ playInGame }: any) => playInGame).map(({ name }: any) => name))
		setRight([])
	}
	const changeUserBet = useCallback(
		(e: ChangeEvent<HTMLInputElement>): void => {
			setIsInvalidData(false)
			setIsNotEnough(false)

			if ((+e.target.value < 0 && e.target.value !== null) || e.target.value === '') {
				setIsInvalidData(true)
				setOneToTwoCoins('')
				return
			}
			if (+e.target.value === 0) setIsInvalidData(true)
			if (+e.target.value > coins) setIsNotEnough(true)
			setOneToTwoCoins(+e.target.value)
		},
		[setOneToTwoCoins, setIsInvalidData, setIsNotEnough, coins]
	)

	const playUsers = users?.filter(({ playInGame }: any) => playInGame)
	const customList = (items: string[]) => (
		<Paper sx={{ width: 200, height: 230, overflow: 'auto' }}>
			<List dense component='div' role='list'>
				{items.map((name: string) => {
					return (
						<ListItem key={name} role='listitem' onClick={handleToggle(name)}>
							<ListItemIcon>
								<Checkbox checked={checked.includes(name)} />
							</ListItemIcon>
							<ListItemText id={name} primary={name} />
						</ListItem>
					)
				})}
			</List>
		</Paper>
	)

	return (
		<Box sx={{ display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'start' }}>
			<Grid container justifyContent='start' alignItems='start'>
				<Grid>{customList(left)}</Grid>
				<Grid sx={{ m: 2 }}>
					<Grid container direction='column' alignItems='center'>
						<Typography sx={{ fontSize: 14 }}>
							{right.length} / {Math.ceil(activeUsers.length / 2)}
						</Typography>
						<Button
							sx={{ my: 0.5 }}
							variant='outlined'
							size='small'
							onClick={handleCheckedRight}
							disabled={
								leftChecked.length === 0 || leftChecked.length > Math.ceil(activeUsers.length / 2) - right.length
							}
						>
							&gt;
						</Button>
						<Button
							sx={{ my: 0.5 }}
							variant='outlined'
							size='small'
							onClick={handleCheckedLeft}
							disabled={rightChecked.length === 0}
						>
							&lt;
						</Button>
					</Grid>
				</Grid>
				<Grid>
					{customList(right)}
					{errorUsers && <Alert severity='error'>Добавь людей</Alert>}
				</Grid>
			</Grid>
			<Box sx={{ ml: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '400px' }}>
				<TextField
					sx={{ minWidth: '166px' }}
					required
					type='number'
					label={(isNotEnough && 'Недостаточно монет') || (isInvalidData && 'Недопустимое значение') || 'Размер ставки'}
					variant='outlined'
					value={oneToTwoCoins}
					onChange={changeUserBet}
					error={isInvalidData}
				/>
				<Button
					onClick={addOneToManyHandler}
					variant='contained'
					size='large'
					sx={{ marginLeft: '15px', width: '170px' }}
					disabled={isInvalidData || isNotEnough || isLoading || playUsers.length <= 1}
				>
					Поставить
				</Button>
			</Box>
		</Box>
	)
}

export default OneToTwoBet
