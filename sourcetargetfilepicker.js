import './subtitlefilepicker.js';

class SourceTargetFilePicker extends HTMLElement {
	constructor() {
		super();
		this.attachShadow({ mode: 'open' });
		this.render();
	}

	render() {
		const sourceFileName = this.getAttribute('sourceFileName');
		const targetFileName = this.getAttribute('targetFileName');
		const shouldShowSubmitButton = sourceFileName && targetFileName;
		this.shadowRoot.innerHTML = `
<subtitle-filepicker
	title="Source Subtitles"
	fileName="${sourceFileName}">
</subtitle-filepicker>
<subtitle-filepicker
	title="Target Subtitles"
	fileName="${targetFileName}">
</subtitle-filepicker>
${shouldShowSubmitButton ? '<button>Retime</button>' : ''}`;

		this.sourcePickerElement.addEventListener('file-selected',
			this.onSourceFileSelected.bind(this));
		this.targetPickerElement.addEventListener('file-selected',
			this.onTargetFileSelected.bind(this));
		if (this.submitElement) {
			this.submitElement.onclick = function() {
				this.dispatchEvent(new CustomEvent('files-submitted'));
			}.bind(this);
		}
	}

	get sourcePickerElement() {
		return this.shadowRoot.querySelector('subtitle-filepicker');
	}

	get targetPickerElement() {
		return this.shadowRoot.querySelectorAll('subtitle-filepicker')[1];
	}

	get submitElement() {
		return this.shadowRoot.querySelector('button');
	}

	onSourceFileSelected(event) {
		this.dispatchEvent(new CustomEvent('source-file-selected', {
			detail: {
				fileName: event.detail.fileName,
				fileData: event.detail.fileData
			}
		}));
	}

	onTargetFileSelected(event) {
		this.dispatchEvent(new CustomEvent('target-file-selected', {
			detail: {
				fileName: event.detail.fileName,
				fileData: event.detail.fileData
			}
		}));
	}
}

customElements.define('source-target-file-picker', SourceTargetFilePicker);
