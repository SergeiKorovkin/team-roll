import React from 'react'
import Box from '@mui/material/Box'
import { useAuthContext } from '../../context/AuthContext'
import { Roll } from '../Roll'
import { Bets } from '../Bets'

const Main = () => {
	const { user } = useAuthContext()
	const { role } = user
	console.log('role', role)

	return (
		<Box
			sx={{
				height: '100%',
				backgroundColor: 'secondary.main',
				flex: ' 1 1 auto',
				display: 'flex',
				flexDirection: 'column',
			}}
		>
			<Roll />
			<Bets />
		</Box>
	)
}

export default Main
