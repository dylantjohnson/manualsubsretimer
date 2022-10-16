import './sourcetargetfilepicker.js';
import './sourcetargetretimer.js';

class ManualSubsRetimer extends HTMLElement {
	constructor() {
		super();
		this.state = {
			shouldShowFilePickers: true,
			sourceFileName: '',
			sourceFileData: null,
			targetFileName: '',
			targetFileData: null
		};

		this.attachShadow({ mode: 'open' });
		this.render();
	}

	setState(newState) {
		for (const [key, value] of Object.entries(newState)) {
			this.state[key] = value;
		}
		this.render();
	}

	render() {
		this.shadowRoot.innerHTML = `
<h1>Manual Subs Retimer</h1>
${this.state.shouldShowFilePickers
	? `
<p>This is a program for manually adjusting subtitle timings, line-by-line. Sometimes that's just the best way to do it. Select a source subtitle file that has known correct timings and select a target subtitle file that needs adjustments.</p>
<source-target-file-picker
	sourceFileName="${this.state.sourceFileName}"
	targetFileName="${this.state.targetFileName}">
</source-target-file-picker>`
	: `
<source-target-retimer></source-target-retimer>`}`;

		if (this.subtitleFilePicker) {
			this.subtitleFilePicker.addEventListener('source-file-selected',
				this.onSourceFileSelected.bind(this));
			this.subtitleFilePicker.addEventListener('target-file-selected',
				this.onTargetFileSelected.bind(this));
			this.subtitleFilePicker.addEventListener('files-submitted',
				this.onFilesSubmitted.bind(this));
		}

		if (this.retimer) {
			this.retimer.setState({
				sourceFileData: this.state.sourceFileData,
				targetFileData: this.state.targetFileData
			});
		}
	}

	get subtitleFilePicker() {
		return this.shadowRoot.querySelector('source-target-file-picker');
	}

	get retimer() {
		return this.shadowRoot.querySelector('source-target-retimer');
	}

	onSourceFileSelected(event) {
		this.setState({
			sourceFileName: event.detail.fileName,
			sourceFileData: event.detail.fileData
		});
	}

	onTargetFileSelected(event) {
		this.setState({
			targetFileName: event.detail.fileName,
			targetFileData: event.detail.fileData
		});
	}

	onFilesSubmitted() {
		this.setState({
			shouldShowFilePickers: false
		});
	}
}

customElements.define('manual-subs-retimer', ManualSubsRetimer);
