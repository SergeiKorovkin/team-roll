import { endpoints } from '../../consts/endpoints'
import { useMutation, useQueryClient } from 'react-query'
import { useApiConnector } from '../useApiConnector'
import { useCallback } from 'react'
import { USE_GET_ALL_BETS_QUERY_KEY } from './useGetHistoryBets'
import { USE_GET_ALL_USERS_QUERY_KEY } from './useGetAllUsers'

export interface IUseDeleteBet {
	response: null
	isLoading: boolean
	error: string
	deleteBet: (id: string) => void
}
export interface IMutationFn {
	id: string
}

export const useDeleteBet = (): IUseDeleteBet => {
	const apiConnector = useApiConnector()
	const queryClient = useQueryClient()

	const {
		data: response = null,
		mutate,
		isLoading,
		error,
	} = useMutation<null, Error, IMutationFn>(
		({ id }: IMutationFn) => apiConnector(endpoints.deleteBet.replace(':id', id), 'DELETE'),
		{
			onSuccess: () => {
				queryClient.invalidateQueries([USE_GET_ALL_BETS_QUERY_KEY])
				queryClient.invalidateQueries([USE_GET_ALL_USERS_QUERY_KEY])
			},
		}
	)

	const deleteBet = useCallback(
		(id: string) => {
			mutate({ id })
		},
		[mutate]
	)

	return {
		response,
		isLoading,
		deleteBet,
		error: error?.message ?? 'Ошибка',
	}
}
