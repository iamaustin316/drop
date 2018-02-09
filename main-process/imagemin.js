const imagemin = require('imagemin');
const jpegRecompress = require('imagemin-jpeg-recompress');
const pngquant = require('imagemin-pngquant');
const imageminGifsicle = require('imagemin-gifsicle');
const os = require('os');

const ipc = require('electron').ipcMain;
const dialog = require('electron').dialog;

let output = `${os.homedir()}/Desktop/image-optimize`;
let jpgQuality = 80;
let PngQuality = 80;
let gifQuality = 1;

ipc.on('open-imagemin-output', (e) =>{
	dialog.showOpenDialog({
		properties: ['openDirectory']
	}, (folder) =>{
		if(folder) {
			output = `${folder}`;
			e.sender.send('selected-imagemin-output', folder);
		}
	})
});

ipc.on('select-level-jpg', (e, value) =>{
	jpgQuality = value;
});

ipc.on('select-level-png', (e, value) =>{
	PngQuality = value;
});

ipc.on('select-level-gif', (e, value) =>{
	gifQuality = value;
});

ipc.on('minify', (e, path, time) =>{
	let src = [`${path}`];

	imagemin(src, output, {
		plugins: [
			jpegRecompress({max: jpgQuality}),
			pngquant({quality: PngQuality}),
			imageminGifsicle({optimizationLevel: gifQuality})
		]
	}).then(files =>{
		e.sender.send('image-compiled', files, time);
	});
});