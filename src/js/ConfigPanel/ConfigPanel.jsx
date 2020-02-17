import React from 'react'

import Range from './ui/Range'
import Checkbox from './ui/Checkbox'

import { automataContext } from '../context/AutomataProvider'

import styles from './ConfigPanel.module.css'

const ConfigPanel = () => {
	const { settings, updateSettings } = React.useContext( automataContext )

	const update = (attribute, value) => {
		updateSettings(	{ 
			type: 'update-setting', 
			attribute: attribute,
			value: value
		} )
	}
	
	return (
		<div className={styles.configPanel}>
			<ul className={styles.column}>
			{
				settings.panel.map( 
					attribute => {
						if(attribute.type === 'range'){
							return (
								<li key = {attribute.key} >
								<Range 
									attr = {attribute.attribute} 
									minimum = {attribute.min} 
									maximum = {attribute.max} 
									step = {attribute.step}
									value = {settings.config[attribute.attribute] || attribute.value} 
									label = {attribute.label} 
									ttip = {attribute.tooltip} 
									cb = {update}
								/>
								</li>
							)
						}
						if(attribute.type === 'checkbox')
							return (
								<li key = {attribute.key} >
								<Checkbox 
									attr = {attribute.attribute} 
									defaultChecked = {settings.config[attribute.attribute] || attribute.value} 
									label = {attribute.label} 
									ttip = {attribute.tooltip} 
									cb = {update}
								/>
								</li>
							)
					}
				)	
			}
			</ul>
		</div>
	)
}

export default ConfigPanel
