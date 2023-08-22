import { endpoints } from '../../consts/endpoints'
import { useMutation, useQueryClient } from 'react-query'
import { useCallback } from 'react'
import { useApiConnector } from '../useApiConnector'
import { USE_GET_ALL_USERS_QUERY_KEY } from './useGetAllUsers'

export interface IMutationFn {
	form: any
}

export const useChangeUserSettings = () => {
	const apiConnector = useApiConnector()
	const queryClient = useQueryClient()
	const { mutate, isLoading, isSuccess, error } = useMutation<unknown, any, IMutationFn>(
		({ form }: IMutationFn) => apiConnector(endpoints.allUsers, 'POST', { ...form }),
		{
			onSuccess: () => {
				queryClient.invalidateQueries([USE_GET_ALL_USERS_QUERY_KEY])
			},
			onError: () => {
				console.log('error')
			},
		}
	)
	const changePlayInGameHandler = useCallback(
		(form: any) => {
			mutate({ form })
		},
		[mutate]
	)

	return {
		changePlayInGameHandler,
		isLoading,
		isSuccess,
		error,
	}
}
