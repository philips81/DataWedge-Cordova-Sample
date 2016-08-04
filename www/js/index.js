/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
        document.getElementById("scanButton").addEventListener("click", startSoftTrigger);
        document.getElementById("disableScanningButton").addEventListener("click", disableEnableScanning);
        window.plugins.intent.setNewIntentHandler(function (intent) {
            console.log('Received Intent: ' + JSON.stringify(intent.extras));
            var decodedBarcode = intent.extras["com.symbol.datawedge.data_string"];
            var parentElement = document.getElementById('barcodeData');
            if (parentElement && decodedBarcode)
            {
                parentElement.innerHTML = "Barcode: " + decodedBarcode;
                parentElement.setAttribute('style', 'background-color:#0077A0;color:#FFFFFF;');
            }
        });
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};

app.initialize();

function startSoftTrigger()
{
    window.plugins.webintent.sendBroadcast({
        action: 'com.symbol.datawedge.api.ACTION_SOFTSCANTRIGGER', 
        extras: {
            'com.symbol.datawedge.api.EXTRA_PARAMETER': 'START_SCANNING'
            }
        }, 
        function() {}, 
        function() {}
    );
}

function disableEnableScanning()
{
    var button = document.getElementById("disableScanningButton");
    if (button.innerHTML == "Disable Scanning")
    {
        console.log("Disabling scanning");
        window.plugins.webintent.sendBroadcast({
            action: 'com.symbol.datawedge.api.ACTION_SCANNERINPUTPLUGIN', 
            extras: {
                'com.symbol.datawedge.api.EXTRA_PARAMETER': 'DISABLE_PLUGIN'
                }
            }, 
            function() {}, 
            function() {}
        );
        button.innerHTML = "Enable Scanning";
    }
    else
    {
        console.log("Enabling scanning");
        window.plugins.webintent.sendBroadcast({
            action: 'com.symbol.datawedge.api.ACTION_SCANNERINPUTPLUGIN', 
            extras: {
                'com.symbol.datawedge.api.EXTRA_PARAMETER': 'ENABLE_PLUGIN'
                }
            }, 
            function() {}, 
            function() {}
        );
        button.innerHTML = "Disable Scanning";
    }
}