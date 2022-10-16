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

		const sourceEvent = this.state.sourceIndex !== null
			? this.state.sourceDialogue.events[this.state.sourceIndex]
			: null;

		const targetText = targetEvent ? targetEvent.Text : '---';

		const targetStartOffset = targetEvent && sourceEvent
			? this.differenceDisplayOf(targetEvent.Start, sourceEvent.Start)
			: '---';

		const targetEndOffset = targetEvent && sourceEvent
			? this.differenceDisplayOf(targetEvent.End, sourceEvent.End)
			: '---';

		const prevTargetIsEnabled = this.state.targetIndex !== null
			&& this.state.targetIndex > 0;

		const nextTargetIsEnabled = this.state.targetIndex !== null
			&& this.state.targetIndex < (
				this.state.targetDialogue.events.length - 1);

		const sourceText = sourceEvent ? sourceEvent.Text : '---';

		const prevSourceIsEnabled = this.state.sourceIndex !== null
			&& this.state.sourceIndex > 0;

		const nextSourceIsEnabled = this.state.sourceIndex !== null
			&& this.state.sourceIndex < (
				this.state.sourceDialogue.events.length - 1);

		this.shadowRoot.innerHTML = `
<p>${this.htmlFor(targetText)}</p>
<div>
	<span>${targetStartOffset}</span>
	<span>${targetEndOffset}</span>
</div>
<div>
	<button${prevTargetIsEnabled ? '' : ' disabled'}>Previous</button>
	<button${nextTargetIsEnabled ? '' : ' disabled'}>Next</button>
</div>
<p>${this.htmlFor(sourceText)}</p>
<div>
	<button${prevSourceIsEnabled ? '' : ' disabled'}>Previous</button>
	<button${nextSourceIsEnabled ? '' : ' disabled'}>Next</button>
</div>`;

		if (this.prevTargetButton) {
			this.prevTargetButton.onclick =
				this.onPreviousTargetClicked.bind(this);
		}

		if (this.nextTargetButton) {
			this.nextTargetButton.onclick = this.onNextTargetClicked.bind(this);
		}

		if (this.prevSourceButton) {
			this.prevSourceButton.onclick =
				this.onPreviousSourceClicked.bind(this);
		}

		if (this.nextSourceButton) {
			this.nextSourceButton.onclick = this.onNextSourceClicked.bind(this);
		}
	}

	get prevTargetButton() {
		return this.shadowRoot.querySelector('button');
	}

	get nextTargetButton() {
		return this.shadowRoot.querySelectorAll('button')[1];
	}

	get prevSourceButton() {
		return this.shadowRoot.querySelectorAll('button')[2];
	}

	get nextSourceButton() {
		return this.shadowRoot.querySelectorAll('button')[3];
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

	differenceDisplayOf(targetTime, compareTime) {
		const targetSegments = targetTime.split(/:/);
		const targetSeconds = (targetSegments[0] * 60 * 60) + (
			targetSegments[1] * 60) + +targetSegments[2];

		const compareSegments = compareTime.split(/:/);
		const compareSeconds = (compareSegments[0] * 60 * 60) + (
			compareSegments[1] * 60) + +compareSegments[2];

		const difference = targetSeconds - compareSeconds;
		return `${difference >= 0 ? '+' : '-'}${difference.toFixed(2)} seconds`;
	}

	onPreviousTargetClicked() {
		this.setState({
			targetIndex: this.state.targetIndex - 1
		});
	}

	onNextTargetClicked() {
		this.setState({
			targetIndex: this.state.targetIndex + 1
		});
	}

	onPreviousSourceClicked() {
		this.setState({
			sourceIndex: this.state.sourceIndex - 1
		});
	}

	onNextSourceClicked() {
		this.setState({
			sourceIndex: this.state.sourceIndex + 1
		});
	}

	htmlFor(text) {
		return text
			.replace(/&/g, '&amp;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;');
	}
}

customElements.define('source-target-retimer', SourceTargetRetimer);
