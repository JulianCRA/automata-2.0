import React, {useContext} from 'react'

import P5Wrapper from '../utils/P5Wrapper'
import { automataContext } from '../context/AutomataProvider'
const Automaton = () => {
	const { settings } = useContext( automataContext )
	return (
		<React.Fragment>
			{
				settings.automaton ?
					<P5Wrapper sketch = {settings.automaton} config = {settings.config}></P5Wrapper> : 
					<div className="p5-sketch">
						<h1>A selection of simple automata algorithms</h1>
					</div>
			}
		</React.Fragment>
	)
}

export default Automaton