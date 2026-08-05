/*global QUnit*/

sap.ui.define([
	"kyra001/pages/output001/Output001.controller"
], function (Controller) {
	"use strict";

	QUnit.module("Output001 Controller");

	QUnit.test("I should test the Output001 controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
