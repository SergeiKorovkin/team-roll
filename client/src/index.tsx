import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { WindowSizeContextProvider } from './context/WindowSizeContext'
import { AuthContextProvider } from './context/AuthContext'
import './index.css'
import {QueryClient, QueryClientProvider} from "react-query";
import {ReactQueryDevtools} from "react-query/devtools";

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			refetchOnWindowFocus: false,
			retry: false,
		},
	},
})

const theme = createTheme({
	palette: {
		primary: {
			light: '#6AB7FF',
			main: '#1E88E5',
			dark: '#155A8A',
			contrastText: '#ffffff',
		},
		secondary: {
			light: '#FFFFFF',
			main: '#F5F5F5',
			dark: '#E0E0E0',
			contrastText: '#000000', // You may want to use a dark color for contrast text
		},
		success: {
			light: '#76D275',
			main: '#43A047',
			dark: '#2E7031',
			contrastText: '#ffffff',
		},
		common: {
			black: '#000000',
			white: '#ffffff',
		},
	},
})

root.render(
	<QueryClientProvider client={queryClient}>
		<ThemeProvider theme={theme}>
			<AuthContextProvider>
				<WindowSizeContextProvider>
					<App />
				</WindowSizeContextProvider>
			</AuthContextProvider>
		</ThemeProvider>
		<ReactQueryDevtools initialIsOpen={false} />
	</QueryClientProvider>
)
