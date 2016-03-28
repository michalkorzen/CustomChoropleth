Custom Choropleth - SAP Lumira visualization extension
=================================================
Custom choropleth map extension for SAP Lumira with native-like drill-down and filter functionalities.<br><br>
![giphy](images/giphy.gif?raw=true "giphy")

Files
-----------
* `SampleDataset.lums` - SAP Lumira sample project
* `sap.viz.ext.customchoropleth.zip` - SAP Lumira visualization extension

"How to use it?"
-------------------------------------------
Prepare your lowest-level geoJSON and paste it's content to [geojson.js](src/bundles/sap/viz/ext/customchoropleth/geojson.js) file:
![geoJSON](images/geojson.PNG?raw=true "geoJSON")<br>
Be aware, that properties attributes should match your dimensions' names. The shape will be aggregated (merged) like a dataset in SAP Lumira.

Acknowledgements
-------------------------------------------
This extension would not be possible without the contribution of [Mustafa Aydogdu](https://scn.sap.com/people/mustafa.aydogdu)

Contact
-------------------------------------------
Michal Korzen - SAP Poland, Data Science Team<br>
[@michal_korzen](https://twitter.com/michal_korzen)
