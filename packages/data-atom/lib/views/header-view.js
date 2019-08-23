"use babel";
/** @jsx etch.dom */

import etch from 'etch';
import {Emitter} from 'atom';
import {CompositeDisposable} from 'atom';

// The header view for the results view, allowing you to add/change connections or change the DB
export default class DataAtomHeaderView {
  constructor(useEditorQuery) {
    this.state = {
      isExecuting: false,
      selectedDb: {},
      selectedConnection: '',
      connections: [],
      databases: [],
      useEditorQuery: useEditorQuery
    };

    this.emitter = new Emitter();
    etch.initialize(this);

    this.refs.executeBtn.addEventListener('click', () => { this.executeQuery(); });
    this.refs.cancelBtn.addEventListener('click', () => { this.emitter.emit('data-atom-query-cancel'); });
    this.refs.queryToggle.addEventListener('click', () => { this.queryToggle(); });
    this.refs.connectionBtn.addEventListener('click', () => { this.newConnection(); });
    this.refs.disconnectBtn.addEventListener('click', () => { this.disconnect(); });
    this.refs.connectionList.addEventListener('change', (e) => { this.connectionSelected(e); });
    this.refs.databaseList.addEventListener('change', (e) => { this.databaseSelected(e); });
    this.subscriptions = null;

    this.recreateTooltips();
  }

  deconstructor() {
    this.subscriptions.dispose();
  }

  recreateTooltips() {
    if (this.subscriptions != null)
      this.subscriptions.dispose();

    // refs won't exists on etch.initialize
    if (this.refs != undefined && this.refs.executeBtn != undefined) {
      this.subscriptions = new CompositeDisposable();
      this.subscriptions.add(atom.tooltips.add(this.refs.executeBtn, {
        title: 'Execute',
        keyBindingCommand: 'data-atom:execute'
      }));
      this.subscriptions.add(atom.tooltips.add(this.refs.cancelBtn, {title: 'Cancel execution [when a query is executing]'}));
      this.subscriptions.add(atom.tooltips.add(this.refs.queryToggle, {title: 'Toggle between executing content from the active editor or the query panel below'}));
      this.subscriptions.add(atom.tooltips.add(this.refs.connectionBtn, {title: 'Add new connection'}));
      this.subscriptions.add(atom.tooltips.add(this.refs.disconnectBtn, {title: 'Disconnect current connection'}));
    }
  }

  update(props, children) {
    return etch.update(this);
  }

  render() {
    this.recreateTooltips(); // if we disable a button while the tooltip is shown, it sticks

    var queryToggleClass = 'btn btn-default btn-query-toggle ';
    queryToggleClass += this.state.useEditorQuery ? 'btn-query-toggle-up' : 'btn-query-toggle-down selected';

    return (<header className='header toolbar'>
      <button className='btn btn-default btn-query-execute' disabled={!this.state.selectedDb[this.state.selectedConnection] || this.state.isExecuting} ref='executeBtn'>Execute</button>
      <button className='btn btn-default btn-query-cancel' disabled={!this.state.isExecuting} ref='cancelBtn'></button>
      <button className={queryToggleClass} ref='queryToggle'></button>
      <span className='heading-connection-title'>Connection:</span>
      <button className='btn btn-default btn-connect' ref='connectionBtn'></button>
      <button className='btn btn-default btn-disconnect' ref='disconnectBtn' disabled={this.state.connections.length == 0}></button>
      <select ref='connectionList'>
        <option value='0' disabled='true'>Select connection...</option>
        {this.state.connections.map(con =>
          <option value={con} selected={con == this.state.selectedConnection}>{con}</option>
        )}
      </select>
      <span className='db-label'>Database:</span>
      <select className='db-select' ref='databaseList'>
        <option value='data-atom:select-db' disabled='true'>Select database...</option>
        {this.state.databases.map(db =>
          <option value={db} selected={db == this.state.selectedDb[this.state.selectedConnection]}>{db}</option>
        )}
      </select>
    </header>);
  }

  getHeight() {
    return this.element.offsetHeight;
  }

  close() {
    atom.commands.dispatch(atom.views.getView(atom.workspace), 'data-atom:toggle-results-view');
  }

  databaseSelected(e) {
    this.state.selectedDb[this.state.selectedConnection] = e.target.options[e.target.selectedIndex].value;
    etch.update(this);
    this.emitter.emit('data-atom-database-changed');
  }

  connectionSelected(e) {
    this.state.selectedConnection = e.target.options[e.target.selectedIndex].value;
    etch.update(this);
    this.emitter.emit('data-atom-connection-changed');
    this.emitter.emit('data-atom-database-changed');
  }

  addConnection(connectionName) {
    this.state.connections.push(connectionName);
    etch.update(this);
  }

  addDbNames(names) {
    this.state.databases = names || [];
    etch.update(this);
  }

  setSelectedDbName(name) {
    if (name == null)
      name = 'data-atom:select-db';
    this.state.selectedDb[this.state.selectedConnection] = name;
    etch.update(this);
  }

  clearDatabaseSelection() {
    this.state.databases = [];
    etch.update(this);
  }

  setConnection(connectionName) {
    this.state.selectedConnection = connectionName;
    etch.update(this);
  }

  getSelectedConnection() {
    return this.state.selectedConnection;
  }

  getSelectedDatabase() {
    return this.state.selectedDb[this.state.selectedConnection];
  }

  newConnection() {
    atom.commands.dispatch(atom.views.getView(atom.workspace), 'data-atom:new-connection');
  }

  disconnect() {
    var i = this.state.connections.indexOf(this.state.selectedConnection);
    if (i != -1)
      this.state.connections.splice(i, 1);

    this.state.selectedConnection = '';
    this.state.databases = [];
    etch.update(this);
    this.emitter.emit('data-atom-disconnect');
    this.emitter.emit('data-atom-connection-changed');
  }

  onDisconnect(onFunc) {
    return this.emitter.on('data-atom-disconnect', onFunc);
  }

  executeQuery() {
    atom.commands.dispatch(atom.views.getView(atom.workspace), 'data-atom:execute');
  }

  queryToggle() {
    atom.commands.dispatch(atom.views.getView(atom.workspace), 'data-atom:toggle-query-source');
  }

  toggleQuerySource(useEditorQuery) {
    this.state.useEditorQuery = useEditorQuery;
    etch.update(this);
  }

  onConnectionChanged(onConnectionChangedFunc) {
    return this.emitter.on('data-atom-connection-changed', onConnectionChangedFunc);
    return this.emitter.on('data-atom-database-changed', onDatabaseChangedFunc);
  }

  onDatabaseChanged(onDatabaseChangedFunc) {
    return this.emitter.on('data-atom-database-changed', onDatabaseChangedFunc);
  }

  onQueryCancel(onQueryCancelFunc) {
    return this.emitter.on('data-atom-query-cancel', onQueryCancelFunc);
  }

  // Let us know that execution has begun. Chance for us to disbale any cnotrols etc.
  executionBegin() {
    this.state.isExecuting = true;
    etch.update(this);
  }
  // Let us know that execution has ended. Chance to re-enable controls etc.
  executionEnd() {
    this.state.isExecuting = false;
    etch.update(this);
  }
}
