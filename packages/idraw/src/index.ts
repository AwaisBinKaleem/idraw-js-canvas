import { Core, MiddlewareSelector, MiddlewareScroller, MiddlewareScaler } from '@idraw/core';
import type { PointSize, IDrawOptions, Data, ViewSizeInfo } from '@idraw/types';

export class iDraw {
  private _core: Core;
  private _opts: IDrawOptions;

  constructor(mount: HTMLDivElement, opts: IDrawOptions) {
    const core = new Core(mount, opts);
    this._core = core;
    this._opts = opts;
    core.use(MiddlewareScroller);
    core.use(MiddlewareSelector);
    core.use(MiddlewareScaler);
  }

  setData(data: Data) {
    this._core.setData(data);
  }

  getData(): Data | null {
    return this._core.getData();
  }

  selectElement() {
    // TODO
  }

  selectElementByIndex() {
    // TODO
  }

  cancelElement() {
    // TODO
  }

  cancelElementByIndex() {
    // TODO
  }

  updateElement() {
    // TODO
  }

  addElement() {
    // TODO
  }

  deleteElement() {
    // TODO
  }

  moveUpElement() {
    // TODO
  }

  moveDownElement() {
    // TODO
  }

  insertElementBefore() {
    // TODO
  }

  insertElementBeforeIndex() {
    // TODO
  }

  insertElementAfter() {
    // TODO
  }

  insertElementAfterIndex() {
    // TODO
  }

  scale(opts: { scale: number; point: PointSize }) {
    this._core.scale(opts);
  }

  resize(opts: Partial<ViewSizeInfo>) {
    this._core.resize(opts);
  }

  on() {
    // TODO
  }

  off() {
    // TODO
  }

  scrollLeft() {
    // TODO
  }

  scrollTop() {
    // TODO
  }

  exportDataURL() {
    // TODO
  }
}
