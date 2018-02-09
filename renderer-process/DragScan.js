const $ = require(`../resources/js/jquery-3.1.1.min.js`);

class DragScan {
	constructor(dropArea, callback){
		this._setEvent(dropArea);
		this.onload = callback;
	}

	_scanFile(item){
		if(item.webkitGetAsEntry().isFile) {
			this.onload(item.getAsFile().path, 'file');
		} else {
			this.onload(item.getAsFile().path, 'directory');
		}
	}

	_setEvent(dropArea){
		let dropzone = $(dropArea);

		dropzone.on('dragover dragenter', (e) =>{
			e.preventDefault();
			dropzone.addClass('is-dragover');
		});

		dropzone.on('dragleave dragend', (e) =>{
			e.preventDefault();
			dropzone.removeClass('is-dragover');
		});

		dropzone.on('drop', (e) =>{
			e.preventDefault();

			dropzone.removeClass('is-dragover');

			let items = e.originalEvent.dataTransfer.items;
			let max = items.length;

			for(let i = 0; i < max; i++) {
				this._scanFile(items[i]);
			}
		});

		$('#contents').on('drop dragover dragenter', (e) =>{
			e.preventDefault();
		});
	}
}

module.exports = DragScan;