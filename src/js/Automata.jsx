import React from 'react'

import { AutomataProvider } from './context/AutomataProvider'

import cx from 'classnames'

import Menu from './Menu'
import ConfigPanel from './ConfigPanel'

import styles from './Automata.module.css'

const Automata = () => {
	const mql = window.matchMedia('(max-width: 760px)')
	const [smallViewport, setSmallViewport] = React.useState(mql.matches)
	
	console.log('mql :', mql)
	React.useEffect(
		() => {
			mql.onchange = () => setSmallViewport(mql.matches)
			console.log('mql :', mql)
			return(
				()=>{
					mql.onchange - null
				}
			)
		},
		[]
	)

	const move = (p) => {
		console.log("move to ", p)
	}

	return (
		<AutomataProvider>
			{
				smallViewport ?
					<div className = {cx(styles.container, {[styles.small]: smallViewport } ) }>
						<div className = {styles.menuToggler} onclick="move(0)">MENU</div>
						<div className = {styles.configToggler} onclick="move(2)">CONFIG</div>
						<div className = {styles.content} id="content">
							<div className = {cx(styles.menuContainer, {[styles.small]: smallViewport } ) }>
								<Menu small = {smallViewport}/>
							</div>
							<div className = {cx(styles.sketchContainer, {[styles.small]: smallViewport } ) }>

							</div>
							<div className = {cx(styles.configPanelContainer, {[styles.small]: smallViewport } ) }>
								<ConfigPanel />
							</div>
						</div>
						<div className = {styles.description}></div>
					</div> : 

					<div className = {styles.container}>
						<div className = {cx(styles.menuContainer, {[styles.small]: smallViewport } ) }>
							<Menu small = {smallViewport}/>
						</div>
						<div className = {cx(styles.sketchContainer, {[styles.small]: smallViewport } ) }>

						</div>
						<div className = {cx(styles.configPanelContainer, {[styles.small]: smallViewport } ) }>
							<ConfigPanel />
						</div>
						<div className = {styles.description}></div>
					</div>
			}
			
		</AutomataProvider>
	)
}

export default Automata