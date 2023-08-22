import React, { FC, memo } from 'react'
import { Typography } from '@mui/material'

interface IProps {
	title: string
}

const Title: FC<IProps> = ({ title }) => {
	return (
		<Typography sx={{ fontSize: 18 }} color='primary.contrastText'>
			{title}
		</Typography>
	)
}

export default memo(Title)
