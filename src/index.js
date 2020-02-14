import React from 'react';
import ReactDOM from 'react-dom';

import Automata from './js/Automata'
import './styles/index.css'

const wrapper = document.getElementById('container')
wrapper ? ReactDOM.render(<Automata />, wrapper) : false