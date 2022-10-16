import './targetsubtitle.js';

class SourceTargetRetimer extends HTMLElement {
	constructor() {
		super();
		this.state = {
			sourceFileData: null,
			sourceDialogue: null,
			sourceIndex: null,
			targetFileData: null,
			targetDialogue: null,
			targetIndex: null
		};

		this.attachShadow({ mode: 'open' });
		this.render();
	}

	setState(newState) {
		for (const [key, value] of Object.entries(newState)) {
			this.state[key] = value;
		}

		if (newState.sourceFileData) {
			this.processSourceFileData();
			this.state.sourceIndex = 0;
		}

		if (newState.targetFileData) {
			this.processTargetFileData();
			this.state.targetIndex = 0;
		}

		this.render();
	}

	render() {
		const targetEvent = this.state.targetIndex !== null
			? this.state.targetDialogue.events[this.state.targetIndex]
			: null;

		const targetText = targetEvent ? targetEvent.Text : '---';

		const sourceEvent = this.state.sourceIndex !== null
			? this.state.sourceDialogue.events[this.state.sourceIndex]
			: null;

		const sourceText = sourceEvent ? sourceEvent.Text : '---';

		this.shadowRoot.innerHTML = `
<target-subtitle
	text="${targetText}">
</target-subtitle>
<span>${sourceText}</span>`;
	}

	processSourceFileData() {
		const data = this.state.sourceFileData.split(/\r?\n/);
		this.state.sourceDialogue = this.dialogueFrom(data);
	}

	processTargetFileData() {
		const data = this.state.targetFileData.split(/\r?\n/);
		this.state.targetDialogue = this.dialogueFrom(data);
	}

	dialogueFrom(data) {
		const dialogueIndex = this.eventsIndexFrom(data) + 1;
		const dialogueProperties = data[dialogueIndex].split(/[:,]\s*/);
		const textIndex = dialogueProperties.indexOf('Text');

		const dialogue = {
			properties: dialogueProperties,
			events: []
		};

		for (let i = dialogueIndex + 1; i < data.length; ++i) {
			const segments = data[i].split(/(?:,|: )/);
			const dialogueData = segments.slice(0, textIndex)
				.concat(segments.slice(textIndex).join(','));
			const line = {};
			for (const prop of dialogueProperties) {
				line[prop] = dialogueData[dialogueProperties.indexOf(prop)];
			}
			if (line.Format) {
				dialogue.events.push(line);
			}
		}

		return dialogue;
	}

	eventsIndexFrom(data) {
		let result = null;
		for (let i = 0; i < data.length; ++i) {
			if (data[i] === '[Events]') {
				result = i;
				break;
			}
		}
		return result;
	}
}

customElements.define('source-target-retimer', SourceTargetRetimer);
