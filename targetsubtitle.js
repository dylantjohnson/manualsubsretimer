class TargetSubtitle extends HTMLElement {
	constructor() {
		super();
		this.attachShadow({ mode: 'open' })
		this.render();
	}

	render() {
		this.shadowRoot.innerHTML = `<p>${this.getAttribute('text')}</p>`
	}
}

customElements.define('target-subtitle', TargetSubtitle);
