import { useCallback, useEffect, useState } from 'react'

const storageName = 'userData'

export interface IUseAuth {
	login: (userData: IData) => void
	logout: () => void
	token: string
	user: IUser
	updateUser: (userData: IUser) => void
	data: IData | null
	isAuthenticated: boolean
}

interface IData {
	token: string
	user: IUser
}

export interface IUser {
	avatar: string
	id: string
	name: string
	coins: number
	role: 'USER' | 'ADMIN'
}

export const useAuth = (): IUseAuth => {
	const [token, setToken] = useState('')
	const [data, setData] = useState<IData | null>(null)
	const [user, setUser] = useState<any | null>(null)

	const login = useCallback((userData: IData) => {
		setToken(userData.token)
		setData(userData)
		setUser(userData.user)
		localStorage.setItem(
			storageName,
			JSON.stringify({
				...userData,
			})
		)
	}, [])

	useEffect(() => {
		const localData = localStorage.getItem(storageName)
		const data = localData ? JSON.parse(localData) : null
		if (data && data.token) {
			login(data)
		}
	}, [login])

	useEffect(() => {
		const localData = localStorage.getItem(storageName)
		const data = localData ? JSON.parse(localData) : null
		if (data) {
			data.user = user
			localStorage.setItem(
				storageName,
				JSON.stringify({
					...data,
				})
			)
		}
	}, [user])

	const updateUser = useCallback((updateData: IUser) => {
		setUser((prevState: IUser) => ({ ...prevState, ...updateData }))
	}, [])

	const logout = useCallback(() => {
		setToken('')
		setData(null)
		localStorage.removeItem(storageName)
	}, [])

	const isAuthenticated = !!token

	return { login, user, updateUser, logout, token, data, isAuthenticated }
}
