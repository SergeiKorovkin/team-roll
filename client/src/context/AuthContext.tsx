import React, { createContext, FC, useContext } from 'react'
import { IUseAuth, useAuth } from '../hooks/useAuth'

export type TUseAuthContextProps = IUseAuth

const AuthContext = createContext<TUseAuthContextProps>({} as TUseAuthContextProps)

export function useAuthContext(): TUseAuthContextProps {
	const context = useContext(AuthContext)

	if (context === undefined) {
		throw new Error('useAuthContext must be used within the AuthContextProvider')
	}

	return context
}

interface AuthContextProviderProps {
	children: React.ReactNode
}

export const AuthContextProvider: FC<AuthContextProviderProps> = ({ children }) => {
	const contextValue = useAuth()

	return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
}
