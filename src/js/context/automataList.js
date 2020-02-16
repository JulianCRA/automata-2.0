
import langtonsAnt from '../sketches/langtonsAnt'
import conwaysGameOfLife from '../sketches/conwaysGameOfLife'
import forestFire from '../sketches/forestFire'
import belousovZhabotinskysReaction from '../sketches/belousovZhabontinskysReaction'
import viralReplication from '../sketches/viralReplication'
import diffusionLimitedAggregation from '../sketches/diffusionLimitedAggregation'
import floodFill from '../sketches/floodFill'


const _WIDTH = 30
const _HEIGHT = 30

const automata = [

	//		Langton's ant

	{
		short: 'ant',
		title: 'Langton\'s Ant',
		description: `Interactive representation of the universal Turing machine known as Langton's ant. Click to add a new ant to the canvas.`,
		automaton: langtonsAnt,
		config: {
			size: 30
		},
		panel: [
			{
				key: 'langsize',
				attribute: 'size',
				type: 'range',
				min: 2,
				max: 100,
				step: 2,
				value: 30,
				label: 'Size',
				tootltip: 'Size of the cells.'
			}
		]
	},

	//		Forest Fire

	{
		short: 'fire',
		title: 'Forest Fire',
		description: `A slightly modified version of the forest-fire model devised by Drossel and Schwabl. Click to start a fire.`,
		automaton: forestFire,
		config: {
			toroidal: false,
			resistance: 40,
			germination: 5,
			soilRecovery:  15,
			size: 10
		},
		panel: [
			{
				key: 'forestsize',
				attribute: 'size',
				type: 'range',
				min: 2,
				max: 100,
				step: 2,
				value: 10,
				label: 'Size',
				tootltip: 'Size of the cells.'
			},
			{
				key: 'firetoroid',
				attribute: 'toroidal',
				type: 'checkbox',
				value: false,
				label: 'Toroidal',
				tootltip: 'Choose whether the grid should behave as a plane or as a toroid.'
			},
			{
				key: 'fireres',
				attribute: 'resistance',
				type: 'range',
				min: 0,
				max: 100,
				step: 1,
				value: 40,
				label: 'Chance of resisting combustion',
				tooltip: 'Set the "fire resistance" probabilty.'
			},
			{
				key: 'firegermination',
				attribute: 'germination',
				type: 'range',
				min: 0,
				max: 100,
				step: 1,
				value: 5,
				label: 'Germination rate',
				tooltip: 'Set the germination rate'
			},
			{
				key: 'firerecovery',
				attribute: 'soilRecovery',
				type: 'range',
				min: 0,
				max: 100,
				step: 1,
				value: 15,
				label: 'Soil recovery time',
				tooltip: 'Set the recovery time for the soil.'
			},
		]
	},

	//		Belousov-Zhabotinsky's Reaction

	{
		short: 'belousov',
		title: 'Belousov-Zhabotinsky\'s Reaction',
		description: `Tweakable simulation of the Belousov-Zhabotinsky reaction. Most of the variables of the rules proposed by A. K. Dewdney are modifiable in the panel.`,
		automaton: belousovZhabotinskysReaction,
		config: {
			toroidal: false,
			distance: 2,
			states: 32,
			seed: 4,
			k1: 4,
			k2: 1,
			g: 10,
			size: 10
		},
		panel: [
			{
				key: 'bzsize',
				attribute: 'size',
				type: 'range',
				min: 2,
				max: 100,
				step: 2,
				value: 10,
				label: 'Size',
				tootltip: 'Size of the cells.'
			},
			{
				key: 'bztoroid',
				attribute: 'toroidal',
				type: 'checkbox',
				value: false,
				label: 'Toroidal',
				tootltip: 'Choose whether the grid should behave as a plane or as a toroid.'
			},
			{
				key: 'bzdistance',
				attribute: 'distance',
				type: 'range',
				min: 1,
				max: 8,
				value: 2,
				label: 'Neighborhood distance',
				tooltip: 'Set the distance of the Moore neightborhood. Higher values will make the algorithm more resource-intensive.'
			},
			{
				key: 'bzsates',
				attribute: 'states',
				type: 'range',
				min: 2,
				max: 128,
				value: 32,
				label: 'States',
				tooltip: 'Set the number of states that every cell can have.'
			},
			{
				key: 'bzseed',
				attribute: 'seed',
				type: 'range',
				min: 1,
				max: 256,
				value: 4,
				label: 'Initial cells',
				tooltip: 'Set the number of seed cells.'
			},
			{
				key: 'bzk1',
				attribute: 'k1',
				type: 'range',
				min: 1,
				max: 128,
				value: 4,
				label: 'k1',
				tooltip: 'Set the value of the k1 variable.'
			},
			{
				key: 'bzk2',
				attribute: 'k2',
				type: 'range',
				min: 1,
				max: 128,
				value: 1,
				label: 'k2',
				tooltip: 'Set the value of the k2 variable.'
			},
			{
				key: 'bzg',
				attribute: 'g',
				type: 'range',
				min: 1,
				max: 256,
				value: 10,
				label: 'g',
				tooltip: 'Set the value of the g variable.'
			}
		]
	},

	//		Viral Replication

	{
		short: 'viralrep',
		title: 'Viral Replication',
		description: `A very basic and simple cellular automaton representing a viral replication model. Change any of the possible values on the panel`,
		automaton: viralReplication,
		config: {
			size: 5,
			toroidal: false,
			infectionRate: 55,
			baseRate: 7,
			divisionChance: 35,
			states: 50
		},
		panel: [
			{
				key: 'viralsize',
				attribute: 'size',
				type: 'range',
				min: 1,
				max: 100,
				step: 1,
				value: 5,
				label: 'Size',
				tootltip: 'Size of the cells.'
			},
			{
				key: 'viraltoroid',
				attribute: 'toroidal',
				type: 'checkbox',
				value: false,
				label: 'Toroidal',
				tootltip: 'Choose whether the grid should behave as a plane or as a toroid.'
			},
			{
				key: 'viralir',
				attribute: 'infectionRate',
				type: 'range',
				min: 1,
				max: 100,
				value: 55,
				label: 'Infection rate (k1)',
				tooltip: 'Set the value for the active infection rate.'
			},
			{
				key: 'viralbr',
				attribute: 'baseRate',
				type: 'range',
				min: 1,
				max: 100,
				value: 7,
				label: 'Base rate (k2)',
				tooltip: 'Set the value for the base rate.'
			},
			{
				key: 'viraldc',
				attribute: 'divisionChance',
				type: 'range',
				min: 1,
				max: 100,
				value: 35,
				label: 'Chance of division (k3)',
				tooltip: 'Set the value of the probability of cell division/reproduction.'
			},
			{
				key: 'viralstates',
				attribute: 'states',
				type: 'range',
				min: 1,
				max: 64,
				value: 50,
				label: 'States (q)',
				tooltip: 'Set the number of states a cell can have.'
			},
		]
	},

	//		Diffusion-Limited Aggregation

	{
		short: 'dlagg',
		title: 'Diffusion-limited Aggregation',
		description: `2D Cellular automaton depiction the aggregation model defined as DLA. Click to add a seed cell.`,
		automaton: diffusionLimitedAggregation,
		config: {
			width: 150,
			height: 150,
			toroidal: false,
			mobileCellsAmount: 15,
			seedCellsAmount: 0,
			states: 50
		},
		panel: [
			{
				key: 'viralwidth',
				attribute: 'width',
				type: 'range',
				min: 50,
				max: 200,
				step: 10,
				value: 150,
				label: 'Columns',
				tooltip: 'Set the number of columns'
			},
			{
				key: 'dlheight',
				attribute: 'height',
				type: 'range',
				min: 50,
				max: 200,
				step: 10,
				value: 150,
				label: 'Rows',
				tooltip: 'Set the number of rows'
			},
			{
				key: 'dltoroid',
				attribute: 'toroidal',
				type: 'checkbox',
				value: false,
				label: 'Toroidal',
				tootltip: 'Choose whether the grid should behave as a plane or as a toroid.'
			},
			{
				key: 'dlstates',
				attribute: 'states',
				type: 'range',
				min: 1,
				max: 64,
				value: 1,
				label: 'States (q)',
				tooltip: 'Set the amount of states.'
			},
			{
				key: 'dlk1',
				attribute: 'mobileCellsAmount',
				type: 'range',
				min: 1,
				max: 100,
				value: 15,
				label: 'Mobile cells (k1)',
				tooltip: 'Set the percentage of mobile cells.'
			},
			{
				key: 'dlk2',
				attribute: 'seedCellsAmount',
				type: 'range',
				min: 0,
				max: 250,
				value: 0,
				label: 'Seed cells (k2)',
				tooltip: 'Set the amount of seed cells.'
			},
		]
	},

	//		Flood Fill

	{
		short: 'flood',
		title: 'Flood Fill',
		description: `Simple visualization of the Flood fill algorithm. Click to switch the color of any of the drawn regions.`,
		automaton: floodFill,
		config: {
			width: 50,
			height: 50,
			seed: false,
			euclidean: true,
			regions: 50
		},
		panel: [
			{
				key: 'flwidth',
				attribute: 'width',
				type: 'range',
				min: 10,
				max: 200,
				step: 5,
				value: 50,
				label: 'Columns',
				tooltip: 'Set the number of columns'
			},
			{
				key: 'flheight',
				attribute: 'height',
				type: 'range',
				min: 10,
				max: 200,
				step: 5,
				value: 50,
				label: 'Rows',
				tooltip: 'Set the number of rows'
			},
			{
				key: 'flseed',
				attribute: 'seed',
				type: 'checkbox',
				value: false,
				label: 'Display origins',
				tootltip: 'Choose whether to display the origin points of the regions.'
			},
			{
				key: 'fleuclidaan',
				attribute: 'euclidean',
				type: 'checkbox',
				value: true,
				label: 'Euclidean distances',
				tootltip: 'Choose whether to use Euclidean or Manhattan distances.'
			},
			{
				key: 'flregions',
				attribute: 'regions',
				type: 'range',
				min: 1,
				max: 256,
				value: 50,
				label: 'Regions',
				tooltip: 'Set the amount of regions to display.'
			}
		]
	},

	{
		short: 'life',
		title: 'Conway\'s Game of Life',
		description: `Representation of the Conway's Game of Life cellular automaton. Click on any cell to change its state.`,
		automaton: conwaysGameOfLife,
		config: {
			toroidal: true,
			seed: 25,
			size: 10
		},
		panel: [
			{
				key: 'conwayssize',
				attribute: 'size',
				type: 'range',
				min: 5,
				max: 100,
				step: 5,
				value: 10,
				label: 'Size',
				tootltip: 'Size of the cells.'
			},
			{
				key: 'conwaystoroid',
				attribute: 'toroidal',
				type: 'checkbox',
				value: true,
				label: 'Toroidal',
				tootltip: 'Choose whether the grid should behave as a plane or as a toroid.'
			},
			{
				key: 'conwaysseed',
				attribute: 'seed',
				type: 'range',
				min: 1,
				max: 100,
				value: 25,
				label: 'Seed cells (%)',
				tootltip: 'Set the percentage of cells that are "alive" when the algorithm starts'
			}			
		]
	},
]

export default automata