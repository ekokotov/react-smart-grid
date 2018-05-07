export default class DataAggregator {
  constructor() {
    this._handlers = [];
    this.composeHandlers = () => this._handlers.reduce(this._pipe)
  }

  registerPipe(service) {
    if (typeof service.process !== 'function') throw new Error('Internal Error. Every filter service should have "process" method.');
    this._handlers.push(service.process);
  }

  _pipe(f, g) {
    return (...args) => g(f(...args));
  }

  process(_data) {
    if (!this._handlers.length) return _data;
    return this.composeHandlers()(_data);
  }
}
