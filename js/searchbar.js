// $(document).ready(function() {
//     var actTeamHTML = ""; // 
//     var calHTML = ""; //
//     var contactHTML = ""; //
//     var infoHTML = ""; //
//     var memberHTML = ""; //
//     var indexHTML = ""; //
//     var planHTML = ""; //
//     var policyHTML = "";

//     $.get("/", function(indexPg) {
//         indexHTML = indexPg;
//         $.get("/pub/Members", function(memberPg) {
//             memberHTML = memberPg;
//             $.get("/pub/Action-Teams", function(actPg) {
//                 actTeamHTML = actPg;
//                 $.get("/pub/Calendar", function(calPg) {
//                     calHTML = calPg;
//                     $.get("/pub/Contact", function(contactPg) {
//                         contactHTML = contactPg;
//                         $.get("/pub/Info", function(infoPg) {
//                             infoHTML = infoPg;
//                             $.get("/pub/National-Plan", function(planPg) {
//                                 planHTML = planPg;
//                                 $.get("/pub/Policy", function(policyPg) {
//                                     policyHTML = policyPg;
//                                     var searchBar = $("#searchBar");
//                                     searchBar.on('keypress', function(e) { 
//                                         if (e.which === 13) {
//                                             e.preventDefault();
//                                             //Disable textbox to prevent multiple submit
//                                             //$(this).attr("disabled", "disabled");

//                                             var searchTxt = searchBar.val();
//                                             searchBar.val("");

//                                             //Search Algorithm
//                                             if (indexHTML.includes(searchTxt)) {
//                                                 console.log("It Exists in the Index html page!");
//                                             }
//                                             if (memberHTML.includes(searchTxt)) {
//                                                 console.log("It exist in Member html page!");
//                                             }
//                                             if (actTeamHTML.includes(searchTxt)) {
//                                                 console.log("It exists in Action Team html page!");
//                                             }
//                                             if (calHTML.includes(searchTxt)) {
//                                                 console.log("It Exists in the Calendar html page!");
//                                             }
//                                             if (contactHTML.includes(searchTxt)) {
//                                                 console.log("It exist in Contact html page!");
//                                             }
//                                             if (infoHTML.includes(searchTxt)) {
//                                                 console.log("It exists in Info html page!");
//                                             }
//                                             if (planHTML.includes(searchTxt)) {
//                                                 console.log("It exists in National Plan html page!");
//                                             }
//                                             if (policyHTML.includes(searchTxt)) {
//                                                 console.log("It exists in Plan html page!");
//                                             }
//                                             //console.log(searchTxt);
//                                         }
//                                     });
//                                 });
//                             });
//                         });
//                     });
//                 });
//             });
//         });
//     });
// });

$(document).ready(function() {
    var searchBar = $("#searchBar");
    console.log("HI!");
    searchBar.on('keypress', function(e) {
        if (e.which === 13) {
            e.preventDefault();
            //Disable textbox to prevent multiple submit
            //$(this).attr("disabled", "disabled");

            var searchTxt = searchBar.val();
            searchBar.val("");

            console.log(searchTxt);
            $.getJSON("/search", function(data) {
                console.log(data);
            });
        }
    });
});
