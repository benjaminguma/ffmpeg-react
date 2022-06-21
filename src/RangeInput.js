import React from 'react';
import * as helpers from './helpers';

export default function RangeInput({
	children,
	rEnd,
	rStart,
	setRstart,
	setRend,
	handleUpdateRange,
	loading,
	control,
	videoMeta,
	noThumbNails,
}) {
	let RANGE_MAX = 100;
	console.log({
		noThumbNails,
		loading,
	});

	if (noThumbNails && !loading) {
		return null;
	}

	if (loading) {
		return (
			<center>
				<h2> processing thumbnails.....</h2>
			</center>
		);
	}

	return (
		<>
			<div className='range_pack'>
				<div
					className='image_box'
					style={{
						width: 100 * 15 + 'px',
					}}>
					{children}

					<div
						className='clip_box'
						style={{
							width: `calc(${rEnd - rStart}% )`,
							left: `${rStart}%`,
						}}
						data-start={helpers.toTimeString((rStart / RANGE_MAX) * videoMeta.duration, false)}
						data-end={helpers.toTimeString((rEnd / RANGE_MAX) * videoMeta.duration, false)}>
						<span className='clip_box_des'></span>
						<span className='clip_box_des'></span>
					</div>

					<input
						className='range'
						type='range'
						min={0}
						max={RANGE_MAX}
						onInput={handleUpdateRange(setRstart)}
						value={rStart}
					/>
					<input
						className='range'
						type='range'
						min={0}
						max={RANGE_MAX}
						onInput={handleUpdateRange(setRend)}
						value={rEnd}
					/>
				</div>
			</div>

			{control}
		</>
	);
}
