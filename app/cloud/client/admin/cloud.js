import './cloud.html';

import { Meteor } from 'meteor/meteor';
import { ReactiveVar } from 'meteor/reactive-var';
import { Template } from 'meteor/templating';
import { t } from '../../../utils';

import queryString from 'query-string';
import toastr from 'toastr';

Template.cloud.onCreated(function() {
	const instance = this;
	instance.info = new ReactiveVar();
	instance.loading = new ReactiveVar(true);

	instance.loadRegStatus = function _loadRegStatus() {
		Meteor.call('cloud:checkRegisterStatus', (error, info) => {
			if (error) {
				console.warn('cloud:checkRegisterStatus', error);
				return;
			}

			instance.info.set(info);
			instance.loading.set(false);
		});
	};

	instance.connectWorkspace = function _connectWorkspace(token) {
		Meteor.call('cloud:connectWorkspace', token, (error, success) => {
			if (error) {
				toastr.error(error);
				instance.loadRegStatus();
				return;
			}

			if (!success) {
				toastr.error('An error occured connecting');
				instance.loadRegStatus();
				return;
			}

			toastr.success(t('Connected'));

			instance.loadRegStatus();
		});
	};

	instance.disconnectWorkspace = function _disconnectWorkspace() {
		Meteor.call('cloud:disconnectWorkspace', (error, success) => {
			if (error) {
				toastr.error(error);
				instance.loadRegStatus();
				return;
			}

			if (!success) {
				toastr.error('An error occured disconnecting');
				instance.loadRegStatus();
				return;
			}

			toastr.success(t('Disconnected'));

			instance.loadRegStatus();
		});
	};

	instance.syncWorkspace = function _syncWorkspace() {
		Meteor.call('cloud:syncWorkspace', (error, success) => {
			if (error) {
				toastr.error(error);
				instance.loadRegStatus();
				return;
			}

			if (!success) {
				toastr.error('An error occured syncing');
				instance.loadRegStatus();
				return;
			}

			toastr.success(t('Sync Complete'));

			instance.loadRegStatus();
		});
	};

	instance.registerWorkspace = function _registerWorkspace() {
		Meteor.call('cloud:registerWorkspace', (error, success) => {
			if (error) {
				toastr.error(error);
				instance.loadRegStatus();
				return;
			}

			if (!success) {
				toastr.error('An error occured');
				instance.loadRegStatus();
				return;
			}

			toastr.success(t('Connected'));

			instance.loadRegStatus();
		});
	};

	const params = queryString.parse(location.search);

	if (params.token) {
		instance.connectWorkspace(params.token);
	} else {
		instance.loadRegStatus();
	}
});

Template.cloud.helpers({
	info() {
		return Template.instance().info.get();
	},
});

Template.cloud.events({
	'click .update-email-btn'() {
		const val = $('input[name=cloudEmail]').val();

		Meteor.call('cloud:updateEmail', val, (error) => {
			if (error) {
				console.warn(error);
				return;
			}

			toastr.success(t('Saved'));
		});
	},

	'click .connect-btn'(e, i) {
		const token = $('input[name=cloudToken]').val();

		i.connectWorkspace(token);
	},

	'click .register-btn'(e, i) {
		i.registerWorkspace();
	},

	'click .disconnect-btn'(e, i) {
		i.disconnectWorkspace();
	},

	'click .sync-btn'(e, i) {
		i.syncWorkspace();
	},
});
