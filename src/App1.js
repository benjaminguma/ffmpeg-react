import { useState } from 'react';
import './App.css';
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';
import RangeInput from './RangeInput';
import * as helpers from './helpers';
import VideoFilePicker from './VideoFilePicker';
import OutPutVideo from './OutPutVideo';

const FF = createFFmpeg({
	// log: true,
	corePath: 'https://unpkg.com/@ffmpeg/core@0.10.0/dist/ffmpeg-core.js',
});

(async function () {
	await FF.load();
})();

function App() {
	const [inputVideoFile, setInputVideoFile] = useState(null);
	const [trimmedVideoFile, setTrimmedVideoFile] = useState(null);
	// const ref = useRef();
	const [videoMeta, setVideoMeta] = useState(null);
	const [thumbNails, setThumbNails] = useState([]);
	const [URL, setURL] = useState([]);
	const [trimIsProcessing, setTrimIsProcessing] = useState(false);
	const [thumbnailIsProcessing, setThumbnailIsProcessing] = useState(false);

	const [rStart, setRstart] = useState(0);
	const [rEnd, setRend] = useState(10);

	const handleChange = async (e) => {
		let file = e.target.files[0];
		console.log(file);
		setInputVideoFile(file);

		setURL(await helpers.readFileAsBase64(file));
	};

	const handleLoadedData = async (e) => {
		// console.dir(ref.current);

		const el = e.target;

		const meta = {
			name: inputVideoFile.name,
			duration: el.duration,
			videoWidth: el.videoWidth,
			videoHeight: el.videoHeight,
		};
		console.log({ meta });
		setVideoMeta(meta);
		const thumbNails = await getThumbNails(meta);
		setThumbNails(thumbNails);
	};

	const getThumbNails = async ({ duration }) => {
		if (!FF.isLoaded()) await FF.load();
		setThumbnailIsProcessing(true);
		let MAX_NUMBER_OF_IMAGES = 15;
		let NUMBER_OF_IMAGES = duration < MAX_NUMBER_OF_IMAGES ? duration : 15;
		const FRAME_RATE = duration >= MAX_NUMBER_OF_IMAGES ? '1' : `1/${Math.floor(duration)}`;
		let offset = duration === MAX_NUMBER_OF_IMAGES ? 1 : duration / NUMBER_OF_IMAGES;

		const arrayOfImageURIs = [];

		for (let i = 0; i < NUMBER_OF_IMAGES; i++) {
			let startTimeInSecs = helpers.toTimeString(Math.round(i * offset));

			if (startTimeInSecs + offset > duration && offset > 1) {
				offset = 0;
			}
			// console.log({
			// 	startTimeInSecs,
			// });
			FF.FS('writeFile', inputVideoFile.name, await fetchFile(inputVideoFile));
			try {
				await FF.run(
					'-ss',
					startTimeInSecs,
					'-i',
					inputVideoFile.name,
					'-t',
					'00:00:1.000',
					'-vf',
					`fps=${FRAME_RATE},scale=150:-1`,
					`img${i}.png`,
				);
				const data = FF.FS('readFile', `img${i}.png`);

				let blob = new Blob([data.buffer], { type: 'image/png' });
				let dataURI = await helpers.readFileAsBase64(blob);
				FF.FS('unlink', `img${i}.png`);
				arrayOfImageURIs.push(dataURI);
			} catch (error) {
				console.log({ message: error });
			}
		}
		setThumbnailIsProcessing(false);

		return arrayOfImageURIs;
	};

	const handleTrim = async () => {
		setTrimIsProcessing(true);

		let startTime = ((rStart / 100) * videoMeta.duration).toFixed(2);
		let offset = ((rEnd / 100) * videoMeta.duration - startTime).toFixed(2);
		console.log(startTime, offset, helpers.toTimeString(startTime), helpers.toTimeString(offset));

		try {
			FF.FS('writeFile', inputVideoFile.name, await fetchFile(inputVideoFile));
			// await FF.run('-ss', '00:00:13.000', '-i', inputVideoFile.name, '-t', '00:00:5.000', 'ping.mp4');
			await FF.run(
				'-ss',
				helpers.toTimeString(startTime),
				'-i',
				inputVideoFile.name,
				'-t',
				helpers.toTimeString(offset),
				'-c',
				'copy',
				'ping.mp4',
			);

			const data = FF.FS('readFile', 'ping.mp4');
			console.log(data);
			const dataURL = await helpers.readFileAsBase64(new Blob([data.buffer], { type: 'video/mp4' }));

			setTrimmedVideoFile(dataURL);
		} catch (error) {
			console.log(error);
		} finally {
			setTrimIsProcessing(false);
		}
	};

	const handleUpdateRange = (func) => {
		return ({ target: { value } }) => {
			func(value);
		};
	};

	return (
		<main className='App'>
			{
				<>
					<RangeInput
						rEnd={rEnd}
						rStart={rStart}
						handleUpdaterStart={handleUpdateRange(setRstart)}
						handleUpdaterEnd={handleUpdateRange(setRend)}
						loading={thumbnailIsProcessing}
						videoMeta={videoMeta}
						control={
							<div className='u-center'>
								<button onClick={handleTrim} className='btn btn_b' disabled={trimIsProcessing}>
									{trimIsProcessing ? 'trimming...' : 'trim selected'}
								</button>
							</div>
						}
						thumbNails={thumbNails}
					/>
				</>
			}
			<section className='deck'>
				<article className='grid_txt_2'>
					<VideoFilePicker handleChange={handleChange} showVideo={!!inputVideoFile}>
						<div className='bord_g_2 p_2'>
							<video
								src={inputVideoFile ? URL : null}
								autoPlay
								controls
								muted
								onLoadedMetadata={handleLoadedData}
								width='450'></video>
						</div>
					</VideoFilePicker>
				</article>
				<OutPutVideo
					videoSrc={trimmedVideoFile}
					handleDownload={() => helpers.download(trimmedVideoFile)}
				/>
			</section>
		</main>
	);
}

export default App;
