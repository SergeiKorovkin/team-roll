import React, { ChangeEvent, useCallback, useState } from 'react'
import Box from '@mui/material/Box'
import { Button, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material'
import { useAuthContext } from '../../context/AuthContext'
import { useAddBet } from '../../hooks/api/useAddBet'
import { useGetAllUsers } from '../../hooks/api/useGetAllUsers'

const OneToManyBet = () => {
	const { user } = useAuthContext()
	const { response: users } = useGetAllUsers()
	const { addBetHandler, isLoading } = useAddBet()

	const [isNotEnough, setIsNotEnough] = useState<boolean>(false)
	const [isInvalidData, setIsInvalidData] = useState<boolean>(false)
	const [errorUser, setErrorUser] = useState(false)
	const [oneToManyCoins, setOneToManyCoins] = useState<number | ''>('')
	const [oneToManyUser, setOneToManyUser] = useState<string>('')

	const { coins } = user || {}
	const addOneToManyHandler = () => {
		setErrorUser(false)
		setIsInvalidData(false)
		if (!oneToManyUser) setErrorUser(true)
		if (!oneToManyCoins) return setIsInvalidData(true)
		addBetHandler({
			coins: oneToManyCoins,
			usersBet: [oneToManyUser],
		})
		setOneToManyUser('')
		setOneToManyCoins('')
	}

	const changeUserBet = useCallback(
		(e: ChangeEvent<HTMLInputElement>): void => {
			setIsInvalidData(false)
			setIsNotEnough(false)

			if ((+e.target.value < 0 && e.target.value !== null) || e.target.value === '') {
				setIsInvalidData(true)
				setOneToManyCoins('')
				return
			}
			if (+e.target.value === 0) setIsInvalidData(true)
			if (+e.target.value > coins) setIsNotEnough(true)
			setOneToManyCoins(+e.target.value)
		},
		[setOneToManyCoins, setIsInvalidData, setIsNotEnough, coins]
	)

	const playUsers = users?.filter(({ playInGame }: any) => playInGame)
	return (
		<Box sx={{ display: 'flex' }}>
			<FormControl error={errorUser} required fullWidth>
				<InputLabel id='demo-simple-select-label'>Имя</InputLabel>
				<Select
					value={oneToManyUser}
					label='Имя'
					onChange={(e) => {
						setErrorUser(false)
						setOneToManyUser(e.target.value)
					}}
				>
					{playUsers.map(({ name }: any) => {
						return (
							<MenuItem key={name} value={name}>
								{name}
							</MenuItem>
						)
					})}
				</Select>
			</FormControl>
			<Box sx={{ ml: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '400px' }}>
				<TextField
					sx={{ minWidth: '166px' }}
					required
					type='number'
					label={(isNotEnough && 'Недостаточно монет') || (isInvalidData && 'Недопустимое значение') || 'Размер ставки'}
					variant='outlined'
					value={oneToManyCoins}
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

export default OneToManyBet
