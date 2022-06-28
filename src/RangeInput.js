import React from 'react';
import * as helpers from './helpers';

export default function RangeInput({
	thumbNails,
	rEnd,
	rStart,
	handleUpdaterStart,
	handleUpdaterEnd,
	loading,
	control,
	videoMeta,
}) {
	if (thumbNails.length === 0 && !loading) {
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
				<div className='image_box'>
					{thumbNails.map((imgURL, id) => (
						<img src={imgURL} alt={`sample_video_thumbnail_${id}`} key={id} />
					))}

					<div
						className='clip_box'
						style={{
							width: `calc(${rEnd - rStart}% )`,
							left: `${rStart}%`,
						}}
						data-start={helpers.toTimeString((rStart / 100) * videoMeta.duration, false)}
						data-end={helpers.toTimeString((rEnd / 100) * videoMeta.duration, false)}>
						<span className='clip_box_des'></span>
						<span className='clip_box_des'></span>
					</div>

					<input
						className='range'
						type='range'
						min={0}
						max={100}
						onInput={handleUpdaterStart}
						value={rStart}
					/>
					<input
						className='range'
						type='range'
						min={0}
						max={100}
						onInput={handleUpdaterEnd}
						value={rEnd}
					/>
				</div>
			</div>

			{control}
		</>
	);
}
