import { endpoints } from '../../consts/endpoints'
import { useQuery } from 'react-query'
import { useApiConnector } from '../useApiConnector'
import { useGetAllAvatars } from './useGetAllAvatars'
import { useEffect, useState } from 'react'
import { useAuthContext } from '../../context/AuthContext'

export interface IUseGetUsers {
	response: any | null
	isLoading: boolean
	isFetching: boolean
	error: string
}

export const USE_GET_ALL_USERS_QUERY_KEY = 'USE_GET_ALL_USERS_QUERY_KEY'

export const useGetAllUsers = (): IUseGetUsers => {
	const { response: avatars } = useGetAllAvatars()
	const apiConnector = useApiConnector()
	const { user: mainUser, updateUser, startRoll } = useAuthContext()

	const [users, setUsers] = useState<any[]>([])
	const {
		data = [],
		isLoading,
		isFetching,
		isError,
		error,
	} = useQuery<any, Error>([USE_GET_ALL_USERS_QUERY_KEY], () => apiConnector(endpoints.allUsers), {
		refetchInterval: 2000,
		enabled: !startRoll,
	})

	useEffect(() => {
		setUsers(
			data.map((user: any) => {
				if (mainUser.id === user.id) {
					updateUser(user)
				}
				const userAvatar = avatars.find((avatar: any) => avatar.id === user.id)
				return { ...user, ...userAvatar }
			})
		)
	}, [data, avatars])
	return {
		response: users,
		isLoading,
		isFetching,
		error: isError ? error?.message ?? 'Ошибка' : '',
	}
}
