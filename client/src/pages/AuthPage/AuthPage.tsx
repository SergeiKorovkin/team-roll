import React from 'react'
import { AppBar, Box, Tab, Tabs } from '@mui/material'
import { LoginForm } from '../../components/LoginForm'
import { RegisterForm } from '../../components/RegisterForm'

const AuthPage = () => {
	const [tab, setTab] = React.useState<number>(0)

	const handleChange = (event: React.SyntheticEvent, newValue: number) => setTab(newValue)

	return (
		<Box
			sx={{
				width: '100%',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				flexDirection: 'column',
				borderRadius: '5px',
			}}
		>
			<Box
				sx={{
					bgcolor: 'background.paper',
					width: '600px',
					display: 'flex',
					flex: '1 1 auto',
					maxHeight: '700px',
					borderTopLeftRadius: '15px',
					borderTopRightRadius: '15px',
					border: '2px solid primary.main',
				}}
			>
				{tab === 0 && <LoginForm />}
				{tab === 1 && <RegisterForm setTab={setTab} />}
			</Box>
			<AppBar position='static' sx={{ width: '600px' }}>
				<Tabs
					value={tab}
					onChange={handleChange}
					indicatorColor='secondary'
					textColor='inherit'
					variant='fullWidth'
					aria-label='full width tabs example'
				>
					<Tab label='Sing in' value={0} />
					<Tab label='Sing up' value={1} />
				</Tabs>
			</AppBar>
		</Box>
	)
}

export default AuthPage
