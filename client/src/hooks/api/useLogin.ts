import { useAuthContext } from '../../context/AuthContext'
import { endpoints } from '../../consts/endpoints'
import { useMutation } from 'react-query'
import { useCallback } from 'react'
import { useApiConnector } from '../useApiConnector'

export interface IMutationFn {
	form: any
}

export const useLogin = () => {
	const { login } = useAuthContext()
	const apiConnector = useApiConnector()

	const { mutate, isLoading, error } = useMutation<unknown, any, IMutationFn>(
		({ form }: IMutationFn) => apiConnector(endpoints.login, 'POST', { ...form }),
		{
			onSuccess: (data: any) => {
				login(data)
			},
			onError: () => {
				console.log('error')
			},
		}
	)
	const loginHandler = useCallback(
		(form: any) => {
			mutate({ form })
		},
		[mutate]
	)

	return {
		loginHandler,
		isLoading,
		error,
	}
}
