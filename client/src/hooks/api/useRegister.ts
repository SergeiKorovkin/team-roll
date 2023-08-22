import { endpoints } from '../../consts/endpoints'
import { useMutation } from 'react-query'
import { useCallback } from 'react'
import {useApiConnector} from "../useApiConnector";

export interface IMutationFn {
	form: any
}

export const useRegister = () => {
	const apiConnector = useApiConnector()

	const { mutate, isLoading } = useMutation<unknown, any, IMutationFn>(
		({ form }: IMutationFn) => apiConnector(endpoints.register, 'POST', { ...form }), // Pass token here
		{
			onSuccess: () => {
				console.log('register')
			},
			onError: () => {
				console.log('error')
			},
		}
	)

	const registerHandler = useCallback(
		(form: any) => {
			mutate({ form })
		},
		[mutate]
	)

	return {
		registerHandler,
		isLoading,
	}
}
