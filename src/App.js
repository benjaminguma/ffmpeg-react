import 'react-responsive-carousel/lib/styles/carousel.min.css'; // requires a loader
import './App.css';
import { Carousel } from 'react-responsive-carousel';
import sprite from './sprite.svg';

const images = [
	'https://res.cloudinary.com/dqydioa16/image/upload/v1653954061/rlpraaoty5zaxazsrodt.jpg',
	'https://res.cloudinary.com/dqydioa16/image/upload/v1653953497/xj2xucrwmwp5c3bfnene.jpg',
	'https://res.cloudinary.com/dqydioa16/image/upload/v1653953497/ymsneptkynl7sz8os8vq.jpg',
	'https://images.unsplash.com/photo-1654096048549-843088f43455?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=3403&q=80',
];

function App() {
	const rotateAnimationHandler = (props, state) => {
		console.log(props, state);
		const transitionTime = props.transitionTime + 'ms';
		const transitionTimingFunction = 'ease-in-out';

		let slideStyle = {
			display: 'block',
			minHeight: '100%',
			transitionTimingFunction: transitionTimingFunction,
			msTransitionTimingFunction: transitionTimingFunction,
			MozTransitionTimingFunction: transitionTimingFunction,
			WebkitTransitionTimingFunction: transitionTimingFunction,
			OTransitionTimingFunction: transitionTimingFunction,
			// transform: `rotate(0)`,
			transform: `rotate(0)`,
			position: state.previousItem === state.selectedItem ? 'relative' : 'absolute',
			inset: '0 0 0 0',
			zIndex: state.previousItem === state.selectedItem ? '1' : '-2',

			opacity: state.previousItem === state.selectedItem ? '1' : '0',
			WebkitTransitionDuration: transitionTime,
			MozTransitionDuration: transitionTime,
			OTransitionDuration: transitionTime,
			transitionDuration: transitionTime,
			msTransitionDuration: transitionTime,
		};

		return {
			slideStyle,
			selectedStyle: {
				...slideStyle,
				opacity: 1,
				position: 'relative',
				zIndex: 2,
				filter: `blur(0)`,
			},
			prevStyle: {
				...slideStyle,
				transformOrigin: ' 0 100%',
				transform: `rotate(${state.previousItem > state.selectedItem ? '-45deg' : '45deg'})`,
				opacity: '0',
				filter: `blur( ${state.previousItem === state.selectedItem ? '0px' : '30px'})`,
			},
		};
	};

	return (
		<div className='box'>
			<Carousel>
				{images.map((URL, index) => (
					<div className='slide'>
						<img alt='sample_file' src={URL} key={index} />
					</div>
				))}
			</Carousel>
		</div>
	);
}

export default App;
