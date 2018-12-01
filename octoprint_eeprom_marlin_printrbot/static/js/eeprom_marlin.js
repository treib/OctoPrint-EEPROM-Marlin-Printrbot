/**
 * Created by Salandora on 27.07.2015.
 */
$(function() {
    function EepromMarlinViewModel(parameters) {
        var self = this;

        self.control = parameters[0];
        self.connection = parameters[1];

        self.firmwareRegEx = /FIRMWARE_NAME:\s*[^\s]+/i;
        self.marlinRegEx = /Marlin[^\s]*/i;

        self.eepromM92RegEx = /M92 ([X])(.*)[^0-9]([Y])(.*)[^0-9]([Z])(.*)[^0-9]([E])(.*)/;
        self.eepromM203RegEx = /M203 ([X])(.*)[^0-9]([Y])(.*)[^0-9]([Z])(.*)[^0-9]([E])(.*)/;
        self.eepromM201RegEx = /M201 ([X])(.*)[^0-9]([Y])(.*)[^0-9]([Z])(.*)[^0-9]([E])(.*)/;
        self.eepromM204RegEx = /M204 ([S])(.*)[^0-9]([T])(.*)/;
        self.eepromM205RegEx = /M205 ([S])(.*)[^0-9]([T])(.*)[^0-9]([B])(.*)[^0-9]([X])(.*)[^0-9]([Z])(.*)[^0-9]([E])(.*)/;
        self.eepromM206RegEx = /M206 ([X])(.*)[^0-9]([Y])(.*)[^0-9]([Z])(.*)/;
        self.eepromM210RegEx = /M210 ([X])(.*)[^0-9]([Y])(.*)[^0-9]([Z])(.*)/;
        self.eepromM211RegEx = /M211 ([X])(.*)[^0-9]([Y])(.*)[^0-9]([Z])(.*)/;
        self.eepromM212RegEx = /M212 ([X])(.*)[^0-9]([Y])(.*)[^0-9]([Z])(.*)/;
        self.eepromM301RegEx = /M301 ([P])(.*)[^0-9]([I])(.*)[^0-9]([D])(.*)/;
        self.eepromM851RegEx = /M851 ([Z])(.*)/;

        self.isMarlinFirmware = ko.observable(false);

        self.isConnected = ko.computed(function() {
            return self.connection.isOperational() || self.connection.isPrinting() ||
                   self.connection.isReady() || self.connection.isPaused();
        });

        self.eepromData = ko.observableArray([]);

        self.onStartup = function() {
            $('#settings_plugin_eeprom_marlin_printrbot_link a').on('show', function(e) {
                if (self.isConnected() && !self.isMarlinFirmware())
                    self._requestFirmwareInfo();
            });
        }

        self.fromHistoryData = function(data) {
            _.each(data.logs, function(line) {
                var match = self.firmwareRegEx.exec(line);
                if (match != null) {
                    if (self.marlinRegEx.exec(match[0]))
                        self.isMarlinFirmware(true);
                }
            });
        };

        self.fromCurrentData = function(data) {
            if (!self.isMarlinFirmware()) {
                _.each(data.logs, function (line) {
                    var match = self.firmwareRegEx.exec(line);
                    if (match) {
                        if (self.marlinRegEx.exec(match[0]))
                            self.isMarlinFirmware(true);
                    }
                });
            }
            else
            {
                var position_id = 0;

                _.each(data.logs, function (line) {
                    // M92 steps per unit
                    var match = self.eepromM92RegEx.exec(line);
                    if (match) {
                        self.eepromData.push({
                            dataType: 'M92 X',
                            position: ++position_id,
                            origValue: match[2],
                            value: match[2],
                            description: 'X steps per unit'
                        });
                        self.eepromData.push({
                            dataType: 'M92 Y',
                            position: ++position_id,
                            origValue: match[4],
                            value: match[4],
                            description: 'Y steps per unit'
                        });
                        self.eepromData.push({
                            dataType: 'M92 Z',
                            position: ++position_id,
                            origValue: match[6],
                            value: match[6],
                            description: 'Z steps per unit'
                        });
                        self.eepromData.push({
                            dataType: 'M92 E',
                            position: ++position_id,
                            origValue: match[8],
                            value: match[8],
                            description: 'E steps per unit'
                        });
                    }

                    // M203 feedrates
                    match = self.eepromM203RegEx.exec(line);
                    if (match) {
                        self.eepromData.push({
                            dataType: 'M203 X',
                            position: ++position_id,
                            origValue: match[2],
                            value: match[2],
                            description: 'X maximum feedrates (mm/s)'
                        });
                        self.eepromData.push({
                            dataType: 'M203 Y',
                            position: ++position_id,
                            origValue: match[4],
                            value: match[4],
                            description: 'Y maximum feedrates (mm/s)'
                        });
                        self.eepromData.push({
                            dataType: 'M203 Z',
                            position: ++position_id,
                            origValue: match[6],
                            value: match[6],
                            description: 'Z maximum feedrates (mm/s)'
                        });
                        self.eepromData.push({
                            dataType: 'M203 E',
                            position: ++position_id,
                            origValue: match[8],
                            value: match[8],
                            description: 'E maximum feedrates (mm/s)'
                        });
                    }

                    // M201 Maximum Acceleration (mm/s2)
                    match = self.eepromM201RegEx.exec(line);
                    if (match) {
                        self.eepromData.push({
                            dataType: 'M201 X',
                            position: ++position_id,
                            origValue: match[2],
                            value: match[2],
                            description: 'X maximum Acceleration (mm/s2)'
                        });
                        self.eepromData.push({
                            dataType: 'M201 Y',
                            position: ++position_id,
                            origValue: match[4],
                            value: match[4],
                            description: 'Y maximum Acceleration (mm/s2)'
                        });
                        self.eepromData.push({
                            dataType: 'M201 Z',
                            position: ++position_id,
                            origValue: match[6],
                            value: match[6],
                            description: 'Z maximum Acceleration (mm/s2)'
                        });
                        self.eepromData.push({
                            dataType: 'M201 E',
                            position: ++position_id,
                            origValue: match[8],
                            value: match[8],
                            description: 'E maximum Acceleration (mm/s2)'
                        });
                    }

                    // M204 Acceleration
                    match = self.eepromM204RegEx.exec(line);
                    if (match) {
                        self.eepromData.push({
                            dataType: 'M204 S',
                            position: ++position_id,
                            origValue: match[2],
                            value: match[2],
                            description: 'Acceleration'
                        });
                        self.eepromData.push({
                            dataType: 'M204 T',
                            position: ++position_id,
                            origValue: match[4],
                            value: match[4],
                            description: 'Retract acceleration'
                        });
                    }

                    // M205 Advanced variables
                    match = self.eepromM205RegEx.exec(line);
                    if (match) {
                        self.eepromData.push({
                            dataType: 'M205 S',
                            position: ++position_id,
                            origValue: match[2],
                            value: match[2],
                            description: 'Min feedrate (mm/s)'
                        });
                        self.eepromData.push({
                            dataType: 'M205 T',
                            position: ++position_id,
                            origValue: match[4],
                            value: match[4],
                            description: 'Min travel feedrate (mm/s)'
                        });
                        self.eepromData.push({
                            dataType: 'M205 B',
                            position: ++position_id,
                            origValue: match[6],
                            value: match[6],
                            description: 'Minimum segment time (ms)'
                        });
                        self.eepromData.push({
                            dataType: 'M205 X',
                            position: ++position_id,
                            origValue: match[8],
                            value: match[8],
                            description: 'Maximum XY jerk (mm/s)'
                        });
                        self.eepromData.push({
                            dataType: 'M205 Z',
                            position: ++position_id,
                            origValue: match[10],
                            value: match[10],
                            description: 'Maximum Z jerk (mm/s)'
                        });
                        self.eepromData.push({
                            dataType: 'M205 E',
                            position: ++position_id,
                            origValue: match[12],
                            value: match[12],
                            description: 'Maximum E jerk (mm/s)'
                        });
                    }

                    // M206 Home offset
                    match = self.eepromM206RegEx.exec(line);
                    if (match) {
                        self.eepromData.push({
                            dataType: 'M206 X',
                            position: ++position_id,
                            origValue: match[2],
                            value: match[2],
                            description: 'X Home offset (mm)'
                        });
                        self.eepromData.push({
                            dataType: 'M206 Y',
                            position: ++position_id,
                            origValue: match[4],
                            value: match[4],
                            description: 'Y Home offset (mm)'
                        });
                        self.eepromData.push({
                            dataType: 'M206 Z',
                            position: ++position_id,
                            origValue: match[6],
                            value: match[6],
                            description: 'Z Home offset (mm)'
                        });
                    }

                    // M210 Min position
                    match = self.eepromM210RegEx.exec(line);
                    if (match) {
                        self.eepromData.push({
                            dataType: 'M210 X',
                            position: ++position_id,
                            origValue: match[2],
                            value: match[2],
                            description: 'X Min position (mm)'
                        });
                        self.eepromData.push({
                            dataType: 'M210 Y',
                            position: ++position_id,
                            origValue: match[4],
                            value: match[4],
                            description: 'Y Min position (mm)'
                        });
                        self.eepromData.push({
                            dataType: 'M210 Z',
                            position: ++position_id,
                            origValue: match[6],
                            value: match[6],
                            description: 'Z Min position (mm)'
                        });
                    }

                    // M211 Max position
                    match = self.eepromM211RegEx.exec(line);
                    if (match) {
                        self.eepromData.push({
                            dataType: 'M211 X',
                            position: ++position_id,
                            origValue: match[2],
                            value: match[2],
                            description: 'X Max position (mm)'
                        });
                        self.eepromData.push({
                            dataType: 'M211 Y',
                            position: ++position_id,
                            origValue: match[4],
                            value: match[4],
                            description: 'Y Max position (mm)'
                        });
                        self.eepromData.push({
                            dataType: 'M211 Z',
                            position: ++position_id,
                            origValue: match[6],
                            value: match[6],
                            description: 'Z Max position (mm)'
                        });
                    }

                    // M212 Bed probe offset
                    match = self.eepromM212RegEx.exec(line);
                    if (match) {
                        self.eepromData.push({
                            dataType: 'M212 X',
                            position: ++position_id,
                            origValue: match[2],
                            value: match[2],
                            description: 'X Bed probe offset (mm)'
                        });
                        self.eepromData.push({
                            dataType: 'M212 Y',
                            position: ++position_id,
                            origValue: match[4],
                            value: match[4],
                            description: 'Y Bed probe offset (mm)'
                        });
                        self.eepromData.push({
                            dataType: 'M212 Z',
                            position: ++position_id,
                            origValue: match[6],
                            value: match[6],
                            description: 'Z Bed probe offset (mm)'
                        });
                    }

                    // M301 PID settings
                    match = self.eepromM301RegEx.exec(line);
                    if (match) {
                        self.eepromData.push({
                            dataType: 'M301 P',
                            position: ++position_id,
                            origValue: match[2],
                            value: match[2],
                            description: 'PID - Proportional (Kp)'
                        });
                        self.eepromData.push({
                            dataType: 'M301 I',
                            position: ++position_id,
                            origValue: match[4],
                            value: match[4],
                            description: 'PID - Integral (Ki)'
                        });
                        self.eepromData.push({
                            dataType: 'M301 D',
                            position: ++position_id,
                            origValue: match[6],
                            value: match[6],
                            description: 'PID - Derivative (Kd)'
                        });
                    }

                    // M851 Z-Probe Offset
                    match = self.eepromM851RegEx.exec(line);
                    if (match) {
                        self.eepromData.push({
                            dataType: 'M851 Z',
                            position: ++position_id,
                            origValue: match[2],
                            value: match[2],
                            description: 'Z-Probe Offset (mm)'
                        });
                    }
                });
            }
        };

        self.onEventConnected = function() {
            self._requestFirmwareInfo();
        }

        self.onEventDisconnected = function() {
            self.isMarlinFirmware(false);
        };

        self.loadEeprom = function() {
            self.eepromData([]);
            self._requestEepromData();
        };

        self.saveEeprom = function()  {
            var eepromData = self.eepromData();
            _.each(eepromData, function(data) {
                if (data.origValue != data.value) {
                    self._requestSaveDataToEeprom(data.dataType, data.position, data.value);
                    data.origValue = data.value;
                }
            });

            var cmd = 'M500';
            self.control.sendCustomCommand({ command: cmd });
            alert('EEPROM data stored.');
        };

        self._requestFirmwareInfo = function() {
            self.control.sendCustomCommand({ command: "M115" });
        };

        self._requestEepromData = function() {
            self.control.sendCustomCommand({ command: "M503" });
        }
        self._requestSaveDataToEeprom = function(data_type, position, value) {
            var cmd = data_type + value;
            self.control.sendCustomCommand({ command: cmd });
        }
    }

    OCTOPRINT_VIEWMODELS.push([
        EepromMarlinViewModel,
        ["controlViewModel", "connectionViewModel"],
        "#settings_plugin_eeprom_marlin_printrbot"
    ]);
});
