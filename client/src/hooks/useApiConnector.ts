import { useAuthContext } from '../context/AuthContext'

export const useApiConnector = () => {
	const { token, logout } = useAuthContext()

	return async (url: string, method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET', body?: Record<string, any>) => {
		const headers: HeadersInit = {}

		if (body) {
			headers['Content-type'] = 'application/json'
		}

		if (token) {
			headers['Authorization'] = `Bearer ${token}`
		}

		const response = await fetch(url, {
			method,
			body: body ? JSON.stringify(body) : undefined,
			headers,
		})

		if (response.status === 401) {
			logout()
			throw new Error('Unauthorized')
		}

		// Handle other non-2xx status codes
		if (!response.ok) {
			const errorData = await response.json()
			throw new Error(errorData.message || 'An error occurred')
		}

		return response.json()
	}
}
