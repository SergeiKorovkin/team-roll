import { endpoints } from '../../consts/endpoints'
import { useMutation, useQueryClient } from 'react-query'
import { useCallback } from 'react'
import { useApiConnector } from '../useApiConnector'
import { USE_GET_ALL_USERS_QUERY_KEY } from './useGetAllUsers'
import { USE_GET_ALL_BETS_QUERY_KEY } from './useGetHistoryBets'

export interface IMutationFn {
	form: any
}

export const useCloseBet = () => {
	const apiConnector = useApiConnector()
	const queryClient = useQueryClient()
	const { mutate, isLoading, isSuccess, error } = useMutation<unknown, any, IMutationFn>(
		({ form }: IMutationFn) => apiConnector(endpoints.closeBet, 'POST', { ...form }),
		{
			onSuccess: () => {
				queryClient.invalidateQueries([USE_GET_ALL_USERS_QUERY_KEY])
				queryClient.invalidateQueries([USE_GET_ALL_BETS_QUERY_KEY])
			},
			onError: () => {
				console.log('error')
			},
		}
	)
	const closeBet = useCallback(
		(form: any) => {
			mutate({ form })
		},
		[mutate]
	)

	return {
		closeBet,
		isLoading,
		isSuccess,
		error,
	}
}
