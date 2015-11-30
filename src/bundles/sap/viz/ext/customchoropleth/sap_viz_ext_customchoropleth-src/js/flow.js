/*
 * A custom choropleth map extension for SAP Lumira.
 * =================================================
 * Modified by Michal Korzen, SAP Poland
 * Original by Mustafa Aydogdu, SAP Turkiye
 */

/*<<dependency*/
define("sap_viz_ext_customchoropleth-src/js/flow", [ "sap_viz_ext_customchoropleth-src/js/module" ], function(moduleFunc) {
/*dependency>>*/
    var flowRegisterFunc = function(){
		var flow = sap.viz.extapi.Flow.createFlow({
			id : "sap.viz.ext.customchoropleth",
			name : "Custom Choropleth",
			dataModel : "sap.viz.api.data.CrosstableDataset",
			type : "DIV"
		});
		
		var dataFilter  = sap.viz.extapi.Flow.createElement({
            id : 'sap.viz.modules.dataFilter'
        });
        flow.addElement({
            'element':dataFilter,
            'propertyCategory' : 'tooltip'
        });
		
		var element  = sap.viz.extapi.Flow.createElement({
			id : "sap.viz.ext.module.customchoropleth",
			name : "Custom Choropleth"
		});
		element.implement("sap.viz.elements.common.BaseGraphic", moduleFunc);
		
        element.addProperty({
            name: "colorPalette",
            type: "StringArray",
            supportedValues: "",
            defaultValue: d3.scale.category20().range().concat(d3.scale.category20b().range()).concat(d3.scale.category20c().range())
        });
        
        /*Feeds Definition*/
		//ds1: Name, Lattitude, Longtitude
		var ds1 = {
		    "id": "sap.viz.ext.module.customchoropleth.DS1",
		    "name": "Geography",
		    "type": "Dimension",
		    "min": 1,
		    "max": 4,
		    "aaIndex": 1,
		    "minStackedDims": 1,
		    "maxStackedDims": 1
		};
		element.addFeed(ds1);
		
		//ms1: Measure
		var ms1 = {
		    "id": "sap.viz.ext.module.customchoropleth.MS1",
		    "name": "Color",
		    "type": "Measure",
		    "min": 1,
		    "max": 1,
		    "mgIndex": 1
		};
		element.addFeed(ms1);
		
		flow.addElement({
			"element":element,
			"propertyCategory" : "plotArea"
		});
		sap.viz.extapi.Flow.registerFlow(flow);
    };
    flowRegisterFunc.id = "sap.viz.ext.customchoropleth";
    return {
        id : flowRegisterFunc.id,
        init : flowRegisterFunc
    };
});