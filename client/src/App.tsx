import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import Box from '@mui/material/Box'

import { useAuthContext } from './context/AuthContext'
import { useRoutes } from './routes'
import { useWindowSizeContext } from './context/WindowSizeContext'

const App = () => {
	const { isAuthenticated } = useAuthContext()
	const { height } = useWindowSizeContext()
	const routes = useRoutes(isAuthenticated)

	return (
		<Box
			sx={{
				display: 'flex',
				width: '100%',
				maxWidth: '100%',
				margin: 0,
				flexDirection: 'column',
				height: height + 'px',
				backgroundColor: 'secondary.main',
				padding: '0px',
			}}
		>
			<BrowserRouter>
				<Box sx={{ width: '100%', flex: '1 1 auto', height: '100%', display: 'flex' }}>{routes}</Box>
			</BrowserRouter>
		</Box>
	)
}

export default App
