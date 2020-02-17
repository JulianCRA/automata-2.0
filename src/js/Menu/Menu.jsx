import React from 'react'
import cx from 'classnames'

import { automataContext } from '../context/AutomataProvider'

import styles from './Menu.module.css'

const Menu = ({small}) => {
	const { settings, updateSettings } = React.useContext(automataContext)
	const automataShorts = [
		{ title: 'Langton\'s Ant',		short: 'ant' },
		{ title: 'Conway\'s Life', 		short: 'life' },
		{ title: 'Forest fire', 		short: 'fire' },
		{ title: 'Belousov-Zhabotinsky', short: 'belousov' },
		{ title: 'Viral replication', 	short: 'viralrep' },
		{ title: 'D-L Aggregation', 	short: 'dlagg' },
		{ title: 'Flood fill', 			short: 'flood' },
	]
	const [ current, setCurrent ] = React.useState()
	return (
		<div className={styles.automataMenu}>
			<ul className={!small ? styles.row : styles.column}>
				{
					automataShorts.map(({title, short}) => (
						<li key = {short}>
							<button 
								className = {cx(
									styles.menuButton, 
									{
										[styles.current]: short === current
									}
								)}
								onClick = {
									() => {
										setCurrent(short)
										updateSettings({
											type: 'new-automaton', 
											automaton: short
										})
									}
								}
							>
								{title}
							</button>
						</li>
					))
				}
			</ul>
		</div>
	)
}

export default Menu
