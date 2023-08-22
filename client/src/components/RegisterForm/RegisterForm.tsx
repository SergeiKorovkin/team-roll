import React, { Dispatch, SetStateAction } from 'react'
import { Button, TextField, Typography } from '@mui/material'
import Box from '@mui/material/Box'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useRegister } from '../../hooks/api/useRegister'

interface IProps {
	setTab: Dispatch<SetStateAction<number>>
}

const RegisterSchema = yup
	.object({
		name: yup.string().min(3).required(),
		email: yup.string().email().required(),
		password: yup.string().min(6).required(),
		repeatPassword: yup.string().min(6).required(),
	})
	.required()

const RegisterForm = ({ setTab }: IProps) => {
	const {
		register,
		handleSubmit,
		setError,
		formState: { errors },
	} = useForm({
		resolver: yupResolver(RegisterSchema),
	})
	const { registerHandler, isLoading } = useRegister()

	const onSubmit = async (data: any) => {
		const { email, name, password, repeatPassword, surname } = data
		if (password !== repeatPassword) {
			return setError('repeatPassword', { type: 'custom', message: 'Passwords do not match' })
		}
		try {
			await registerHandler({ email, password, name, surname })
			setTab(0)
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
				Регистрация
			</Typography>
			<form onSubmit={handleSubmit(onSubmit)}>
				<TextField
					{...register('name')}
					sx={{ mt: 2 }}
					fullWidth
					error={!!errors.name}
					helperText={errors.name ? (errors.name.message as React.ReactNode) : ''}
					type='text'
					label='Имя и фамилия'
				/>
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
				<TextField
					{...register('repeatPassword')}
					sx={{ mt: 2 }}
					fullWidth
					error={!!errors.repeatPassword}
					helperText={errors.repeatPassword ? (errors.repeatPassword.message as React.ReactNode) : ''}
					label='Повторите пароль'
					type='password'
				/>
				{errors.userExists && (
					<Typography mt={1} color='secondary'>
						{errors.userExists.message as React.ReactNode}
					</Typography>
				)}
				<Box sx={{ flex: '1 1 auto', display: 'flex', alignItems: 'end' }}>
					<Button
						type='submit'
						sx={{ mt: 4, mb: 4, minHeight: '50px' }}
						fullWidth
						disabled={isLoading}
						variant='contained'
					>
						Зарегистрироваться
					</Button>
				</Box>
			</form>
		</Box>
	)
}

export default RegisterForm
