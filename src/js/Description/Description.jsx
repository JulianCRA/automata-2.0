import React from 'react'

import { automataContext } from '../context/AutomataProvider'

import styles from './Description.module.css'

const Description = () => {
	const { settings, updateSettings } = React.useContext(automataContext)

	return(
		<p>
			{settings.description}
		</p>
	)
}

export default Description