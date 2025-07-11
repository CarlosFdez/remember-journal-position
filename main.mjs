function handleSheetV1() {
    const originalClose = JournalSheet.prototype.close;
    JournalSheet.prototype.close = function (...args) {
        this._saveScrollPositions(this.element);
        this._previousOpenedPositions = this._scrollPositions;
        return originalClose.apply(this, args);
    };

    const originalRestore = JournalSheet.prototype._restoreScrollPositions;
    JournalSheet.prototype._restoreScrollPositions = function (...args) {
        if (this._priorState === -1 && this._previousOpenedPositions && !this._scrollPosition) {
            this._scrollPositions = this._previousOpenedPositions;
        }
        this._previousOpenedPositions = null;
        return originalRestore.apply(this, args);
    };
}

function handleSheetV2() {
    const JournalSheetV2 = foundry.applications.sheets.journal.JournalEntrySheet;
    const originalClose = JournalSheetV2.prototype.close;
    JournalSheetV2.prototype.close = function (...args) {
        const pages = this.element.querySelector(".journal-entry-pages");
        this._previousOpenedPositions = [pages.scrollTop, pages.scrollLeft];
        return originalClose.apply(this, args);
    };

    Hooks.on("renderJournalEntrySheet", (sheet) => {
        if (sheet._previousOpenedPositions) {
            const [top, left] = sheet._previousOpenedPositions;            
            const pages = sheet.element.querySelector(".journal-entry-pages");
            pages.scrollTop = top;
            pages.scrollLeft = left;
        }
        sheet._previousOpenedPositions = null;
    })
}

handleSheetV1();
handleSheetV2();