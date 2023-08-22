import { endpoints } from '../../consts/endpoints'
import { useMutation, useQueryClient } from 'react-query'
import { useCallback } from 'react'
import { useApiConnector } from '../useApiConnector'
import { USE_GET_ALL_BETS_QUERY_KEY } from './useGetHistoryBets'
import { USE_GET_ALL_USERS_QUERY_KEY } from './useGetAllUsers'
import { useAuthContext } from '../../context/AuthContext'
import { IUser } from '../useAuth'

export interface IMutationFn {
	form: any
}

export const useAddBet = () => {
	const apiConnector = useApiConnector()
	const queryClient = useQueryClient()
	const { updateUser } = useAuthContext()
	const { mutate, isLoading, isSuccess, error } = useMutation<IUser, any, IMutationFn>(
		({ form }: IMutationFn) => apiConnector(endpoints.addBets, 'POST', { ...form }),
		{
			onSuccess: (user: IUser) => {
				queryClient.invalidateQueries([USE_GET_ALL_BETS_QUERY_KEY])
				queryClient.invalidateQueries([USE_GET_ALL_USERS_QUERY_KEY])
				updateUser(user)
			},
			onError: () => {
				console.log('error')
			},
		}
	)
	const addBetHandler = useCallback(
		(form: any) => {
			mutate({ form })
		},
		[mutate]
	)

	return {
		addBetHandler,
		isLoading,
		isSuccess,
		error,
	}
}
