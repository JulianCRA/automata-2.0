import React from 'react'

import { AutomataProvider } from './context/AutomataProvider'

import cx from 'classnames'

import Menu from './Menu'
import ConfigPanel from './ConfigPanel'

import styles from './Automata.module.css'

const Automata = () => {
	const mql = window.matchMedia('(max-width: 760px)')
	const [smallViewport, setSmallViewport] = React.useState(mql.matches)
	
	const [position, setPosition] = React.useState(0)

	console.log('Render Automata')
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

	const ac = React.createRef()
		
	let pp = 0

	const moveContentTo = (p) => {
		if(p === pp){
			console.log("SKETCH")
			pp = 1
			// l = document.getElementById('uno').getBoundingClientRect().width
		}else if(p === 0){
			console.log("MENU")
			pp = 0
			// l = 0
		}else if(p === 2){
			console.log("CONFIG")
			pp = 2
			// l = document.getElementById('uno').getBoundingClientRect().width + document.getElementById('scrollable').getBoundingClientRect().width
		}
		console.log(ac.current);
		ac.current.scrollTo({
			left: 400 * pp,
			top:0,
			behavior:"smooth"
		})
	}

	// const moveContentTo = (p) => {
	// 	if(p === position){
	// 		console.log("SKETCH")
	// 		setPosition(1)
	// 		// l = document.getElementById('uno').getBoundingClientRect().width
	// 	}else if(p === 0){
	// 		console.log("MENU")
	// 		setPosition(0)
	// 		// l = 0
	// 	}else if(p === 2){
	// 		console.log("CONFIG")
	// 		setPosition(2)
	// 		// l = document.getElementById('uno').getBoundingClientRect().width + document.getElementById('scrollable').getBoundingClientRect().width
	// 	}

	// 	ac.current.scrollTo({
	// 		left: 200 * p,
	// 		top:0,
	// 		behavior:"smooth"
	// 	})
	// }

	return (
		<AutomataProvider>
			{
				smallViewport ?
					<div className = {cx(styles.container, {[styles.small]: smallViewport } ) }>
						<div className = {styles.menuToggler} onClick = {() => moveContentTo(0)}>MENU</div>
						<div className = {styles.configToggler} onClick = {() => moveContentTo(2)}>CONFIG</div>
						<div className = {styles.content} id = "automata-content"  ref={ac}>
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