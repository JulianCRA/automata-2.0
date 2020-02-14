import React from 'react'

import Range from './ui/Range'
import Checkbox from './ui/Checkbox'

import { automataContext } from '../context/AutomataProvider'

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
		<React.Fragment>
			{
				settings.panel.map( 
					attribute => {
						if(attribute.type === 'range')
							return (
								<Range 
									key = {attribute.key} 
									attr = {attribute.attribute} 
									minimum = {attribute.min} 
									maximum = {attribute.max} 
									step = {attribute.step}
									value = {attribute.value} 
									label = {attribute.label} 
									ttip = {attribute.tooltip} 
									cb = {update}
								/>
							)
						if(attribute.type === 'checkbox')
							return (
								<Checkbox 
									key = {attribute.key} 
									attr = {attribute.attribute} 
									defaultChecked = {attribute.value}
									label = {attribute.label} 
									ttip = {attribute.tooltip} 
									cb = {update}
								/>
							)
						
					}
				)
				
			}
		</React.Fragment>
	)
}

export default ConfigPanel
