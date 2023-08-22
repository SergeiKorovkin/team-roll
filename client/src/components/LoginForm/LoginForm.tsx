import React from 'react'
import { Button, TextField, Typography } from '@mui/material'
import Box from '@mui/material/Box'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useLogin } from '../../hooks/api/useLogin'

const LoginSchema = yup
	.object({
		email: yup.string().email().required(),
		password: yup.string().min(6).required(),
	})
	.required()

const LoginForm = () => {
	const {
		register,
		handleSubmit,
		setError,
		formState: { errors },
	} = useForm({ resolver: yupResolver(LoginSchema) })

	const { loginHandler, isLoading, error } = useLogin()
	const onSubmit = async (data: any) => {
		const { email, password } = data

		try {
			await loginHandler({ email, password })
		} catch (e: any) {
			setError('userExists', { type: 'custom', message: e.message || 'user exists' })
		}
	}

	return (
		<Box
			sx={{
				'display': 'flex',
				'p': 4,
				'flexDirection': 'column',
				'flex': '1 1 auto',
				'& > form': {
					display: 'flex',
					flexDirection: 'column',
					flex: '1 1 auto',
				},
			}}
		>
			<Typography sx={{ fontSize: 18 }} color='primary'>
				Авторизация
			</Typography>
			<form onSubmit={handleSubmit(onSubmit)}>
				<TextField
					{...register('email')}
					sx={{ mt: 2 }}
					fullWidth
					error={!!errors.email}
					helperText={errors.email ? (errors.email.message as React.ReactNode) : ''}
					type='email'
					label='Email'
				/>
				<TextField
					{...register('password')}
					sx={{ mt: 2 }}
					fullWidth
					error={!!errors.password}
					helperText={errors.password ? (errors.password.message as React.ReactNode) : ''}
					label='Пароль'
					type='password'
				/>
				{error && <Typography mt={1}>{error?.message}</Typography>}
				{errors.userExists && <Typography mt={1}>{errors.userExists.message as React.ReactNode}</Typography>}
				<Box sx={{ flex: '1 1 auto', display: 'flex', alignItems: 'end' }}>
					<Button
						type='submit'
						sx={{ mt: 4, mb: 4, minHeight: '50px' }}
						fullWidth
						disabled={isLoading}
						variant='contained'
					>
						Вход
					</Button>
				</Box>
			</form>
		</Box>
	)
}

export default LoginForm
