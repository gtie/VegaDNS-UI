var React = require('react');
var VegaDNSActions = require('../actions/VegaDNSActions');
var ApiKeysStore = require('../stores/ApiKeysStore');
var ApiKeyListEntry = require('./ApiKeyListEntry.react');
var ApiKeyAddForm = require('./ApiKeyAddForm.react');

var ApiKeyList = React.createClass({
    getInitialState: function() {
        return {
            apikeys: [],
            showAddForm: false
        }
    },

    showAddKeyForm: function() {
        this.setState({showAddForm: true});
    },

    hideAddKeyForm: function() {
        this.setState({showAddForm: false});
    },

    componentWillMount: function() {
        this.listApiKeys();
    },

    listApiKeys: function() {
        VegaDNSActions.listApiKeys(this.props.account.account_id);
    },

    componentDidMount: function() {
        ApiKeysStore.addChangeListener(this.onChange);
        ApiKeysStore.addRefreshChangeListener(this.listApiKeys);
    },

    componentWillUnmount: function() {
        ApiKeysStore.removeChangeListener(this.onChange);
        ApiKeysStore.removeRefreshChangeListener(this.listApiKeys);
    },

    onChange() {
        this.setState({apikeys: ApiKeysStore.getApiKeyList()});
    },

    render: function() {
        var apikeys = [];

        for (var key in this.state.apikeys) {
            apikeys.push(<ApiKeyListEntry key={key} apikey={this.state.apikeys[key]} />);
        }

        var addKeyForm = <ApiKeyAddForm hideCallback={this.hideAddKeyForm} />
        var keyList = 
                <div>
                    <h1>API Keys</h1>
                    <div className="pull-right">
                        <a className="btn btn-primary" onClick={this.showAddKeyForm} role="button">add</a>
                    </div>
                    <table className="table table-hover">
                        <thead>
                            <th>description</th>
                            <th>key</th>
                            <th>secret</th>
                            <th>delete</th>
                            <th>id</th>
                        </thead>
                        <tbody>
                            {apikeys}
                        </tbody>
                    </table>
                </div>

        return (
            <section id="apikeys">
                {this.state.showAddForm  ? addKeyForm : keyList}
            </section>
        );
    }
});

module.exports = ApiKeyList;
