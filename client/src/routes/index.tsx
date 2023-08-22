import React from 'react'
import { Route, Routes } from 'react-router-dom'
import { AuthPage } from '../pages/AuthPage'
import { HomePage } from '../pages/HomePage'

export const useRoutes = (isAuthenticated: boolean) => {
	if (isAuthenticated) {
		return (
			<Routes>
				<Route path='/' element={<HomePage />} />
				<Route path='/auth' element={<AuthPage />} />
			</Routes>
		)
	}
	return (
		<Routes>
			<Route path='*' element={<AuthPage />} />
		</Routes>
	)
}
