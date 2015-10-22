console.log("loading FireStepDriver");
var serialport = require("serialport");

var firepick = firepick || {};
(function(firepick) {
    var FireStepDriver = (function() {
        var onData = function(that, data) {
            console.log("READ\t: " + data);
            if (typeof data === "string" && data.indexOf('{"s":0,"r":{') === 0) { // success
                var jdata = JSON.parse(data);
                var r = jdata.r;
                that.model.id = r.id || that.model.id;
                that.model.sys = r.sys || that.model.sys;
                that.model.dim = r.dim || that.model.dim;
                that.model.a = r.a || that.model.a;
                that.model.b = r.b || that.model.b;
                that.model.c = r.c || that.model.c;
                that.model.x = r.x || that.model.x;
                that.model.y = r.y || that.model.y;
                that.model.z = r.z || that.model.z;
                that.model.mpo = r.mpo || that.model.mpo;
                console.log("MODEL\t:" + JSON.stringify(that.model));

                if (that.queue[0]) {
                    var jobj = that.queue.shift();
                    var cmd = JSON.stringify(jobj);
                    console.log("WRITE\t: " + cmd);
                    that.serial.write(cmd);
                    that.serial.write("\n");
                }
            }
            return that;
        };
        function FireStepDriver(options) {
            var that = this;
            options = options || {};
            options.serialPath = options.serialPath || "/dev/ttyACM0";
            options.buffersize = options.buffersize || 255;
            options.baudrate = options.baudrate || 19200;

            that.queue = [];
            that.serialPath = options.serialPath;
            that.model = {};
            that.serial = new serialport.SerialPort(that.serialPath, {
                buffersize: options.buffersize,
                parser: serialport.parsers.readline('\n'),
                baudrate: options.baudrate 
            }, true, function(error) {
                that.error = error;
                if (error) {
                    console.log("ERROR\t: FireStepDriver.open(" + that.serialPath + ") failed:" + error);
                } else {
                    console.log("OPEN\t: " + that.serialPath + " (reading...)");
                    that.send({"id":""});
                    that.send({"sys":""});
                    that.send({"dim":""});
                    that.send({"a":""});
                    that.send({"b":""});
                    that.send({"c":""});
                    that.send({"x":""});
                    that.send({"y":""});
                    that.send({"z":""});
                    that.send([{"hom":""},{"mpo":""}]);
                    that.send([{"mov":{"x":10,"y":10}},{"mpo":""}]);
                }
            });
            that.serial.on("data",function(error) {
                onData(that, error);
            });
            console.log("INFO\t: FireStepDriver(" + that.serialPath + ")");
            return that;
        }
        FireStepDriver.prototype.send = function(jobj) {
            var that = this;
            that.queue.push(jobj);
            return that;
        }
        return FireStepDriver;
    })();
    firepick.FireStepDriver = FireStepDriver;
})(firepick);

module.exports.FireStepDriver = firepick.FireStepDriver;
