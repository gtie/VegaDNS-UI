"use strict";

var VegaDNSClient = require('../utils/VegaDNSClient');
var AppDispatcher = require('../dispatcher/AppDispatcher');
var VegaDNSConstants = require('../constants/VegaDNSConstants');

import { EventEmitter } from 'events';

var CHANGE_CONSTANT = 'CHANGE';

var loggedInState = false;
var responseData = null;
var domains = [];

class DomainsStore extends EventEmitter {
    emitChange() {
        this.emit(CHANGE_CONSTANT);
    }

    getDomainList() {
        return domains;
    }

    fetchDomains() {
        VegaDNSClient.domains()
        .success(data => {
            responseData = data;
            domains = data.domains;
            this.emitChange();
        }).error(data => {
            this.emitChange();
        });
    }

    addChangeListener(callback) {
        this.on(CHANGE_CONSTANT, callback);
    }

    removeChangeListener(callback) {
        this.removeListener(CHANGE_CONSTANT, callback);
    }
}

var store = new DomainsStore();


// Register callback to handle all updates
AppDispatcher.register(function(action) {
    switch(action.actionType) {
        case VegaDNSConstants.LIST_DOMAINS:
            store.fetchDomains();
            break;
    }
});

module.exports = store;
