// Import the page's CSS. Webpack will know what to do with it.
import "../stylesheets/app.css";

// Import libraries we need.
import { default as Web3} from 'web3';
import { default as contract } from 'truffle-contract'

// Import our contract artifacts and turn them into usable abstractions.
import metacoin_artifacts from '../../build/contracts/MetaCoin.json'

import one from "../../build/contracts/one.json"



// MetaCoin is our usable abstraction, which we'll use through the code below.
var MetaCoin = contract(metacoin_artifacts);

var One = contract(one);

// The following code is simple to show off interacting with your contracts.
// As your needs grow you will likely need to change its form and structure.
// For application bootstrapping, check out window.addEventListener below.
var accounts;
var account;

window.App = {
  
  start: function() {
    var self = this;

    // Bootstrap the MetaCoin abstraction for Use.
    MetaCoin.setProvider(web3.currentProvider);

    // Get the initial account balance so it can be displayed.
    web3.eth.getAccounts(function(err, accs) {
      if (err != null) {
        alert("There was an error fetching your accounts.");
        return;
      }

      if (accs.length == 0) {
        alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
        return;
      }

      accounts = accs;
      account = accounts[0];

      console.log(account);

      App2.isOwner();

      // self.refreshBalance();
    });
  },


};

/*
$("#js-check-alert").click(function(params) {
  
  window.App2.getCoordinates();

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(this.showPosition);
  } else {
    $('#demo').html = "Geolocation is not supported by this browser.";
  }
});
*/

var globalcordinates = {
  lat: 0,
  long: 0  
};

