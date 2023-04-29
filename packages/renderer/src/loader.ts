import type { RendererLoader, LoaderEventMap, LoadFunc, LoadContent, LoadItem, LoadElementType, Element } from '@idraw/types';
import { loadImage, loadHTML, loadSVG, EventEmitter } from '@idraw/util';
import { deepClone } from '@idraw/util';

interface LoadItemMap {
  [uuid: string]: LoadItem;
}

const supportElementTypes: LoadElementType[] = ['image', 'svg', 'html'];

export class Loader extends EventEmitter<LoaderEventMap> implements RendererLoader {
  private _loadFuncMap: Record<LoadElementType | string, LoadFunc<LoadElementType, LoadContent>> = {};
  private _currentLoadItemMap: LoadItemMap = {};
  private _storageLoadItemMap: LoadItemMap = {};

  constructor() {
    super();
    this._registerLoadFunc<'image'>('image', async (elem: Element<'image'>) => {
      const content = await loadImage(elem.desc.src);
      return {
        uuid: elem.uuid,
        lastModified: Date.now(),
        content
      };
    });
    this._registerLoadFunc<'html'>('html', async (elem: Element<'html'>) => {
      const content = await loadHTML(elem.desc.html, elem.desc);
      return {
        uuid: elem.uuid,
        lastModified: Date.now(),
        content
      };
    });
    this._registerLoadFunc<'svg'>('svg', async (elem: Element<'svg'>) => {
      const content = await loadSVG(elem.desc.svg);
      return {
        uuid: elem.uuid,
        lastModified: Date.now(),
        content
      };
    });
  }
  private _registerLoadFunc<T extends LoadElementType>(type: T, func: LoadFunc<T, LoadContent>) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this._loadFuncMap[type] = func;
  }

  private _getLoadElementSource(element: Element<LoadElementType>): null | string {
    let source: string | null = null;
    if (element.type === 'image') {
      source = (element as Element<'image'>)?.desc?.src || null;
    } else if (element.type === 'svg') {
      source = (element as Element<'svg'>)?.desc?.svg || null;
    } else if (element.type === 'html') {
      source = (element as Element<'html'>)?.desc?.html || null;
    }
    return source;
  }

  private _createLoadItem(element: Element<LoadElementType>): LoadItem {
    return {
      element,
      status: 'null',
      content: null,
      error: null,
      startTime: -1,
      endTime: -1,
      source: this._getLoadElementSource(element)
    };
  }

  private _emitLoad(item: LoadItem) {
    const uuid = item.element.uuid;
    const storageItem = this._storageLoadItemMap[uuid];
    if (storageItem) {
      if (storageItem.startTime < item.startTime) {
        this._storageLoadItemMap[uuid] = item;
        this.trigger('load', { ...item, countTime: item.endTime - item.startTime });
      }
    } else {
      this._storageLoadItemMap[uuid] = item;
      this.trigger('load', { ...item, countTime: item.endTime - item.startTime });
    }
  }

  private _emitError(item: LoadItem) {
    const uuid = item.element.uuid;
    const storageItem = this._storageLoadItemMap[uuid];
    if (storageItem) {
      if (storageItem.startTime < item.startTime) {
        this._storageLoadItemMap[uuid] = item;
        this.trigger('error', { ...item, countTime: item.endTime - item.startTime });
      }
    } else {
      this._storageLoadItemMap[uuid] = item;
      this.trigger('error', { ...item, countTime: item.endTime - item.startTime });
    }
  }

  private _loadResource(element: Element<LoadElementType>) {
    const item = this._createLoadItem(element);
    this._currentLoadItemMap[element.uuid] = item;
    const loadFunc = this._loadFuncMap[element.type];
    if (typeof loadFunc === 'function') {
      item.startTime = Date.now();
      loadFunc(element)
        .then((result) => {
          item.content = result.content;
          item.endTime = Date.now();
          item.status = 'load';
          this._emitLoad(item);
        })
        .catch((err: Error) => {
          item.endTime = Date.now();
          item.status = 'error';
          item.error = err;
          this._emitError(item);
        });
    }
  }

  private _isExistingErrorStorage(element: Element<LoadElementType>) {
    const existItem = this._currentLoadItemMap?.[element?.uuid];
    if (existItem && existItem.status === 'error' && existItem.source && existItem.source === this._getLoadElementSource(element)) {
      return true;
    }
    return false;
  }

  load(element: Element<LoadElementType>) {
    if (this._isExistingErrorStorage(element)) {
      return;
    }
    if (supportElementTypes.includes(element.type)) {
      const elem = deepClone(element);
      this._loadResource(elem);
    }
  }

  getContent(uuid: string): LoadContent | null {
    return this._storageLoadItemMap?.[uuid]?.content || null;
  }
}