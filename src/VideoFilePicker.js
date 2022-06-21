import React from 'react';

function VideoFilePicker({ showVideo, handleChange, children }) {
	const FileInput = ({ showVideo }) => (
		<label htmlFor='x' id={`${showVideo ? 'file_picker_small' : ''}`} className={`file_picker `}>
			<span>choose file</span>
			<input onChange={handleChange} type='file' id='x' accept='video/mp4' />
		</label>
	);
	if (showVideo) {
		return (
			<>
				{children}
				<FileInput showVideo={showVideo} />
			</>
		);
	}

	return <FileInput showVideo={showVideo} />;
}

export default VideoFilePicker;
