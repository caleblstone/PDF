const P_WORDS = [
	'Project', 'Procrastination', 'Praxis', 'Pedagogy', 'Pedagogical', 'Poetic', 'Phenomenological','Perception', 'Practice', 'Politics', 'Projection', 'Process', 'Prestigious', 'Prententious', 'Populist', 'Political', 'Potential', 'Potent', 'Procedural', 'Pompous', 'Poetic', 'Picturesque', 'Presenting', 'Paradoxical', 'Piratic', 'Picaresque','Proctored', 'Protological','Pathological', 'Pathetic'
];

const D_WORDS = [
    'Discipline', 'Deliberation', 'Desire', 'Dialectic', 'Dreams',
    'Discourse', 'Dissonance', 'Decision', 'Discovery', 'Duration', 'Dialogue',
	'Decadence', 'Donation', 'Demon', 'Decoded', 'Devilish', 'Durable', 
    'Derivation','Deviation','Deviant', 'Daliance','Dilatory','Denouement', 
    'Dilittante','Derivitive','Draconian'
];

const F_WORDS = [
    'Formation', 'Fiction', 'Futurity', 'Freedom', 'Form',
    'Failure', 'Function', 'Flow', 'Feeling', 'Frame', 'Facility',
	'Faculty', 'Flamboyance', 'Fortification', 'Front', '-Fest', 'Fricasseé', 'Fucker(mother)', 'Font', 'Frenetic', 'Fabulation', 
    'Fornicatory', 'Fasnacht'
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

let lastTypewriterCancel = null;

// Generic typewriter that replaces entire text (kept for edge use)
function typewriterEffect(element, text, callback) {
    if (lastTypewriterCancel) {
        lastTypewriterCancel();
        lastTypewriterCancel = null;
    }
    if (!element) return () => {};

    let i = 0;
    element.textContent = ''; // start fresh
    const id = setInterval(() => {
        element.textContent = text.slice(0, i + 1);
        i++;
        if (i === text.length) {
            clearInterval(id);
            lastTypewriterCancel = null;
            if (callback) setTimeout(callback, 1000); // wait 1s before callback
        }
    }, 50);

    lastTypewriterCancel = () => {
        clearInterval(id);
        lastTypewriterCancel = null;
    };
    return lastTypewriterCancel;
}

// Type only the inner text while keeping prefix/suffix static (parentheses never removed)
function typewriterInnerWithWrapper(element, innerText, prefix = '( ', suffix = ' )', callback) {
    if (lastTypewriterCancel) {
        lastTypewriterCancel();
        lastTypewriterCancel = null;
    }
    if (!element) return () => {};

    let i = 0;
    // show static wrapper immediately so parentheses remain visible
    element.textContent = prefix + suffix;
    const id = setInterval(() => {
        element.textContent = prefix + innerText.slice(0, i + 1) + suffix;
        i++;
        if (i === innerText.length) {
            clearInterval(id);
            lastTypewriterCancel = null;
            if (callback) setTimeout(callback, 1000);
        }
    }, 50);

    lastTypewriterCancel = () => {
        clearInterval(id);
        lastTypewriterCancel = null;
    };
    return lastTypewriterCancel;
}

function init() {
    const header = findHeaderElement();
    if (!header) return; // nothing to do

    const originalText = (header.textContent || '').trim();

    // derive inner text: if original is in parentheses, extract inside; otherwise use whole text
    let originalInner = originalText;
    const m = originalText.match(/^\s*\(?\s*(.*?)\s*\)?\s*$/);
    if (m) originalInner = m[1];

    // ensure initial state uses parentheses and original inner
    header.textContent = '( ' + originalInner + ' )';

    // Pointer events cover mouse and touch in most browsers
    header.addEventListener('pointerenter', () => {
        const p = randomFrom(P_WORDS);
        const d = randomFrom(D_WORDS);
        const f = randomFrom(F_WORDS);
        const inner = `${p} ${d} ${f}`; // no parentheses here
        typewriterInnerWithWrapper(header, inner, '( ', ' )');
    });

    header.addEventListener('pointerleave', () => {
        // restore original inner while keeping parentheses visible
        typewriterInnerWithWrapper(header, originalInner, '( ', ' )');
    });

    // Also restore on blur in case pointer events aren't triggered
    header.addEventListener('blur', () => {
        typewriterInnerWithWrapper(header, originalInner, '( ', ' )');
    });

    // Automatic typewriter effect every 20 seconds
    setInterval(() => {
        // don't interrupt if user is hovering
        if (header.matches(':hover')) return;

        const p = randomFrom(P_WORDS);
        const d = randomFrom(D_WORDS);
        const f = randomFrom(F_WORDS);
        const inner = `${p} ${d} ${f}`;

        console.debug && console.debug('nameChanger: automatic typewriter trigger', inner);

        typewriterInnerWithWrapper(header, inner, '( ', ' )', () => {
            // After ~3 seconds, return to original inner with typewriter effect (unless hovered)
            setTimeout(() => {
                if (!header.matches(':hover')) {
                    typewriterInnerWithWrapper(header, originalInner, '( ', ' )');
                }
            }, 3000);
        });
    }, 20000); // 20000 ms = 20 seconds
}

init();