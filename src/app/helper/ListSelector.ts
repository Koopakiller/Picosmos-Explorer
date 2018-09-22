export interface IListSelector<T> {
    processChange(list: T[], clickedEntry: T, shiftPressed: boolean, controlPressed: boolean,
        selector: ((item) => void), unselector: ((item) => void), isSelected: ((item) => boolean));

    reset();
}

export class ExplorerStyleListSelector<T> implements IListSelector<T> {

    private _lastTouched: T;
    private _selected: T[] = [];
    private _firstSelected: T;

    public processChange(list: T[], clickedEntry: T, shiftPressed: boolean, controlPressed: boolean,
        selector: ((item) => void), unselector: ((item) => void), isSelected: ((item) => boolean)) {
        //ToDo: Does not work 100% proper
        if (controlPressed) {
            if (shiftPressed) {
                if (isSelected(clickedEntry)) {
                    unselector(clickedEntry);
                    this._selected.splice(this._selected.indexOf(clickedEntry), 1);
                }
                else {
                    if (this._lastTouched) {
                        let clickedIndex = list.indexOf(clickedEntry);
                        let lastIndex = list.indexOf(this._lastTouched);
                        let max = Math.max(clickedIndex, lastIndex);
                        for (let i = Math.min(clickedIndex, lastIndex); i <= max; ++i) {
                            if (!isSelected(list[i])) {
                                selector(list[i]);
                                this._selected.push(list[i]);
                            }
                        }
                    }
                    else {
                        //select first item
                        selector(clickedEntry);
                        this._selected.push(clickedEntry);
                    }
                    this._lastTouched = clickedEntry;
                }
            }
            else {
                //single (de)select items
                if (isSelected(clickedEntry)) {
                    unselector(clickedEntry);
                    this._selected.splice(this._selected.indexOf(clickedEntry), 1);
                }
                else {
                    selector(clickedEntry);
                    this._selected.push(clickedEntry);
                    this._lastTouched = clickedEntry;
                }
            }
        }
        else {
            if (shiftPressed) {
                if (this._firstSelected) {
                    let clickedIndex = list.indexOf(clickedEntry);
                    let firstIndex = list.indexOf(this._firstSelected);
                    for (let item of this._selected) {
                        unselector(item);
                    }
                    this._selected = [];
                    let max = Math.max(clickedIndex, firstIndex);
                    for (let i = Math.min(clickedIndex, firstIndex); i <= max; ++i) {
                        selector(list[i]);
                        this._selected.push(list[i]);
                    }
                }
                else {
                    //select first item
                    selector(clickedEntry);
                    this._selected.push(clickedEntry);
                }
            }
            else {
                //select only the clicked item
                for (let item of this._selected) {
                    unselector(item);
                }
                selector(clickedEntry);
                this._firstSelected = clickedEntry;
                this._selected = [clickedEntry];
            }
            this._lastTouched = clickedEntry;
        }

        if (!this._firstSelected) {
            this._firstSelected = clickedEntry;
        }
    }

    public reset() {
        this._lastTouched = null;
        this._selected = [];
        this._firstSelected = null;
    }
}
