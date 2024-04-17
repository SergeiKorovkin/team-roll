import { endpoints } from '../../consts/endpoints'
import { useQuery } from 'react-query'
import { useApiConnector } from '../useApiConnector'

export interface IUseGetUsers {
	response: any | null
	isLoading: boolean
	isFetching: boolean
	error: string
}

export const USE_GET_ALL_BETS_QUERY_KEY = 'USE_GET_ALL_BETS_QUERY_KEY'

export const useGetHistoryBets = (): IUseGetUsers => {
	const apiConnector = useApiConnector()
	const {
		data = [],
		isLoading,
		isFetching,
		isError,
		error,
	} = useQuery<any, Error>([USE_GET_ALL_BETS_QUERY_KEY], () => apiConnector(endpoints.historyBets), {
		refetchInterval: 2000,
	})

	return {
		response: data,
		isLoading,
		isFetching,
		error: isError ? error?.message ?? 'Ошибка' : '',
	}
}