window.App2 = {
  start: function() {
    var self = this;

    One.setProvider(web3.currentProvider);
  },

  CompleteTransaction: function() {
    var self = this;
    // var claimdate = $("#claimdate").val();
    // var dischargedate = $("#discharge").val();

    // var claimdatee = claimdate.split("-", 3);
    // var discharge = dischargedate.split("-", 3);

    // console.log(claimdatee[0]);
    // console.log(claimdatee[1]);
    // console.log(claimdatee[2]);
 

    // document.getElementById("demo2").innerHTML = res2;

    var instance;
    var addressto = $("#input2").val() || $("#input2").text(); 
    var requiredresources = $("#input3").val() || $("#input3").text();
    One.deployed()
      .then(function(Instance) {
        instance = Instance;
        return instance.CompleteTransaction(addressto, requiredresources, {
          from: account,
          gas: 3500000
        });
      })
      .then(function() {
        swal("Resources Successfully Transferred", "The  resources are successfully transferred to the receiver and the ledgeris updated at issuer side", "success");
        console.log("Resources are successfully Delivered");
      })
      .catch(function(e) {
        console.log(e);
      });

    console.log('');
  },

  GetResources: function() {
    var self = this;
    var Instance;
    let claimtype = $("#input1").val() || $("#input1").text();

    One.deployed()
      .then(function(Instance) {
        var instance = Instance;
        return instance.GetResources(claimtype, {
          from: account,
          gas: 3500000
        });
      })
      .then(function() {
        console.log("Request Raised for Resources");
        swal("Request Raised Successfully", "Your request is auto approved by contract and a notification is send to the service provider", "success");
      })
      .catch(function(e) {
        console.log(e);
      });

    // self.display();

    // this.setStatus("Initiating transaction... (please wait)");
  },

  GetBalance: function () {
    var self = this;
    var Instance;
    //let claimtype = $("#input1").val() || $("#input1").text();

    var _address = account;

    One.deployed()
      .then(function (Instance) {
        var instance = Instance;
        return instance.balanceOf(_address, {
          from: account,
          gas: 3500000
        });
      })
      .then(function (data) {
        
        $("#balanceresult").text(data.c[0]);
        console.log("GetBalance() result", data.c[0]);
      })
      .catch(function (e) {
        console.log(e);
      });

    // self.display();

    // this.setStatus("Initiating transaction... (please wait)");
  },

  isOwner: function () {
    
    One.deployed()
      .then(function (Instance) {
        var instance = Instance;
        return instance.isOwner( {
          from: account,
          gas: 3500000
        });
      })
      .then(function (data) {
        console.log("one complete");
        if(data == true){
          $("#input1").hide();
          $("#input2").show();
          $("#input3").show();
          $("#button2").show();
          $("#button1").hide();
        }
        else{
          $("#input1").show();
          $("#input2").hide();
          $("#input3").hide();
          $("#button2").hide();
          $("#button1").show();


        }
      })
      .catch(function (e) {
        console.log(e);
      });

  },

  showPosition: function(position) {
   
    $("#demo").html =
      "Latitude: " +
      position.coords.latitude +
      "<br>Longitude: " +
      position.coords.longitude;

    console.log("lat" + position.coords.latitude);
    console.log("long" + position.coords.longitude);
    console.log(window.cordinates);

    globalcordinates.lat = position.coords.latitude;
    globalcordinates.long = position.coords.longitude;
    App2.getCoordinates2();
  },

  getCoordinates: function() {
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(this.showPosition);
    } else {
      $("#demo").html = "Geolocation is not supported by this browser.";
    }

    // var abc = $("#Location").text() || $("#Location").val();

    // var url = "https://maps.googleapis.com/maps/api/geocode/json?address=" + abc + 'key=AIzaSyAefXK91jWaL5BEqOGwradwMhcUCQizsEI';
    //  console.log(url);
    // $.get(
    //   url,
    //   function(data) {
    //     $(".result").html(data);
    //     console.log(data);
    //     alert("Load was performed.");
    //   }
    // );
  },

  getCoordinates2: function() {
    // if (navigator.geolocation) {
    //   navigator.geolocation.getCurrentPosition(this.showPosition);
    // } else {
    //   $('#demo').html = "Geolocation is not supported by this browser.";
    // }

    // 
    var lat = 12.445;
    var long = 12345.3;
    var shortest = 0;
    var trigger_alert = false;
    var are_you_safe = "You are Safe";
    var are_you_safe_msg = "You are quiet far from affected area.";
    var are_you_safe_type = "success";


    var url = "https://data.nasa.gov/resource/tfkf-kniw.json";
    console.log(url);
    $.get(
      url,
      function (data) {
        debugger;
        if (data && data.length > 0) {
          for (var i = 0; i <= data.length; i++) {
            if (data[i]) {
              var data_shortest = getDistanceFromLatLonInKm(lat, long, parseInt(data[i].latitude), parseInt(data[i].longitude));
              if (i == 0) {
                shortest = data_shortest;
              }
              if (shortest >= data_shortest && data_shortest > 0) {
                shortest = data_shortest;
              }
            }
          }
        }

        if (shortest <= 20) {
          trigger_alert = true;
          are_you_safe = "Danger Around";
          are_you_safe_msg = "You are very near to affected area. You are in the radius of 20km." ;
          are_you_safe_type = "warning";
        }

        swal(are_you_safe, are_you_safe_msg, are_you_safe_type);
        $(".result").html(data);
        console.log(data);

      }
    );

    //////

    var url = "https://data.nasa.gov/resource/tfkf-kniw.json";
    console.log(url);
    $.get(url, function(data) {
      
      getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2);
      $(".result").html(data);
      console.log(data);
    });
  },
 
  // checkapi: function() {
  //   var authorizationToken = "Bearer rx7pdL9IpEktjit02qILsi5rOG4Vv61T4z/uvGXkJyLL6dqqpDCKZf/a4FDyZ2T8P1LOoQo0j9IyTWg974ESxQ==";

  //   var yourdata = {
  //     Inputs: {
  //       input1: [
  //         {
  //           Fraud_Flag: "",
  //           Claimno: 100,
  //           TypeofClaim: "Cashless Claim",
  //           PolicyNumber: "777775555A100000100",
  //           Policytype: "Retail",
  //           ProductName: "ABC family policy",
  //           planname: "Bronze",
  //           PolicyStartDate: 42625,
  //           PolicyEndDate: 42989,
  //           premium: 7107,
  //           SI: 200000,
  //           InsuranceCompany: "DD",
  //           DateOfBirth: 33251,
  //           Gender: "Female",
  //           Dateof_ClaimIntimation: 42645,
  //           Diagnosis_Code_Level_I: "N39",
  //           Procedure_Code_Level_I: "N39",
  //           HospitalCode: 112004,
  //           Name_Of_The_Hospital: "JMC",
  //           Hospital_Address: "DLF",
  //           Hospital_State: "HARYANA",
  //           Hospital_City: "GURGAON",
  //           Registration_Number_of_Hospital: 1123004,
  //           Pan_of_Hospital: "JJDDB004",
  //           Pincode_of_Hospital: 121004,
  //           Date_of_Discharge: 42648,
  //           ClaimedAmount: 90000,
  //           NursingCharges: 4905,
  //           RoomCharges: 6867,
  //           SurgeryCharges: 10900,
  //           InvestigationCharges: 9810,
  //           MedicineCharges: 14715,
  //           MiscellaneousCharges: 9000,
  //           "Total Charges": 87000
  //         }
  //       ]
  //     },
  //     GlobalParameters: {}
  //   };
  //   var url = "https://ussouthcentral.services.azureml.net/workspaces/935fad7d57da46d88f0caf34ed89a9c6/services/c4f2e83c1b8444ba829b62f5202db6c7/execute?api-version=2.0&format=swagger";

  //   $.ajax({
  //     url: url,
  //     Headers: {
  //       "Authorization": authorizationToken,
  //     },
  //     type: "POST",
  //     dataType:"json",
  //     data: JSON.stringify(yourdata),
  //     success: function(data) {
  //       console.log("succes: " + data);
  //     },
  //     error: function() {
  //       alert("Failed!");
  //     }
  //   });

  // }
};

function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2 - lat1);  // deg2rad below
  var dLon = deg2rad(lon2 - lon1);
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2)
    ;
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c; // Distance in km
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI / 180)
}



window.addEventListener('load', function() {
  // Checking if Web3 has been injected by the browser (Mist/MetaMask)
  if (typeof web3 !== 'undefined') {
    console.warn("Using web3 detected from external source. If you find that your accounts don't appear or you have 0 MetaCoin, ensure you've configured that source properly. If using MetaMask, see the following link. Feel free to delete this warning. :) http://truffleframework.com/tutorials/truffle-and-metamask")
    // Use Mist/MetaMask's provider
    window.web3 = new Web3(web3.currentProvider);
  } else {
    console.warn("No web3 detected. Falling back to http://127.0.0.1:7545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask");
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    window.web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:7545"));
  }

  App.start();
  App2.start();
});
