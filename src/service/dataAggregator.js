export default class DataAggregator {
  constructor() {
    this._handlers = [];
    this.composeHandlers = () => this._handlers.reduce(this._pipe)
  }

  registerPipe(func) {
    this._handlers.push(func);
  }

  _pipe(f, g) {
    return (...args) => g(f(...args));
  }

  process(_data) {
    if (!this._handlers.length) return _data;
    return this.composeHandlers()(_data);
  }
}
