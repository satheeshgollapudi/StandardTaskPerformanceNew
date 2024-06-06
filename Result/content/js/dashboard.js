/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 92.20979560354802, "KoPercent": 7.790204396451986};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9103355187042036, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.9388888888888889, 500, 1500, "Update Skills"], "isController": false}, {"data": [1.0, 500, 1500, "Add Education"], "isController": false}, {"data": [1.0, 500, 1500, "Add Certification"], "isController": false}, {"data": [1.0, 500, 1500, "Delete Education"], "isController": false}, {"data": [1.0, 500, 1500, "Add Description"], "isController": false}, {"data": [1.0, 500, 1500, "Add Share Skill "], "isController": false}, {"data": [1.0, 500, 1500, "View Manage Listing"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "Update Education"], "isController": false}, {"data": [1.0, 500, 1500, "Add Language"], "isController": false}, {"data": [1.0, 500, 1500, "Add Skills"], "isController": false}, {"data": [1.0, 500, 1500, "Delete Language"], "isController": false}, {"data": [0.7292857142857143, 500, 1500, "SignIn"], "isController": false}, {"data": [1.0, 500, 1500, "Update Language"], "isController": false}, {"data": [1.0, 500, 1500, "Sign Out"], "isController": false}, {"data": [0.9888888888888889, 500, 1500, "Delete Skill"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 2593, 202, 7.790204396451986, 324.07944465869684, 2, 3607, 102.0, 287.0, 2903.5999999999995, 3298.0, 86.20918944078728, 27.345243512700314, 50.38631329376953], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Update Skills", 180, 11, 6.111111111111111, 188.07222222222222, 17, 486, 204.0, 242.8, 291.1999999999998, 436.58999999999986, 7.185055085422321, 1.3749915800135717, 4.774911933178988], "isController": false}, {"data": ["Add Education", 90, 0, 0.0, 66.03333333333335, 52, 218, 58.0, 71.80000000000001, 120.20000000000005, 218.0, 3.5969785380280563, 0.745857854402302, 2.4026692578234283], "isController": false}, {"data": ["Add Certification", 90, 0, 0.0, 65.19999999999999, 51, 220, 57.0, 81.40000000000003, 146.40000000000003, 220.0, 3.585657370517928, 0.7260800547808764, 2.318071464143426], "isController": false}, {"data": ["Delete Education", 90, 0, 0.0, 39.07777777777777, 4, 88, 50.0, 56.900000000000006, 64.25000000000001, 88.0, 3.6571985858832132, 0.7809642813604778, 2.1440802907472873], "isController": false}, {"data": ["Add Description", 90, 0, 0.0, 173.0333333333334, 145, 434, 160.0, 197.8, 305.4500000000004, 434.0, 3.574123346967952, 0.7678780628251459, 2.177981414558596], "isController": false}, {"data": ["Add Share Skill ", 91, 0, 0.0, 232.21978021978023, 207, 424, 217.0, 286.79999999999995, 353.5999999999997, 424.0, 3.578591372055527, 0.7828168626371466, 6.695879950057022], "isController": false}, {"data": ["View Manage Listing", 91, 0, 0.0, 112.7802197802198, 101, 297, 107.0, 130.99999999999997, 148.7999999999999, 297.0, 3.6198735033215326, 4.81432609690123, 2.1917202852142093], "isController": false}, {"data": ["Update Education", 90, 30, 33.333333333333336, 131.8444444444444, 6, 234, 184.0, 211.9, 216.35000000000002, 234.0, 3.635482307319438, 0.648793158729197, 2.553831646873485], "isController": false}, {"data": ["Add Language", 90, 0, 0.0, 65.26666666666665, 51, 187, 57.0, 88.10000000000005, 133.9500000000001, 187.0, 3.588087549336204, 0.7253262917115179, 2.140938957660567], "isController": false}, {"data": ["Add Skills", 90, 0, 0.0, 64.03333333333333, 52, 149, 58.0, 87.80000000000001, 113.80000000000001, 149.0, 3.612861787965156, 0.7621664375175625, 2.2157003934005055], "isController": false}, {"data": ["Delete Language", 90, 0, 0.0, 56.077777777777776, 48, 93, 53.0, 69.70000000000002, 80.25000000000001, 93.0, 3.6475642376590742, 0.6981665923644322, 2.137244670503364], "isController": false}, {"data": ["SignIn", 700, 159, 22.714285714285715, 939.2114285714304, 198, 3607, 234.0, 3181.7, 3263.7499999999995, 3450.71, 23.56981716556113, 11.324560591265698, 8.532352730731674], "isController": false}, {"data": ["Update Language", 90, 0, 0.0, 219.0333333333333, 188, 486, 206.0, 245.0, 339.1500000000001, 486.0, 3.599712023038157, 0.7557989110871131, 2.2744274208063358], "isController": false}, {"data": ["Sign Out", 541, 0, 0.0, 55.28465804066541, 46, 117, 53.0, 62.0, 74.89999999999998, 102.16000000000008, 21.5177790151937, 4.366098995207223, 11.725508486795004], "isController": false}, {"data": ["Delete Skill", 180, 2, 1.1111111111111112, 47.60555555555554, 2, 101, 53.0, 61.900000000000006, 71.89999999999998, 92.08999999999997, 7.254554247944543, 1.4591367710180556, 4.622731692326293], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["The operation lasted too long: It took 3,607 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 0.49504950495049505, 0.03856536829926726], "isController": false}, {"data": ["The operation lasted too long: It took 3,120 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 0.49504950495049505, 0.03856536829926726], "isController": false}, {"data": ["The operation lasted too long: It took 3,097 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 0.49504950495049505, 0.03856536829926726], "isController": false}, {"data": ["The operation lasted too long: It took 3,167 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 0.49504950495049505, 0.03856536829926726], "isController": false}, {"data": ["The operation lasted too long: It took 3,342 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 0.49504950495049505, 0.03856536829926726], "isController": false}, {"data": ["The operation lasted too long: It took 3,227 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 2, 0.9900990099009901, 0.07713073659853452], "isController": false}, {"data": ["The operation lasted too long: It took 3,053 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 0.49504950495049505, 0.03856536829926726], "isController": false}, {"data": ["The operation lasted too long: It took 3,554 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 0.49504950495049505, 0.03856536829926726], "isController": false}, {"data": ["The operation lasted too long: It took 3,174 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 0.49504950495049505, 0.03856536829926726], "isController": false}, {"data": ["The operation lasted too long: It took 3,585 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 0.49504950495049505, 0.03856536829926726], "isController": false}, {"data": ["The operation lasted too long: It took 3,325 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 0.49504950495049505, 0.03856536829926726], "isController": false}, {"data": ["The operation lasted too long: It took 3,022 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 0.49504950495049505, 0.03856536829926726], "isController": false}, {"data": ["The operation lasted too long: It took 3,109 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 0.49504950495049505, 0.03856536829926726], "isController": false}, {"data": ["The operation lasted too long: It took 2,660 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 0.49504950495049505, 0.03856536829926726], "isController": false}, {"data": ["The operation lasted too long: It took 3,157 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 0.49504950495049505, 0.03856536829926726], "isController": false}, {"data": ["The operation lasted too long: It took 3,332 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 0.49504950495049505, 0.03856536829926726], "isController": false}, {"data": ["The operation lasted too long: It took 2,687 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 0.49504950495049505, 0.03856536829926726], "isController": false}, {"data": ["The operation lasted too long: It took 3,012 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 0.49504950495049505, 0.03856536829926726], "isController": false}, {"data": ["The operation lasted too long: It took 2,427 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 0.49504950495049505, 0.03856536829926726], "isController": false}, {"data": ["The operation lasted too long: It took 3,537 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 0.49504950495049505, 0.03856536829926726], "isController": false}, {"data": ["The operation lasted too long: It took 3,224 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 0.49504950495049505, 0.03856536829926726], "isController": false}, {"data": ["The operation lasted too long: It took 3,292 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 0.49504950495049505, 0.03856536829926726], "isController": false}, {"data": ["The operation lasted too long: It took 2,990 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 0.49504950495049505, 0.03856536829926726], "isController": false}, {"data": ["The operation lasted too long: It took 2,313 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 2, 0.9900990099009901, 0.07713073659853452], "isController": false}, {"data": ["The operation lasted too long: It took 2,953 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 0.49504950495049505, 0.03856536829926726], "isController": false}, {"data": ["The operation lasted too long: It took 3,355 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 0.49504950495049505, 0.03856536829926726], "isController": false}, {"data": ["The operation lasted too long: It took 3,366 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 0.49504950495049505, 0.03856536829926726], "isController": false}, {"data": ["The operation lasted too long: It took 3,192 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 2, 0.9900990099009901, 0.07713073659853452], "isController": false}, {"data": ["The operation lasted too long: It took 2,905 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 0.49504950495049505, 0.03856536829926726], "isController": false}, {"data": ["The operation lasted too long: It took 3,080 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 0.49504950495049505, 0.03856536829926726], "isController": false}, {"data": ["The operation lasted too long: It took 2,569 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 0.49504950495049505, 0.03856536829926726], "isController": false}, {"data": ["The operation lasted too long: It took 3,077 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 0.49504950495049505, 0.03856536829926726], "isController": false}, {"data": ["The operation lasted too long: It took 3,210 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 0.49504950495049505, 0.03856536829926726], "isController": false}, {"data": ["The operation lasted too long: It took 3,221 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 0.49504950495049505, 0.03856536829926726], "isController": false}, {"data": ["The operation lasted too long: It took 2,504 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 0.49504950495049505, 0.03856536829926726], "isController": false}, {"data": ["The operation lasted too long: It took 3,154 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 2, 0.9900990099009901, 0.07713073659853452], "isController": false}, {"data": ["The operation lasted too long: It took 2,615 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 0.49504950495049505, 0.03856536829926726], "isController": false}, {"data": ["500/Internal Server Error", 43, 21.287128712871286, 1.658310836868492], "isController": false}, {"data": ["The operation lasted too long: It took 3,129 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 0.49504950495049505, 0.03856536829926726], "isController": false}, {"data": ["The operation lasted too long: It took 2,168 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 0.49504950495049505, 0.03856536829926726], "isController": false}, {"data": ["The operation lasted too long: It took 3,191 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 0.49504950495049505, 0.03856536829926726], "isController": false}, {"data": ["The operation lasted too long: It took 3,087 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 0.49504950495049505, 0.03856536829926726], "isController": false}, {"data": ["The operation lasted too long: It took 3,211 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 0.49504950495049505, 0.03856536829926726], "isController": false}, {"data": ["The operation lasted too long: It took 2,914 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 0.49504950495049505, 0.03856536829926726], "isController": false}, {"data": ["The operation lasted too long: It took 2,233 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 0.49504950495049505, 0.03856536829926726], "isController": false}, {"data": ["The operation lasted too long: It took 3,175 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 0.49504950495049505, 0.03856536829926726], "isController": false}, {"data": ["The operation lasted too long: It took 2,616 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 0.49504950495049505, 0.03856536829926726], "isController": false}, {"data": ["The operation lasted too long: It took 3,127 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 0.49504950495049505, 0.03856536829926726], "isController": false}, {"data": ["The operation lasted too long: It took 3,160 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 2, 0.9900990099009901, 0.07713073659853452], "isController": false}, {"data": ["The operation lasted too long: It took 3,178 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 0.49504950495049505, 0.03856536829926726], "isController": false}, {"data": ["The operation lasted too long: It took 3,529 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 0.49504950495049505, 0.03856536829926726], "isController": false}, {"data": ["The operation lasted too long: It took 3,331 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 0.49504950495049505, 0.03856536829926726], "isController": false}, {"data": ["The operation lasted too long: It took 3,209 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 2, 0.9900990099009901, 0.07713073659853452], "isController": false}, {"data": ["The operation lasted too long: It took 3,397 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 0.49504950495049505, 0.03856536829926726], "isController": false}, {"data": ["The operation lasted too long: It took 3,055 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 0.49504950495049505, 0.03856536829926726], "isController": false}, {"data": ["The operation lasted too long: It took 3,276 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 2, 0.9900990099009901, 0.07713073659853452], "isController": false}, {"data": ["The operation lasted too long: It took 3,298 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 2, 0.9900990099009901, 0.07713073659853452], "isController": false}, {"data": ["The operation lasted too long: It took 3,074 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 0.49504950495049505, 0.03856536829926726], "isController": false}, {"data": ["The operation lasted too long: It took 2,919 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 0.49504950495049505, 0.03856536829926726], "isController": false}, {"data": ["The operation lasted too long: It took 3,096 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 0.49504950495049505, 0.03856536829926726], "isController": false}, {"data": ["The operation lasted too long: It took 3,182 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 0.49504950495049505, 0.03856536829926726], "isController": false}, {"data": ["The operation lasted too long: It took 3,257 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 0.49504950495049505, 0.03856536829926726], "isController": false}, {"data": ["The operation lasted too long: It took 3,030 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 2, 0.9900990099009901, 0.07713073659853452], "isController": false}, {"data": ["The operation lasted too long: It took 3,228 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 0.49504950495049505, 0.03856536829926726], "isController": false}, {"data": ["The operation lasted too long: It took 2,866 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 0.49504950495049505, 0.03856536829926726], "isController": false}, {"data": ["The operation lasted too long: It took 3,213 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 0.49504950495049505, 0.03856536829926726], "isController": false}, {"data": ["The operation lasted too long: It took 3,151 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 0.49504950495049505, 0.03856536829926726], "isController": false}, {"data": ["The operation lasted too long: It took 2,398 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 0.49504950495049505, 0.03856536829926726], "isController": false}, {"data": ["The operation lasted too long: It took 3,162 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 0.49504950495049505, 0.03856536829926726], "isController": false}, {"data": ["The operation lasted too long: It took 2,771 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 0.49504950495049505, 0.03856536829926726], "isController": false}, {"data": ["The operation lasted too long: It took 2,290 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 0.49504950495049505, 0.03856536829926726], "isController": false}, {"data": ["The operation lasted too long: It took 2,760 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 0.49504950495049505, 0.03856536829926726], "isController": false}, {"data": ["The operation lasted too long: It took 3,230 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 0.49504950495049505, 0.03856536829926726], "isController": false}, {"data": ["The operation lasted too long: It took 3,404 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 0.49504950495049505, 0.03856536829926726], "isController": false}, {"data": ["The operation lasted too long: It took 3,373 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 0.49504950495049505, 0.03856536829926726], "isController": false}, {"data": ["The operation lasted too long: It took 3,259 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 0.49504950495049505, 0.03856536829926726], "isController": false}, {"data": ["The operation lasted too long: It took 3,248 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 0.49504950495049505, 0.03856536829926726], "isController": false}, {"data": ["The operation lasted too long: It took 3,083 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 0.49504950495049505, 0.03856536829926726], "isController": false}, {"data": ["The operation lasted too long: It took 2,903 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 0.49504950495049505, 0.03856536829926726], "isController": false}, {"data": ["The operation lasted too long: It took 3,138 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 3, 1.4851485148514851, 0.11569610489780177], "isController": false}, {"data": ["The operation lasted too long: It took 3,145 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 2, 0.9900990099009901, 0.07713073659853452], "isController": false}, {"data": ["The operation lasted too long: It took 3,037 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 0.49504950495049505, 0.03856536829926726], "isController": false}, {"data": ["The operation lasted too long: It took 3,250 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 0.49504950495049505, 0.03856536829926726], "isController": false}, {"data": ["The operation lasted too long: It took 2,080 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 0.49504950495049505, 0.03856536829926726], "isController": false}, {"data": ["The operation lasted too long: It took 3,075 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 0.49504950495049505, 0.03856536829926726], "isController": false}, {"data": ["The operation lasted too long: It took 3,243 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 0.49504950495049505, 0.03856536829926726], "isController": false}, {"data": ["The operation lasted too long: It took 3,287 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 2, 0.9900990099009901, 0.07713073659853452], "isController": false}, {"data": ["The operation lasted too long: It took 3,128 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 2, 0.9900990099009901, 0.07713073659853452], "isController": false}, {"data": ["The operation lasted too long: It took 3,135 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 2, 0.9900990099009901, 0.07713073659853452], "isController": false}, {"data": ["The operation lasted too long: It took 3,310 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 0.49504950495049505, 0.03856536829926726], "isController": false}, {"data": ["The operation lasted too long: It took 3,179 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 0.49504950495049505, 0.03856536829926726], "isController": false}, {"data": ["The operation lasted too long: It took 3,193 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 0.49504950495049505, 0.03856536829926726], "isController": false}, {"data": ["The operation lasted too long: It took 3,246 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 2, 0.9900990099009901, 0.07713073659853452], "isController": false}, {"data": ["The operation lasted too long: It took 3,006 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 0.49504950495049505, 0.03856536829926726], "isController": false}, {"data": ["The operation lasted too long: It took 2,261 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 0.49504950495049505, 0.03856536829926726], "isController": false}, {"data": ["The operation lasted too long: It took 2,964 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 0.49504950495049505, 0.03856536829926726], "isController": false}, {"data": ["The operation lasted too long: It took 2,194 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 0.49504950495049505, 0.03856536829926726], "isController": false}, {"data": ["The operation lasted too long: It took 2,830 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 0.49504950495049505, 0.03856536829926726], "isController": false}, {"data": ["The operation lasted too long: It took 3,267 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 0.49504950495049505, 0.03856536829926726], "isController": false}, {"data": ["The operation lasted too long: It took 3,319 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 0.49504950495049505, 0.03856536829926726], "isController": false}, {"data": ["The operation lasted too long: It took 3,291 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 0.49504950495049505, 0.03856536829926726], "isController": false}, {"data": ["The operation lasted too long: It took 3,165 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 0.49504950495049505, 0.03856536829926726], "isController": false}, {"data": ["The operation lasted too long: It took 3,323 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 0.49504950495049505, 0.03856536829926726], "isController": false}, {"data": ["The operation lasted too long: It took 3,401 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 0.49504950495049505, 0.03856536829926726], "isController": false}, {"data": ["The operation lasted too long: It took 3,166 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 0.49504950495049505, 0.03856536829926726], "isController": false}, {"data": ["The operation lasted too long: It took 3,107 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 0.49504950495049505, 0.03856536829926726], "isController": false}, {"data": ["The operation lasted too long: It took 3,222 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 2, 0.9900990099009901, 0.07713073659853452], "isController": false}, {"data": ["The operation lasted too long: It took 3,089 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 0.49504950495049505, 0.03856536829926726], "isController": false}, {"data": ["The operation lasted too long: It took 2,575 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 0.49504950495049505, 0.03856536829926726], "isController": false}, {"data": ["The operation lasted too long: It took 2,828 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 0.49504950495049505, 0.03856536829926726], "isController": false}, {"data": ["The operation lasted too long: It took 2,419 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 0.49504950495049505, 0.03856536829926726], "isController": false}, {"data": ["The operation lasted too long: It took 3,451 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 0.49504950495049505, 0.03856536829926726], "isController": false}, {"data": ["The operation lasted too long: It took 2,122 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 0.49504950495049505, 0.03856536829926726], "isController": false}, {"data": ["The operation lasted too long: It took 3,238 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 0.49504950495049505, 0.03856536829926726], "isController": false}, {"data": ["The operation lasted too long: It took 3,245 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 0.49504950495049505, 0.03856536829926726], "isController": false}, {"data": ["The operation lasted too long: It took 3,201 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 0.49504950495049505, 0.03856536829926726], "isController": false}, {"data": ["The operation lasted too long: It took 3,223 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 2, 0.9900990099009901, 0.07713073659853452], "isController": false}, {"data": ["The operation lasted too long: It took 2,876 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 0.49504950495049505, 0.03856536829926726], "isController": false}, {"data": ["The operation lasted too long: It took 3,422 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 0.49504950495049505, 0.03856536829926726], "isController": false}, {"data": ["The operation lasted too long: It took 3,124 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 0.49504950495049505, 0.03856536829926726], "isController": false}, {"data": ["The operation lasted too long: It took 2,933 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 0.49504950495049505, 0.03856536829926726], "isController": false}, {"data": ["The operation lasted too long: It took 2,981 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 0.49504950495049505, 0.03856536829926726], "isController": false}, {"data": ["The operation lasted too long: It took 3,286 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 0.49504950495049505, 0.03856536829926726], "isController": false}, {"data": ["The operation lasted too long: It took 3,343 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 0.49504950495049505, 0.03856536829926726], "isController": false}, {"data": ["The operation lasted too long: It took 3,264 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 0.49504950495049505, 0.03856536829926726], "isController": false}, {"data": ["The operation lasted too long: It took 3,242 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 0.49504950495049505, 0.03856536829926726], "isController": false}, {"data": ["The operation lasted too long: It took 2,882 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 0.49504950495049505, 0.03856536829926726], "isController": false}, {"data": ["The operation lasted too long: It took 2,823 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 0.49504950495049505, 0.03856536829926726], "isController": false}, {"data": ["The operation lasted too long: It took 3,315 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 0.49504950495049505, 0.03856536829926726], "isController": false}, {"data": ["The operation lasted too long: It took 3,304 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 0.49504950495049505, 0.03856536829926726], "isController": false}, {"data": ["The operation lasted too long: It took 3,247 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 0.49504950495049505, 0.03856536829926726], "isController": false}, {"data": ["The operation lasted too long: It took 2,004 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 0.49504950495049505, 0.03856536829926726], "isController": false}, {"data": ["The operation lasted too long: It took 3,541 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 0.49504950495049505, 0.03856536829926726], "isController": false}, {"data": ["The operation lasted too long: It took 3,062 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 0.49504950495049505, 0.03856536829926726], "isController": false}, {"data": ["The operation lasted too long: It took 2,700 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 0.49504950495049505, 0.03856536829926726], "isController": false}, {"data": ["The operation lasted too long: It took 2,946 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 0.49504950495049505, 0.03856536829926726], "isController": false}, {"data": ["The operation lasted too long: It took 3,150 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 1, 0.49504950495049505, 0.03856536829926726], "isController": false}, {"data": ["The operation lasted too long: It took 3,251 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 3, 1.4851485148514851, 0.11569610489780177], "isController": false}, {"data": ["The operation lasted too long: It took 3,069 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 2, 0.9900990099009901, 0.07713073659853452], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 2593, 202, "500/Internal Server Error", 43, "The operation lasted too long: It took 3,138 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 3, "The operation lasted too long: It took 3,251 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 3, "The operation lasted too long: It took 3,227 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 2, "The operation lasted too long: It took 2,313 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 2], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Update Skills", 180, 11, "500/Internal Server Error", 11, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Update Education", 90, 30, "500/Internal Server Error", 30, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["SignIn", 700, 159, "The operation lasted too long: It took 3,138 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 3, "The operation lasted too long: It took 3,251 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 3, "The operation lasted too long: It took 3,227 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 2, "The operation lasted too long: It took 2,313 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 2, "The operation lasted too long: It took 3,192 milliseconds, but should not have lasted longer than 2,000 milliseconds.", 2], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Delete Skill", 180, 2, "500/Internal Server Error", 2, "", "", "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
