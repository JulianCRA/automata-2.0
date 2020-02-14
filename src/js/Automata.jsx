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

	const ac = React.useRef()
	
	const menuRef = React.useRef()

	
	let pp = 0

	const moveContentTo = (p) => {
		let l
		if(p === pp){
			console.log("SKETCH")
			pp = 1
			l = menuRef.current.getBoundingClientRect().width
		}else if(p === 0){
			console.log("MENU")
			pp = 0
			l = 0
		}else if(p === 2){
			console.log("CONFIG")
			pp = 2
			l = ac.current.getBoundingClientRect().width + menuRef.current.getBoundingClientRect().width
		}
		console.log(ac.current);
		ac.current.scrollTo({
			left: l,
			top:0,
			behavior:"smooth"
		})
	}

	return (
		<AutomataProvider>
			{
				smallViewport ?
					<div className = {cx(styles.container, {[styles.small]: smallViewport } ) }>
						<div className = {styles.menuToggler} onClick = {() => moveContentTo(0)}>MENU</div>
						<div className = {styles.configToggler} onClick = {() => moveContentTo(2)}>CONFIG</div>
						<div className = {styles.content} ref={ac}>
							<div className = {cx(styles.menuContainer, {[styles.small]: smallViewport } )} ref={menuRef}>
								<Menu small = {smallViewport}/>
							</div>
							<div className = {cx(styles.sketchContainer, {[styles.small]: smallViewport } )} >

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