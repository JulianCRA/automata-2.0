import React from 'react';
import styles from './Checkbox.module.css';

export default class InputRange extends React.Component{
	constructor(props){
		super(props);
		
		this.state = {
			isChecked : (props.defaultChecked === true),
			label : (props.label || "value") + " : ",
			ttip : props.ttip || "Set the value."
		}
		
		this.toggleChange = this.toggleChange.bind(this);
	}

	render(){
		return(
			<div className = {styles.inputCheckboxContainer} title = {this.state.ttip} onClick={this.toggleChange}>
				<label className = {styles.checkboxLabel}>
					{this.state.label}
				</label>
				<div>
					<input 
						className = {styles.inputCheckbox}
						type = "checkbox" 
						checked = {this.state.isChecked}
						onChange = {()=>{}}
					/>
				</div>
			</div>
		);
	}

	toggleChange(){
		if(typeof this.props.cb === "function") this.props.cb(this.props.attr, !this.state.isChecked);
		this.setState({isChecked : !this.state.isChecked});
	}
}