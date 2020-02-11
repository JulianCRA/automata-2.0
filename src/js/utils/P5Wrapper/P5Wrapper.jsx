import React from 'react'
import p5 from 'p5'

import './P5Sketch.css'

// if(typeof window !== undefined)
//   window.p5 = p5

export default class P5Wrapper extends React.Component {
	componentDidMount() {
		this.canvas = new p5(this.props.sketch, this.wrapper)
		if (this.canvas.customRedraw) {
			this.canvas.customRedraw(this.props.config)
		}
	}

	componentDidUpdate(prevProps) {
		if (this.props.sketch !== prevProps.sketch) {
			this.canvas.remove()
			this.canvas = new p5(this.props.sketch, this.wrapper)
		}

		if (this.canvas.customRedraw) {
			this.canvas.customRedraw(this.props.config)
		}
	}

	componentWillUnmount() {
		this.canvas.remove()
	}

	render() {
		return(
			<div
				className = "p5-sketch"
				ref = {wrapper => (this.wrapper = wrapper)}>
				
				<div id="p5_loading">
				 	Loading...
				 	<div className="lds-hourglass" />
				</div>
			</div>
		)
	}
}