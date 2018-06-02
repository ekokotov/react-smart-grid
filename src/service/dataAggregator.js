export default class DataAggregator {
  constructor() {
    this._handlers = [];
    this._pipe = (f, g) => (args) => g(f(args));
    this.composeHandlers = () => this._handlers.reduce(this._pipe)
  }

  registerPipe(service) {
    if (typeof service.process !== 'function') throw new Error('Internal Error. Every filter service should have "process" method.');
    this._handlers.push(service.process);
  }

  process(_data) {
    if (!this._handlers.length) return _data;
    return this.composeHandlers()(_data);
  }
}
