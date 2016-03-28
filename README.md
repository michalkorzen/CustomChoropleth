Custom Choropleth - SAP Lumira visualization extension
=================================================
A custom choropleth map extension for SAP Lumira.
* Modified by [Michal Korzen](http://scn.sap.com/people/michal.korzen) - SAP Poland, Data Science Team
* Original by [Mustafa Aydogdu](https://scn.sap.com/people/mustafa.aydogdu) - SAP Turkiye

Files
-----------
* `SampleDataset.lums` - SAP Lumira demo sample project
* `sap.viz.ext.customchoropleth.zip` - SAP Lumira visualization extension

"How to use it?"
-------------------------------------------
Prepare your lowest-level geoJSON and paste it's content to [geojson.js](src/bundles/sap/viz/ext/customchoropleth/geojson.js) file:
![geoJSON](images/geojson.PNG?raw=true "geoJSON")<br>
Be aware, that properties attributes should match your dimensions' names. The shape will be aggregated (merged) like a dataset in SAP Lumira.

Contact
-------------------------------------------
Michal Korzen
[@michal_korzen](https://twitter.com/michal_korzen)
