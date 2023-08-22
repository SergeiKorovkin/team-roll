import { useAuthContext } from '../../context/AuthContext'
import { endpoints } from '../../consts/endpoints'
import { useMutation } from 'react-query'
import { useCallback } from 'react'
import { useApiConnector } from '../useApiConnector'

export interface IMutationFn {
	avatar: any
}

export const useUpdateAvatar = () => {
	const { updateUser } = useAuthContext()
	const apiConnector = useApiConnector()

	const { mutate, isLoading, error } = useMutation<unknown, any, IMutationFn>(
		({ avatar }: IMutationFn) => apiConnector(endpoints.updateAvatar, 'POST', { avatar }),
		{
			onSuccess: (data: any) => {
				updateUser(data)
			},
			onError: () => {
				console.log('error')
			},
		}
	)
	const updateUserHandler = useCallback(
		(avatar: any) => {
			mutate({ avatar })
		},
		[mutate]
	)

	return {
		updateUserHandler,
		isLoading,
		error,
	}
}
