define(['dojo/_base/declare',
        'dijit/_AttachMixin',
    'dijit/_WidgetsInTemplateMixin',
        'jimu/BaseWidget',
        'dojo/request',
       'dojo/text!./_templates/google-result.html',
       'dojo/parser', 'esri/geometry/Point', 'esri/SpatialReference', "dgrid/OnDemandGrid",
      "dgrid/Selection", "dojo/number", "dojo/_base/array", "dojo/store/Memory","dojo/dom-style",
       'dojo/dom-construct', 'dojox/dtl/_base', 'dojox/dtl/Context'

       ],
    function (declare, _AttachMixin, _WidgetsInTemplateMixin, BaseWidget, request, template, parser, Point, SpatialReference, Grid,
        Selection, dojoNum, array, Memory,domStyle,
        domConst, dtl, context) {

        return declare([BaseWidget, _WidgetsInTemplateMixin], {

            baseClass: 'google-geocoder-widget',
       
            _templateString: template,
            //methods to communication with app container:
            postCreate: function () {
                this.inherited(arguments);
                console.log('geocoder::postCreate');
                this.grid = new(declare([Grid, Selection]))({
                    // use Infinity so that all data is available in the grid
                    bufferRows: Infinity,
                    columns: {
                        "select": "Select",
                        "type": {
                            "label": "Type"
                        },
                        "address": {
                            "label": "Address"
                        }
                    }
                }, this.finalResults);
                this.grid.on(".field-select:click", this.selectState);
            },

            startup: function () {
                this.inherited(arguments);
                console.log('geocoder::startup');
            },

            onOpen: function () {
                console.log('geocoder::onOpen');
            },

            onClose: function () {
                console.log('geocoder::onClose');
            },

                   onClickSearch: function () {
                    var that = this;
                    var address = this.txtaddress.get('value');

                    var geocodeResultDiv = this.geocodeResultDiv;
                    var templateObj = new dtl.Template(this._templateString);



                    var requestURL = this.config.apiUrl + "?address=" + address + "&key=" + this.config.apiKey;
                    request(requestURL, {
                        headers: {
                            "X-Requested-With": null
                        },
                        handleAs: "json"
                    }).then(function (data) {
                        console.log(that);
                        console.log(data);

                        var ndata = array.map(data.results, function (feature) {
                            return {
                                "select": 'select',
                                "type": feature.geometry.location_type,
                                "address": feature.formatted_address
                            };
                        });
                        var memStore = new Memory({
                            data: ndata
                        });
                        console.log(ndata);
                        that.grid.set("store", memStore);
                        that.grid.startup();                    
                    }, function (err) {
                        console.log(err.message);
                    });
                },

            onZoom: function (x, y) {
                console.log(x + ',' + y);
                var point = new Point([x, y], new SpatialReference({
                    wkid: 4326
                }));
                this.map.centerAndZoom(point, 12);
            },
     
            selectState:function(e){
                console.log(e);
            }
                

        });

    });
