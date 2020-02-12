import React, { useReducer } from 'react'

import automata from './automataList'

const initialSettings = {
	automaton: null,
	panel: []
}

const settingsReducer = (settings, action) => {
	switch(action.type){
		case 'new-automaton':
			return automata.find( x => x.short === action.automaton)
		case 'update-setting':
			return {
				...settings,
				config: {
					...settings.config,
					[action.attribute]: action.value
				}
			}
		default:
			return settings
	}
}

const automataContext = React.createContext( initialSettings )

const AutomataProvider = ({ children }) => {
	const [ settings, updateSettings ] = useReducer(
		settingsReducer,
		initialSettings
	)

	const contextValue = React.useMemo(
		() => {
			return { settings, updateSettings }
		 },
		[ settings, updateSettings ]
	)

	return (
		<automataContext.Provider value={ contextValue }>
			{children}
		</automataContext.Provider>
	)
}

export { AutomataProvider, automataContext }