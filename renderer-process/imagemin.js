const $ = require(`../resources/js/jquery-3.1.1.min.js`);
const ipc = require('electron').ipcRenderer;
const DragScan = require('./DragScan');
const os = require('os');
const path = require('path');
const fs = require('fs');

let output = `${os.homedir()}/Desktop/image-optimize`;
let body = $('body');
let outputInfo = $('.output-dir');

let debug = $('.debug');

let levelJpg = $('#level-jpg');
let levelPng = $('#level-png');
let levelGif = $('#level-gif');

new DragScan('.drop-zone', (src, type) =>{

	let mkList = (src, time) =>{
		let stats = fs.statSync(src);
		let value = stats.size < 1000 ? stats.size : Math.round(stats.size / 1000);
		let unit = stats.size < 1000 ? 'Byte' : 'KByte';
		let name = path.basename(src);

		let temp = `<p class="debug__item ing" data-name="${name.split('.').shift()}_${time}">
					<i class="fa fa-refresh fa-spin"></i>
					<i class="fa fa-check"></i> 
				 	<span class="name">${name}</span>
					<span class="file-info">
					   <span class="before"><span class="value">${value}</span> ${unit}</span>
					   <i class="fa fa-long-arrow-right" aria-hidden="true"></i>
				       <span class="after"><span class="value"></span> ${unit}</span>
				       <span class="percent">(<span class="value"></span>%)</span>
					</span>
				</p>`;

		debug.append(temp);
		debug.scrollTop(debug[0].scrollHeight);
	};

	if(type !== 'file') {
		fs.readdir(src, (e, data) =>{
			for(let name of data) {
				let time = new Date().getTime();

				ipc.send('minify', `${src}/${name}`, time);
				mkList(`${src}/${name}`, time);
			}
		});
	} else {
		let time = new Date().getTime();

		ipc.send('minify', src, time);
		mkList(src, time);
	}

});

outputInfo.text(`${output}`);

body.on('click', '.imagemin-output', (e) =>{
	e.preventDefault();
	ipc.send('open-imagemin-output');
});

levelJpg.on('change', function(){
	ipc.send('select-level-jpg', this.value);
});

levelPng.on('change', function(){
	ipc.send('select-level-png', this.value);
});

levelGif.on('change', function(){
	ipc.send('select-level-gif', this.value);
});

ipc.on('selected-imagemin-output', (e, path) =>{
	outputInfo.text(`${path}`);
});

ipc.on('image-compiled', (e, data, time) =>{
	for(let i = 0, max = data.length; i < max; i++) {
		let stats = fs.statSync(data[i].path);
		let value = stats.size < 1000 ? stats.size : Math.round(stats.size / 1000);
		let name = path.basename(data[i].path).split('.').shift();
		let finish = $(`[data-name="${name}_${time}"]`);
		let percent = Math.round((finish.find('.before .value').text() - value) / finish.find('.before .value').text() * 100);

		finish.find('.percent .value').text(percent > 0 ? -percent : percent);
		finish.find('.after .value').text(value);
		finish.removeClass('ing');
	}
});


