/**
  * @author 		: ABS
  * @name			: qrGrnController
  * @description 	: controller for QRGeneration module
  * @date 			: 12/06/2018
  */
(function() {
	'use strict';

	angular.module('myApp.qrGrn').controller('qrGrnController', qrGrnController).controller('GrnModalCtrl', GrnModalCtrl);
	qrGrnController.$inject = ['$state', '$scope', 'toastr','DTColumnDefBuilder','DTOptionsBuilder','genericFactory','$uibModal'];//,'DTColumnDefBuilder'
	
	GrnModalCtrl.$inject = ['$state', '$scope', 'toastr', 'grnItem',
		'DTColumnDefBuilder', 'DTOptionsBuilder', 'genericFactory', 'localStorageService', 'ApiEndpoint', '$filter', '$log', '$uibModalInstance'];
	/* @ngInject */
	function qrGrnController($state, $scope, toastr, DTColumnDefBuilder, DTOptionsBuilder,genericFactory,$uibModal) {//, DTColumnDefBuilder
		var purchaseOrder = staticUrl + '/purchaseOrder';
		var grn = staticUrl + '/grn';
		$scope.changeMaterial = true;
		$scope.vendorName = ""
		$scope.materialName = '';
		$scope.materialObj = null;
		$scope.vendor = 'selectVendor';
		$scope.puchaseOrderNo = "";
		$scope.vendorId = "";
		$scope.itemId = "";
		$scope.hideSelectVendor = false;
		$scope.hideSelectMaterial = false;
		$scope.materialDetails = [];
		$scope.vendorDetails = [];
		$scope.selectedVendor = {};
		$scope.qrCodeArr = [];
		$scope.printButton = true;
		$scope.showTable = false;
		$scope.finalArr = [];
		var selectedDataCounter = 0;
		
		var vm = angular.extend(this, {
			selectAllChk : false,
			checks:false
		});
		
		/**
		  * @author : ABS
		  * @description : fetch vendor details on load.
		  * @date : 19/06/2018
		  */
		$scope.fetchVendorDetails = function(){
			var msg = "Vendor Data Load....', 'Successful !!";
            var url = grn+"/venGrnlist";
            genericFactory.getAll(msg,url).then(function(response) {
                    $scope.vendorDetails = response.data;
                    console.log(JSON.stringify($scope.vendorDetails));
            });
		}
		
		/**
		  * @author : ABS
		  * @description : fetch material details on selection of vendor.
		  * @date : 19/06/2018
		  * @param: {Object}	vendor - vendor object 
		  */
		$scope.fetchMaterialDetails = function(vendor){
			$scope.materialObj = null;
			$scope.purchaseOrderNo = null;
			$scope.itemId = null;
			$scope.selectedVendor = vendor && vendor != 'selectVendor' ? JSON
					.parse(vendor) : null;
			$scope.hideSelectVendor = true;
			$scope.changeMaterial = false;
			$scope.hideSelectMaterial = false;
			$scope.vendorId = $scope.selectedVendor && $scope.selectedVendor.id ? $scope.selectedVendor.id
					: null;
			
			var msg = "Material Data Load....', 'Successful !!";
            var url = grn+"/itemGrnlist?venId=" + $scope.vendorId;
            genericFactory.getAll(msg,url).then(function(response) {
                    $scope.materialDetails = response.data;
                    console.log(JSON.stringify($scope.materialDetails));
            });
		}
		
		/**
		  * @author : ABS
		  * @Description : to store item Id on change
		  * @date : 19/06/2018
		  * @param: {Object} iObj material object
		  */
		$scope.changeMaterialFun = function(iObj){
			$scope.hideSelectMaterial = true;
			var obj = iObj;
			$scope.itemId = obj.id;
			$scope.vendorRefNo = obj.vendorRefNo;
		}
		
		/**
		 * @author : Anurag
		 * @Description : Reset other search fields on selecting Purchase Order
		 * @date : 06/06/2019
		 */
		$scope.resetVendor = function(){
			$scope.vendor = 'selectVendor';
			$scope.materialObj = null;
		}
		
		/**
		  * @author : ABS
		  * @Description : fetch grn table data and show
		  * @date : 19/06/2018
		  */
		 $scope.fetchTableData = function(){
			 vm.selectAllChk = false;
			 vm.checks = false;
			 $scope.printButton = true;
			 $scope.showTable = false;
			 $scope.printButton = true;
			 
			 var qrDiv = document.getElementById("QR");
			 
			 for(var i = 0; i < $scope.finalArr.length; i++){
				 var qrDiv = document.getElementById("qr"+i);
					 while (qrDiv.firstChild) {
						 qrDiv.removeChild(qrDiv.firstChild);
					 }
			 }
			 
			 $scope.finalArr = [];
			 
			 if($scope.purchaseOrderNo){
				 if(isNaN($scope.purchaseOrderNo) || parseInt($scope.purchaseOrderNo) < 0){
					 toastr.error('Please enter proper Purchase Order Number');
					 return;
				 }
				 var msg = "Table Data By PO No Load....', 'Successful !!";
		            var url = grn+"/serchByPOno?purchaseOrderNo=" + $scope.purchaseOrderNo;
		            genericFactory.getAll(msg,url).then(function(response){
						$scope.allDetails = response.data;
						console.log(JSON.stringify($scope.allDetails));
						for (var index in $scope.allDetails){
							$scope.allDetails[index].flag = vm.checks;
							if($scope.allDetails[index].barcode != null){
								$scope.allDetails[index].isQrGenerated = true;
							}
						}
						if($scope.allDetails && $scope.allDetails.length > 0){
							$scope.showTable = true;
							setCheckbox();
							$scope.disableQrCodeButton = false;
						}else{
							$scope.showTable = false;
							toastr.error('Data is not present for entered GRN Number');
						}
				 });
			 }else{
				 if(!$scope.vendorId || $scope.vendorId == null){
					 toastr.error('Please select vendor');
					 return;
				 }

					if (!$scope.materialObj) {
						toastr.error('Please select material');
						return;
					}
					if (!$scope.itemId || $scope.materialObj.id!=$scope.itemId) {
						toastr.error('Please select material from dropdown');
						return;
					}
				 var msg = "Table Data By Vendor and Material Load....', 'Successful !!";
		            var url = grn+"/submitGrn?venId="+ $scope.vendorId + "&itemId=" + $scope.itemId;
					genericFactory.getAll(msg,url).then(function(response) {
						$scope.allDetails = response.data;
						console.log(JSON.stringify($scope.allDetails));
						for (var index in $scope.allDetails){
							$scope.allDetails[index].flag = vm.checks;
							if($scope.allDetails[index].barcode != null){
								$scope.allDetails[index].isQrGenerated = false;
							}
						}
						if($scope.allDetails && $scope.allDetails.length > 0){
							$scope.showTable = true;
							setCheckbox();
							$scope.disableQrCodeButton = false;
							setTimeout(function(){
								 window.scroll({
									  top: document.body.scrollHeight, 
									  left: 0, 
									  behavior: 'smooth' 
									});
							 },10);
							 
						}else{
							$scope.showTable = false;
							toastr.error('Data is not present for selected vendor and material');
						}
				 });
			 }
		 }
		 
		 /**
		  * @author : Anurag
		  * @Description : Modify GRN Fields
		  * @date : 09/09/2019
		  */
		 $scope.modify = function (i) {
				$scope.allDetails[i].flag = true;

				if ($scope.allDetails[i].sapGrnDate != null)
					$scope.allDetails[i].sapGrnDate = new Date($scope.allDetails[i].sapGrnDate);
			}


			$scope.update = function (i, arr) {

//				 console.log(JSON.stringify(arr));
				var newArr = {};
				newArr.grnItemId = arr.grnItemId;
				newArr.sapGrnNo = arr.sapGrnNo;
				newArr.sapGrnDate = arr.sapGrnDate;
				
				var msg = "Saving Data";
				var url = grn + "/updateSapData";
				console.log(JSON.stringify(newArr));
				genericFactory.add(msg, url, newArr).then(function (response) {
					$scope.allDetails[i].flag = false;
				});
			}
		 	 
		 
		 var setCheckbox = function(){
			 for(var index in $scope.allDetails){
				 if($scope.allDetails[index].barcode && ($scope.allDetails[index].barcode != "" || $scope.allDetails[index].barcode != null)){
				 }
					 $scope.allDetails[index].printQty = false;
			 }
		 }
		 
		 /**
		  * @author : ABS
		  * @Description : toggle check box
		  * @date : 19/06/2018
		  */
		 $scope.enablePrintQuantity = function(arr){
			 arr.printQty = !arr.printQty;
			 if(arr.printQty == true){
				 arr.printCopies = arr.printCopies ? arr.printCopies : 1;
				 selectedDataCounter++;
			 }else
				 selectedDataCounter--;
			 
			 if(selectedDataCounter == $scope.allDetails.length)
				 vm.selectAllChk = true;
			 else
				 vm.selectAllChk = false;
		 }
		 
		 /**
		  * @author : ABS
		  * @Description : select all data on click of Select All checkbox
		  * @date : 19/06/2018
		  */
		 $scope.selectAllTable = function(){
			 for(var index in $scope.allDetails){
				 $scope.allDetails[index].printQty = vm.selectAllChk;
				 if(vm.selectAllChk)
					 $scope.allDetails[index].printCopies = $scope.allDetails[index].printCopies ? $scope.allDetails[index].printCopies : 1;
			 }
			 if(vm.selectAllChk)
				 selectedDataCounter = $scope.allDetails.length;
			 else
				selectedDataCounter = 0;
			 
		 }
		 
		 /**
		  * @author : ABS
		  * @description : to generate QR code
		  * @date : 19/06/2018
		  */
		 $scope.makeCode = function(){
			 $scope.disableQrCodeButton = true;
			 $scope.qrCodeArr = [];
			 var sArr = [];
			 var copiesArr = [];
			 $scope.copiesArr = [];
			 $scope.qrArrAll = [];
			 
			for(var i = 0; i < $scope.finalArr.length; i++){
				 var qrDiv = document.getElementById("qr"+i);	// to remove all generated QR code from div
					 while (qrDiv.firstChild) {
						 qrDiv.removeChild(qrDiv.firstChild);
					 }
			}
			 
			 $scope.finalArr = [];
			 var qrDiv = document.getElementById("QR");
			 
			 for(var index in $scope.allDetails){
				 if($scope.allDetails[index].printQty == true){
					 $scope.qrCodeArr.push($scope.allDetails[index]);
					 var val = parseInt($scope.allDetails[index].printCopies);
					 if(isNaN(val) || val < 1){
						 $scope.printButton = true;
						 toastr.error('Please enter proper number to print copies.');
						 document.getElementById('print'+index).focus();
						 return;
					 }
					//  copiesArr.push(val);
					 $scope.allDetails[index].isQrGenerated = true;
					 $scope.copiesArr.push(val);
					 for(var i = 0; i < val; i++){
						 var iObj = Object.assign({},$scope.allDetails[index]);
						 iObj.amt = i+1;
						 if(i > 0){
							 iObj.copy = true;
						 }
						 $scope.qrArrAll.push(iObj);
					 }
				 }
			 }
			 console.log(JSON.stringify($scope.qrArrAll));
			 $scope.finalArr = $scope.qrArrAll;
			  console.log(JSON.stringify($scope.finalArr));
			 if(!$scope.qrCodeArr || $scope.qrCodeArr.length == 0){
				 toastr.error('Please select checkbox');
				 return;
			 }
				 
				
			 setTimeout(function(){
				 var arr = [];
				 console.log(JSON.stringify($scope.finalArr));
				 for(var i in $scope.finalArr){
					 var day = new Date($scope.finalArr[i].grnEntryDate).getDate();
					 var month = new Date($scope.finalArr[i].grnEntryDate).getMonth();
					 month = parseInt(month) + 1;
					 var year = new Date($scope.finalArr[i].grnEntryDate).getFullYear();
					 
					 var qrCodeStr = '001//' + $scope.finalArr[i].grnId +'//'+ $scope.finalArr[i].grnNo +'//'+ $scope.finalArr[i].itemMstId + '//' + day + '-' + month + '-' + year;		//$scope.qrCodeArr[i].venPostDate;
					 qrCodeStr = qrCodeStr.replace(/\s/g,'');
					 var e = document.getElementById('qr'+i);
					 generateQRCode('qr'+i, qrCodeStr);
					 
					 
					 
					 if(!$scope.finalArr[i].barcode || $scope.finalArr[i].barcode == '' || $scope.finalArr[i].barcode == null){
						 if(arr.indexOf($scope.finalArr[i].grnItmLotID) == -1){
							 arr.push($scope.finalArr[i].grnItmLotID);
							 var msg = "QR code submitted....', 'Successfully !!";
					            var url = grn+"/updateQr?grItmlotId="+ $scope.finalArr[i].grnItmLotID +" &qrCodeNo=" + qrCodeStr;
								genericFactory.getAll(msg,url).then(function(response){
								 
							 });
						 }
					 }
				 }
			 },0);
			 
			 
		
			 if($scope.qrCodeArr && $scope.qrCodeArr.length > 0)
				 $scope.printButton = false;
			 else
				 $scope.printButton = true;
			 
			 setTimeout(function(){
				 window.scroll({
					  top: document.body.scrollHeight, 
					  left: 0, 
					  behavior: 'smooth' 
					});
			 },10);
		 }
		 
		 /**
		  * @author : ABS
		  * @description : to generate QR code
		  * @date : 19/06/2018
		  */
		 var generateQRCode = function(divId, s){
			 var qrcode = new QRCode(document.getElementById(divId), {
					width : 100,
					height : 100
			 });
			 qrcode.makeCode(s);
		 }
		 
		 /**
		  * @author : ABS
		  * @description : to print QR code
		  * @date : 19/06/2018
		  */
		 $scope.printCode = function(){
			var innerContents = document.getElementById('QR').innerHTML;
	        var popupWinindow = window.open('', '_blank', 'width=600,height=700,scrollbars=no,menubar=no,toolbar=no,location=no,status=no,titlebar=no');
	        popupWinindow.document.open();
	        popupWinindow.document.write('<style> @page {  margin: 8;} </style>');
			// popupWinindow.document.write('<html><head><style>.ng-hide { display: none !important; }</style></head><body onload="window.print()">' + innerContents + '</html>');
			popupWinindow.document.write('<html><body onload="window.print()">' + innerContents + '</html>');
	        popupWinindow.document.close();
		 }		 
		 
		 /**
		  * @author : ABS
		  * @Description : init controller
		  * @date : 19/06/2018
		  */
		var init = function(){
			$scope.fetchVendorDetails();
			$scope.dtOptions = DTOptionsBuilder.newOptions().withDOM('C<"clear">lfrtip')
															.withOption('responsive', true)
															.withOption('scrollX', 'auto')      
															.withOption('scrollCollapse', true)
															.withOption('autoWidth', false);
		    $scope.dtColumnDefs = [
		         DTColumnDefBuilder.newColumnDef(7).notSortable(),
		         DTColumnDefBuilder.newColumnDef(8).notSortable()
		    ];
			
		}
		init();
		
		/**
		 * @author : Anurag
		 * @Description : Open Pop-up
		 * @date : 19/06/2019
		 */
		$scope.deleteGrn = function(i, arr) {
			var dist = arr ? arr : {};
			var modalInstance = $uibModal.open({
				animation: true,
				ariaLabelledBy: 'modal-title',
				ariaDescribedBy: 'modal-body',
				templateUrl: 'templates/qrGrn/grnModelView.html',
				controller: 'GrnModalCtrl',
				backdrop: 'static',
				keyboard: false,
				controllerAs: 'vm',
				size: 'md',
				resolve: {
					grnItem: function () {
						return dist;
					}
				}
			});

			modalInstance.result.then(function () {

			}, function () {
				$scope.fetchTableData();
			});
		}
		
		}
	
	function GrnModalCtrl($state, $scope, toastr, grnItem,
			DTColumnDefBuilder, DTOptionsBuilder, genericFactory, localStorageService, ApiEndpoint, $filter, $log, $uibModalInstance) {

			var grn = staticUrl + '/grn';
			var loginUser = localStorageService.get(ApiEndpoint.userKey);
			

			var vm = angular.extend(this, {

			});


			(function activate() {
				$scope.grnItem = grnItem;
			})();
			
			$scope.close = function () {
					$uibModalInstance.dismiss('cancel');
			}
			
			$scope.delete = function () {
				var msg = "GRN Deleted";
				var url = grn + "/deleteGrn";
				console.log(JSON.stringify($scope.grnItem));
				genericFactory.add(msg, url, $scope.grnItem).then(function (response) {
					$scope.close();
				});
			}
		}
})();


