import { useCallback, useEffect, useState } from 'react'

export interface IUseGenerateNumber {
	randomNumber: number
	rerollNumber: () => void
}

export const useGenerateNumber = (max: number): IUseGenerateNumber => {
	const min = Math.ceil(0)
	const maxFloor = Math.floor(max)
	const [randomNumber, setRandomNumber] = useState(0)

	useEffect(() => {
		setRandomNumber(Math.floor(Math.random() * (maxFloor - min + 1)) + min)
	}, [max])

	const rerollNumber = useCallback(() => {
		setRandomNumber(Math.floor(Math.random() * (maxFloor - min + 1)) + min)
	}, [max])

	return { randomNumber, rerollNumber }
}
