/********************************************************************************
 * Copyright (c) 2018 Contributors to the Eclipse Foundation
 * 
 * See the NOTICE file(s) distributed with this work for additional
 * information regarding copyright ownership.
 * 
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * http://www.eclipse.org/legal/epl-2.0, or the W3C Software Notice and
 * Document License (2015-05-13) which is available at
 * https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document.
 * 
 * SPDX-License-Identifier: EPL-2.0 OR W3C-20150513
 ********************************************************************************/

const NAME_PROPERTY_COUNT = "count";
const NAME_ACTION_INCREMENT = "increment";
const NAME_ACTION_DECREMENT = "decrement";
const NAME_ACTION_RESET = "reset";

let thing = WoT.produce({
	title: "counter",
	description: "counter example Thing",
	"@context": ["https://www.w3.org/2019/wot/td/v1",
                {"cov": "http://www.example.org/coap-binding#"}]
});

console.log("Created thing " + thing.title);

thing.addProperty(
	NAME_PROPERTY_COUNT,
	{
		type: "integer",
		description: "current counter value",
		"iot:custom": "nothing",
		observable: true,
		writeable: true
	},
	0);

thing.addAction(
	NAME_ACTION_INCREMENT,
	{},
	() => {
		console.log("Incrementing");
		return thing.properties[NAME_PROPERTY_COUNT].read().then( (count) => {
			let value = count + 1;
			thing.properties[NAME_PROPERTY_COUNT].write(value);
		});
	}
);

thing.addAction(
	NAME_ACTION_DECREMENT,
	{},
	() => {
		console.log("Decrementing");
		return thing.properties[NAME_PROPERTY_COUNT].read().then( (count) => {
			let value = count - 1;
			thing.properties[NAME_PROPERTY_COUNT].write(value);
		});
	}
);

thing.addAction(
	NAME_ACTION_RESET,
	{},
	() => {
		console.log("Resetting");
		thing.properties[NAME_PROPERTY_COUNT].write(0);
	}
);

thing.set("support", "none");
console.info(thing.support);

thing.expose().then(() => {
	console.info(thing.title + " ready");
});
