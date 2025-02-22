import { groupStore, referenceStore } from './store-types';
import { writable, get } from 'svelte/store';
import { setDefaultStorage } from './storage';
import config from '../config';

/** current reference */
const firstChapter = config.bookCollections[0].books[0].id + "." + config.bookCollections[0].books[0].chaptersN.split("-")[0];
const startReference = config.mainFeatures['start-at-reference'] || firstChapter;
const initReference =
    config.bookCollections[0].languageCode +
    '_' +
    config.bookCollections[0].id +
    '.' +
    startReference;
setDefaultStorage('refs', initReference);
export const refs = groupStore(referenceStore, localStorage.refs);
refs.subscribe((value) => {
    localStorage.refs = value.docSet + '.' + value.book + '.' + value.chapter;
});

function createNextRef() {
    const external = writable({ book: '', chapter: '', verse:'' });

    return {
        subscribe: external.subscribe,
        set: external.set,
        reset: () => {
            external.set({ book: '', chapter: '', verse:'' });
        }
    };
}
export const nextRef = createNextRef();

/**list of selected verses */
function findIndex(id) {
    let references = get(selectedVerses);
    for (let i = 0; i < references.length; i++) {
        const entry = references[i];
        if (entry.verse == id) {
            return i;
        }
    }
    return -1;
}
function getInsertIndex(newVerseNumber, selections) {
    let index = 0;
    for (let i = 0; i < selections.length; i++) {
        const verseNumber = Number(selections[i].verse);
        if (verseNumber > newVerseNumber) {
            break;
        }
        index = i + 1;
    }
    return index;
}
function createSelectedVerses() {
    const external = writable([]);

    return {
        subscribe: external.subscribe,
        addVerse: (id, text) => {
            const currentRefs = get(refs);
            const selection = {
                docSet: currentRefs.docSet,
                collection: currentRefs.collection,
                book: currentRefs.book,
                chapter: currentRefs.chapter,
                verse: id,
                text: text
            };
            let selections = get(external);
            const newVerseNumber = Number(id);
            const newIndex = getInsertIndex(newVerseNumber, selections);
            selections.splice(newIndex, 0, selection);
            external.set(selections);
        },
        removeVerse: (id) => {
            let selections = get(external);
            const index = findIndex(id);
            if (index > -1) {
                selections.splice(index, 1);
                external.set(selections);
            }
        },
        reset: () => {
            external.set([]);
        },
        length: () => {
            let selections = get(external);
            return selections.length;
        },
        getVerseByIndex: (i) => {
            let selections = get(external);
            const index = Number(i);
            if (index > -1 && index < selections.length) {
                return selections[index];
            } else {
                const selection = {
                    docSet: '',
                    collection: '',
                    book: '',
                    chapter: '',
                    verse: '',
                    text: ''
                };
                return selection;
            }
        },
        getVerseByVerseNumber: (i) => {
            let selections = get(external);
            const index = findIndex(i);
            if (index > -1) {
                return selections[index];
            } else {
                const selection = {
                    docSet: '',
                    collection: '',
                    book: '',
                    chapter: '',
                    verse: '',
                    text: ''
                };
                return selection;
            }
        },
        getReference: (i) => {
            let selections = get(external);
            const index = Number(i);
            if (index > -1 && index < selections.length) {
                const selection = selections[index];
                const separator = config.bookCollections.find((x) => x.id === selection.collection).features["ref-chapter-verse-separator"];
                return selection.book + " " + selection.chapter + separator + selection.verse;
            } else {
                return '';
            }
        },

        getCompositeReference: () => {
            let selections = get(external);
            if (selections.length <= 1) {
                return selectedVerses.getReference(0);
            } else {
                const selectionStart = selections[0];
                const verseSeparator = config.bookCollections.find((x) => x.id === selectionStart.collection).features["ref-chapter-verse-separator"];
                const rangeSeparator = config.bookCollections.find((x) => x.id === selectionStart.collection).features["ref-verse-range-separator"];
                const verseListSeparator = config.bookCollections.find((x) => x.id === selectionStart.collection).features["ref-verse-list-separator"];
                var reference = selectionStart.book + " " + selectionStart.chapter + verseSeparator + selectionStart.verse;
                var wasConsecutive = false;
                var lastVerse = selectionStart.verse;
                var currVerse = selectionStart.verse;
                for (var i = 1; i < selections.length; i++) {
                    lastVerse = currVerse;
                    currVerse = selections[i].verse;
                    if (currVerse - lastVerse > 1) {
                        if (wasConsecutive) {
                            reference += lastVerse;
                            wasConsecutive = false;
                        }
                        reference += verseListSeparator + " " + currVerse;
                    } else {
                        if (reference.charAt(reference.length - 1) != rangeSeparator) {
                            reference += rangeSeparator;
                            wasConsecutive = true;
                        }
                    }
                }
                if (reference.charAt(reference.length - 1) == rangeSeparator) {
                    reference += currVerse;
                }
                return reference;
            }
        }
    };
}
export const selectedVerses = createSelectedVerses();
