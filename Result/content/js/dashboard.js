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

    var data = {"OkPercent": 94.24370124630144, "KoPercent": 5.756298753698556};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.49125795750022416, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "SignOut"], "isController": false}, {"data": [0.4827315541601256, 500, 1500, "Add Education"], "isController": false}, {"data": [0.6538461538461539, 500, 1500, "Delete Education"], "isController": false}, {"data": [0.5376766091051806, 500, 1500, "Add Certification"], "isController": false}, {"data": [0.4976452119309262, 500, 1500, "Add Description"], "isController": false}, {"data": [0.45918367346938777, 500, 1500, "Update Education"], "isController": false}, {"data": [0.47566718995290425, 500, 1500, "Add Language"], "isController": false}, {"data": [0.21305418719211822, 500, 1500, "Enable/Disable ShareSkill"], "isController": false}, {"data": [0.4497645211930926, 500, 1500, "Add Skill"], "isController": false}, {"data": [0.044444444444444446, 500, 1500, "SearchSkill"], "isController": false}, {"data": [0.46938775510204084, 500, 1500, "Update Certification"], "isController": false}, {"data": [0.5368916797488226, 500, 1500, "Delete Language"], "isController": false}, {"data": [0.9422604422604423, 500, 1500, "View ShareSkill"], "isController": false}, {"data": [0.6459968602825745, 500, 1500, "SignIn"], "isController": false}, {"data": [0.4207221350078493, 500, 1500, "Update Language"], "isController": false}, {"data": [0.6467817896389325, 500, 1500, "Delete Certification"], "isController": false}, {"data": [0.13500784929356358, 500, 1500, "Add ShareSkill"], "isController": false}, {"data": [0.22972972972972974, 500, 1500, "Delete ShareSkill"], "isController": false}, {"data": [0.6255886970172685, 500, 1500, "Delete Skill"], "isController": false}, {"data": [0.46938775510204084, 500, 1500, "Update Skill"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 11153, 642, 5.756298753698556, 22647.23607997848, 2, 451387, 865.0, 77475.6, 155033.19999999995, 323582.77999999974, 13.37139459101732, 5.41217265942148, 9.05363896335425], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["SignOut", 137, 0, 0.0, 32.554744525547456, 4, 188, 20.0, 68.00000000000001, 117.39999999999998, 181.92000000000007, 0.2905694312474549, 0.5734773638194397, 0.06044071177315223], "isController": false}, {"data": ["Add Education", 637, 0, 0.0, 4232.626373626375, 50, 149737, 1008.0, 5208.4000000000015, 8512.000000000015, 106597.96000000018, 1.1532605409280758, 0.23380873741959313, 0.8120125488370535], "isController": false}, {"data": ["Delete Education", 637, 0, 0.0, 2078.0941915227627, 6, 149911, 178.0, 4113.000000000002, 6155.100000000003, 24849.4, 1.1566403320665368, 0.24631590421311236, 0.6947700836884662], "isController": false}, {"data": ["Add Certification", 637, 0, 0.0, 3187.411302982734, 50, 113656, 602.0, 5064.4000000000015, 7391.000000000018, 62631.22000000002, 1.1570584196434734, 0.23480576074774673, 0.7604495277539626], "isController": false}, {"data": ["Add Description", 637, 0, 0.0, 4329.439560439561, 143, 131732, 872.0, 10839.400000000001, 13324.100000000006, 31170.060000000005, 1.1625296791819588, 0.24976223576174894, 0.8162683977849886], "isController": false}, {"data": ["Update Education", 637, 24, 3.767660910518053, 5966.273155416021, 7, 150944, 1027.0, 16437.600000000006, 24628.8, 90920.54000000015, 1.154508382419574, 0.24541409435885816, 0.8772637488672406], "isController": false}, {"data": ["Add Language", 637, 0, 0.0, 8062.436420722118, 50, 150802, 1195.0, 23961.400000000012, 58226.0, 87687.12, 1.1482070305599716, 0.23426459547783077, 0.6783840366101396], "isController": false}, {"data": ["Enable/Disable ShareSkill", 406, 199, 49.01477832512315, 24269.004926108366, 159, 398674, 4397.5, 103794.6, 128178.35, 250466.5200000006, 0.6707805671895781, 0.09909625071249784, 0.37231077245090993], "isController": false}, {"data": ["Add Skill", 637, 0, 0.0, 14065.825745682887, 51, 153581, 1500.0, 61419.200000000004, 96739.3, 150927.06, 1.1422648763413095, 0.24857983200905923, 0.6994141381503917], "isController": false}, {"data": ["SearchSkill", 315, 46, 14.603174603174603, 160651.09523809527, 1224, 451387, 189579.0, 299596.0, 306816.0, 443654.7999999995, 0.4870272936279823, 2.9105210675058486, 0.3557582183923152], "isController": false}, {"data": ["Update Certification", 637, 93, 14.599686028257457, 4303.604395604399, 17, 150631, 594.0, 7777.600000000003, 12536.600000000011, 83558.10000000006, 1.1576345727474284, 0.23361648073183586, 0.8216428370224985], "isController": false}, {"data": ["Delete Language", 637, 38, 5.965463108320251, 2976.9434850863413, 14, 132020, 289.0, 4190.200000000003, 7854.2000000000335, 58287.3, 1.149902520037548, 0.21300295542548198, 0.689134467628529], "isController": false}, {"data": ["View ShareSkill", 407, 0, 0.0, 317.48894348894356, 4, 26316, 25.0, 478.19999999999976, 826.7999999999997, 7113.280000000055, 0.6712051348017389, 0.11536338254404888, 0.39712208172128666], "isController": false}, {"data": ["SignIn", 637, 0, 0.0, 33008.18995290428, 194, 159699, 401.0, 154463.0, 157226.4, 159244.4, 0.9055318471428125, 0.4350797546818982, 0.31716687187435144], "isController": false}, {"data": ["Update Language", 637, 0, 0.0, 18373.299843014087, 58, 160657, 2525.0, 68556.8, 125363.7, 149972.28, 1.148600402460926, 0.24603885282858629, 0.7197611532119339], "isController": false}, {"data": ["Delete Certification", 637, 32, 5.023547880690738, 1464.8885400313998, 20, 82620, 132.0, 3501.6000000000004, 4203.9000000000015, 19688.420000000035, 1.1598625644798009, 0.23545660996480355, 0.7008949218230782], "isController": false}, {"data": ["Add ShareSkill", 637, 0, 0.0, 166724.03924646767, 111, 406085, 138628.0, 361196.0000000002, 392721.10000000003, 404843.22, 1.0082464109909939, 0.22493598298089557, 1.656123499303566], "isController": false}, {"data": ["Delete ShareSkill", 333, 210, 63.06306306306306, 32669.05105105104, 84, 413105, 2753.0, 135429.2, 233983.80000000013, 412917.7, 0.5511538646147633, 0.07743812656511974, 0.31907223570682586], "isController": false}, {"data": ["Delete Skill", 637, 0, 0.0, 4120.827315541603, 2, 74772, 187.0, 13460.400000000001, 24304.2, 72232.78000000001, 1.1471111527296562, 0.25178348378287363, 0.7195682958826454], "isController": false}, {"data": ["Update Skill", 637, 0, 0.0, 11429.24175824176, 50, 155124, 1296.0, 24531.0, 77433.3, 151112.26, 1.1457926744815603, 0.26885431524947523, 0.7187412311785116], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["500/Internal Server Error", 642, 100.0, 5.756298753698556], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 11153, 642, "500/Internal Server Error", 642, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Update Education", 637, 24, "500/Internal Server Error", 24, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["Enable/Disable ShareSkill", 406, 199, "500/Internal Server Error", 199, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["SearchSkill", 315, 46, "500/Internal Server Error", 46, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Update Certification", 637, 93, "500/Internal Server Error", 93, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Delete Language", 637, 38, "500/Internal Server Error", 38, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Delete Certification", 637, 32, "500/Internal Server Error", 32, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["Delete ShareSkill", 333, 210, "500/Internal Server Error", 210, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
