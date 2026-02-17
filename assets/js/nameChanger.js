// nameChanger.js
// On hover over the site header text, replace it with three random words
// starting with P, D, and F respectively. Revert to the original text on mouse out.

(function () {
	'use strict';

	// Word lists (words starting with P, D, F)
	const P_WORDS = [
		'Procrastination', 'Praxis', 'Pedagogy', 'Poetics', 'Phenomenology',
		'Perception', 'Practice', 'Politics', 'Projection', 'Process', "Prestigious", "Prententious"
	];

	const D_WORDS = [
		'Discipline', 'Deliberation', 'Desire', 'Dialectic', 'Dreams',
		'Discourse', 'Dissonance', 'Decision', 'Discovery', 'Duration', 'Dialogue'
	];

	const F_WORDS = [
		'Formation', 'Fiction', 'Futurity', 'Freedom', 'Form',
		'Failure', 'Function', 'Flow', 'Feeling', 'Frame', 'Facility'
	];

	// Utility: pick a random item from an array
	function randomFrom(arr) {
		return arr[Math.floor(Math.random() * arr.length)];
	}

	// Find header element (matches <header> <h1> in your layouts)
	function findHeaderElement() {
		// Prefer header h1 inside contentBox if present
		let el = document.querySelector('#contentBox header h1');
		if (!el) el = document.querySelector('header h1');
		if (!el) el = document.querySelector('header a h1');
		return el;
	}

	function init() {
		const header = findHeaderElement();
		if (!header) return; // nothing to do

		const originalText = header.textContent;

		// Pointer events cover mouse and touch in most browsers
		header.addEventListener('pointerenter', () => {
			const p = randomFrom(P_WORDS);
			const d = randomFrom(D_WORDS);
			const f = randomFrom(F_WORDS);
			header.textContent = `( ${p} ${d} ${f} )`;
		});

		header.addEventListener('pointerleave', () => {
			header.textContent = originalText;
		});

		// Also restore on blur in case pointer events aren't triggered
		header.addEventListener('blur', () => { header.textContent = originalText; });
	}

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', init);
	} else {
		init();
	}

})();

