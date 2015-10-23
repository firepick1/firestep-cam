console.log("loading FireStepDriver");
var serialport = require("serialport");

var firepick = firepick || {};
(function(firepick) {
    var FireStepDriver = (function() {
        ///////////////////////// local variables
        var model = {};
        var queue = [];
        

        ////////////////////////// FireStep commands
        var CMD_ID = {
            "id": ""
        };
        var CMD_SYS = {
            "sys": ""
        };
        var CMD_DIM = {
            "dim": ""
        };
        var CMD_A = {
            "a": ""
        };
        var CMD_B = {
            "b": ""
        };
        var CMD_C = {
            "c": ""
        };
        var CMD_X = {
            "x": ""
        };
        var CMD_Y = {
            "y": ""
        };
        var CMD_Z = {
            "z": ""
        };
        var CMD_HOME = [{
            "hom": ""
        }, {
            "mpo": ""
        }];
        var CMD_MODEL = [CMD_ID, CMD_SYS, CMD_DIM, CMD_A, CMD_B, CMD_C, CMD_X, CMD_Y, CMD_Z];

        ////////////////// constructor
        function FireStepDriver(options) {
            var that = this;
            options = options || {};
            options.serialPath = options.serialPath || "/dev/ttyACM0";
            options.buffersize = options.buffersize || 255;
            options.baudrate = options.baudrate || 19200;

            that.serialPath = options.serialPath;
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
                    that.send(CMD_MODEL);
                    that.send(CMD_HOME);
                }
            });
            that.serial.on("data", function(error) {
                onData(that, error);
            });
            console.log("INFO\t: FireStepDriver(" + that.serialPath + ")");
            return that;
        }
        function onData(that, data) {
            console.log("READ\t: " + data + "\\n");
            if (typeof data === "string" && data.indexOf('{"s":0,"r":{') === 0) { // success
                var jdata = JSON.parse(data);
                var r = jdata.r;
                model.id = r.id || model.id;
                model.sys = r.sys || model.sys;
                model.dim = r.dim || model.dim;
                model.a = r.a || model.a;
                model.b = r.b || model.b;
                model.c = r.c || model.c;
                model.x = r.x || model.x;
                model.y = r.y || model.y;
                model.z = r.z || model.z;
                model.mpo = r.mpo || model.mpo;
                //console.log("MODEL\t:" + JSON.stringify(model));

                if (queue[0]) {
                    var jobj = queue.shift();
                    var cmd = JSON.stringify(jobj);
                    console.log("WRITE\t: " + cmd + "\\n");
                    that.serial.write(cmd);
                    that.serial.write("\n");
                }
            }
            return that;
        };

        FireStepDriver.prototype.model = function() {
            var that = this;
            that.send(CMD_MODEL);
            return model;
        }
        FireStepDriver.prototype.send = function(jobj) {
            var that = this;
            if (jobj instanceof Array) {
                for (var i = 0; i < jobj.length; i++) {
                    queue.push(jobj[i]);
                }
            } else {
                queue.push(jobj);
            }
            return that;
        }
        return FireStepDriver;
    })();
    firepick.FireStepDriver = FireStepDriver;
})(firepick);

module.exports.FireStepDriver = firepick.FireStepDriver;
