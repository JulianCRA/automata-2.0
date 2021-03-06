import React from 'react'

import { AutomataProvider } from './context/AutomataProvider'

import cx from 'classnames'

import Menu from './Menu'
import ConfigPanel from './ConfigPanel'
import Automaton from './Automaton'
import Description from './Description'

import styles from './Automata.module.css'

const Automata = () => {
	const mql = window.matchMedia('(max-width: 810px)')
	const [smallViewport, setSmallViewport] = React.useState(mql.matches)
	
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
			pp = 1
			l = menuRef.current.getBoundingClientRect().width
		}else if(p === 0){
			pp = 0
			l = 0
		}else if(p === 2){
			pp = 2
			l = ac.current.getBoundingClientRect().width + menuRef.current.getBoundingClientRect().width
		}
		
//* TODO: Figure out polyfill for Safari */

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
						<div className = {styles.menuToggler} onClick = {() => moveContentTo(0)}>
							<label>Automata</label>
						</div>
						<div className = {styles.configToggler} onClick = {() => moveContentTo(2)}>
							<label>Config</label>
						</div>
						<div className = {styles.content} ref={ac}>
							<div className = {cx(styles.menuContainer, {[styles.small]: smallViewport } )} ref={menuRef}>
								<Menu small = {smallViewport}/>
							</div>
							<div className = {cx(styles.sketchContainer, {[styles.small]: smallViewport } )} >
								<Automaton />
							</div>
							<div className = {cx(styles.configPanelContainer, {[styles.small]: smallViewport } ) }>
								<ConfigPanel />
							</div>
						</div>
						<div className = {styles.description}>
							<Description small = {smallViewport}/>
						</div>
					</div> : 

					<div className = {styles.container}>
						<div className = {cx(styles.menuContainer, {[styles.small]: smallViewport } ) }>
							<Menu small = {smallViewport}/>
						</div>
						<div className = {cx(styles.configPanelContainer, {[styles.small]: smallViewport } ) }>
							<ConfigPanel />
						</div>
						<div className = {cx(styles.sketchContainer, {[styles.small]: smallViewport } ) }>
							<Automaton />
						</div>
						
						<div className = {styles.description}>
							<Description small = {smallViewport}/>
						</div>
					</div>
			}
			
		</AutomataProvider>
	)
}

export default Automata