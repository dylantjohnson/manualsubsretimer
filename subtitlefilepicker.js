class SubtitleFilePicker extends HTMLElement {
	constructor() {
		super();
		this.attachShadow({ mode: 'open' });
		this.render();
	}

	render() {
		let title = this.getAttribute('title');
		if (!title) {
			title = 'Select Subtitle File';
		}

		let fileName = this.getAttribute('filename');
		if (!fileName) {
			fileName = '---'
		}

		this.shadowRoot.innerHTML = `
<label>${title}</label>
<input
	title="${title}"
	type="file"
	accept=".ass"
	style="display:none" />
<button>Choose File</button>
<span>${fileName}</span>`;

		this.inputElement.onchange = this.readFile.bind(this);
		this.buttonElement.onclick = function() {
			this.inputElement.click();
		}.bind(this)
	}

	get buttonElement() {
		return this.shadowRoot.querySelector('button');
	}

	get inputElement() {
		return this.shadowRoot.querySelector('input');
	}

	readFile() {
		const file = this.inputElement.files[0];
		if (!file) {
			this.dispatchEvent(new CustomEvent('file-selected', {
				detail: {
					fileName: null,
					fileData: null
				}
			}));
			return;
		}

		this.buttonElement.disabled = true;
		const reader = new FileReader();
		reader.onload = function() {
			this.buttonElement.disabled = false;
			this.dispatchEvent(new CustomEvent('file-selected', {
				detail: {
					fileName: file.name,
					fileData: reader.result
				}
			}));
		}.bind(this);
		reader.readAsText(file);
	}
}

customElements.define('subtitle-filepicker', SubtitleFilePicker);
