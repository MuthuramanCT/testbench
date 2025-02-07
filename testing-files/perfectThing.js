var Servient = require('@node-wot/core').Servient;
var HttpServer = require('@node-wot/binding-http').HttpServer;
var HttpClientFactory = require('@node-wot/binding-http').HttpClientFactory;
var CoapServer = require('@node-wot/binding-coap').CoapServer;
var CoapClientFactory = require('@node-wot/binding-coap').CoapClientFactory;
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

let srv = new Servient();
let httpSrvObj = {"port": 8081}
srv.addServer(new HttpServer(httpSrvObj));
srv.addClientFactory(new HttpClientFactory());
let coapSrvObj = {"port": 8082}
srv.addServer(new CoapServer(coapSrvObj));
srv.addClientFactory(new CoapClientFactory());
srv.start().then(WoT => {

    console.log('* started servient');

    let thing = WoT.produce({
        title: "TestServient",
        description: "Test servient that can be used as a servient to be tested with the WoT Test Bench"
    });

    thing.addProperty("display", {
        type: 'string',
        observable: true
    }, "initialization string");

    thing.addProperty("counter", {
        type: 'number',
        observable: true
    }, 0);

    thing.addProperty("temperature", {
        type: 'number',
        readOnly: true,
        observable: true
    }, 25);

    thing.addProperty("testObject", {
        type: 'object',
        properties: {
            "brightness": {
                type: "number",
                minimum: 0.0,
                maximum: 100.0
            },
            "status": {
                type: "string"
            }
        }
    }, {
        "brightness": 99.99,
        "status": "exampleString"
    });

    thing.addProperty("testArray", {
        type: "array",
        items: {
            type: "number"
        }
    }, [12, 15, 10]);

    thing.addAction("setCounter", {
        input: {
            type: 'number'
        }
    }, (input) => {
        console.log("* ACTION HANDLER FUNCTION for setCounter");
        console.log("* ", input);
        return thing.properties["counter"].write(input).then(() => {
            console.log('* Set counter successful');
            return
        }).catch(() => {
            console.log('* Set counter failed');
            return
        });
    });

    thing.addAction("getTemperature", {
        output: {
            type: "number"
        }
    }, () => {
        console.log("* ACTION HANDLER FUNCTION for getTemp");
        return thing.properties["temperature"].read().then((temp) => {
            console.log('* getTemperature successful');
            return temp;
        }).catch(() => {
            console.log('* getTemperature failed');
            return 0;
        });
    });

    thing.addAction("setDisplay", {
        input: {
            type: "string"
        },
        output: {
            type: "string"
        }
    },
    (input) => {
        console.log("* ACTION HANDLER FUNCTION for setDisplay");
        console.log("* ", input);
        return new Promise((resolve, reject) => {
            resolve("Display set");
        });
    });

    thing.addAction("setTestObject", {
        input: {
            type: "object",
            properties: {
                "brightness": {
                    type: "number",
                    minimum: 0.0,
                    maximum: 100.0
                },
                "status": {
                    type: "string"
                }
            }
        }
    }, (input) => {
        console.log("* ACTION HANDLER FUNCTION for setTestObject");
        console.log("* ", input);
        return thing.properties["testObject"].write(input).then(() => input, () => false);
    });

    thing.addAction("setTestArray", {
        input: {
            type: "array",
            items: {
                type: "number"
            }
        },
        output: {
            type: "array",
            items: {
                type: "number"
            }
        }
    }, (input) => {
        console.log("* ACTION HANDLER FUNCTION for setTestArray");
        console.log("* ", input);
        return thing.properties["testArray"].write(input).then(() => {
            return input;
        });
    });

    thing.addEvent("onChange", {
        type: "number"
    });

    thing.expose().then(() => {
        console.info(thing.title + " ready");
    });
}).catch(err => {
    throw "Couldnt connect to servient"
});
