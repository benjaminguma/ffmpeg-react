const toTimeString = (sec, showMilliSeconds = true) => {
	sec = parseFloat(sec);
	let hours = Math.floor(sec / 3600); // get hours
	let minutes = Math.floor((sec - hours * 3600) / 60); // get minutes
	let seconds = sec - hours * 3600 - minutes * 60; //  get seconds
	// add 0 if value < 10; Example: 2 => 02
	if (hours < 10) {
		hours = '0' + hours;
	}
	if (minutes < 10) {
		minutes = '0' + minutes;
	}
	if (seconds < 10) {
		seconds = '0' + seconds;
	}
	let maltissaRegex = /\..*$/;

	let millisec = String(seconds).match(maltissaRegex);
	console.log({ millisec });
	return (
		hours +
		':' +
		minutes +
		':' +
		String(seconds).replace(maltissaRegex, '') +
		(showMilliSeconds ? (millisec ? millisec[0] : '.000') : '')
	);
};

const readFileAsBase64 = async (file) => {
	// this function go retun the data url representing the file sth like
	// data:image/png;base64,JHYIYIHUO8O99U9L787G87999
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = () => {
			resolve(reader.result);
		};
		reader.onerror = reject;
		reader.readAsDataURL(file);
	});
};

const download = (url) => {
	const link = document.createElement('a');
	link.href = url;
	link.setAttribute('download', '');
	link.click();
	window.URL.revokeObjectURL(url);
};

export { toTimeString, readFileAsBase64, download };
