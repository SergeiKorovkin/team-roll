import React, { FC, memo } from 'react'
import { Box, CircularProgress, Paper } from '@mui/material'

interface IProps {
	backgroundColor?: string
}

const Loading: FC<IProps> = ({ backgroundColor }) => {
	return (
		<Box sx={{ width: '100%' }}>
			<Paper sx={{
				width: '100%',
				height: '100%',
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				backgroundColor: backgroundColor || 'transparent',
			}}>
				<CircularProgress disableShrink />
			</Paper>
		</Box>

	)
}

export default memo(Loading)
