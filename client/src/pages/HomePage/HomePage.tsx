import React from 'react'
import Box from '@mui/material/Box'
import { User } from '../../components/User'
import { RightSide } from '../../components/RightSide'
import { Main } from '../../components/Main'

const HomePage = () => {
	return (
		<Box
			sx={{
				display: 'flex',
				width: '100%',
				height: '100%',
				justifyContent: 'space-between',
			}}
		>
			<User />
			<Main />
			<RightSide />
		</Box>
	)
}

export default HomePage
