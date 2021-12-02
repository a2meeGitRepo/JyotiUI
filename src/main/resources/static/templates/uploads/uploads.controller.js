/**
 * @name : uploadsController
 * @description : controller for uploading files
 * @date : 30/05/2019
 */

(function () {
	'use strict';

	angular.module('myApp.uploads').controller('uploadsController', uploadsController);

	uploadsController.$inject = ['$state', '$scope', 'toastr', 'genericFactory', '$filter', '$http', '$rootScope','$uibModal', '$window'];

	/* @ngInject */
	function uploadsController($state, $scope, toastr, genericFactory, $filter, $http, $rootScope, $uibModal, $window) {

		var purchaseOrder = staticUrl + '/purchaseOrder';
		var putAway = staticUrl + "/putAway";
		var bom = staticUrl + "/bom";
		var modelPlan = staticUrl + "/modelPlan";
		var proOrder = staticUrl + "/proOrder";
		var itemsUrl = staticUrl + "/items";
		var suuplierUrl = staticUrl + "/suuplier";
		var vm = angular.extend(this, {
			uploadPOCsv: uploadPOCsv,
			uploadStorageCsv: uploadStorageCsv,
			uploadOldStock, uploadOldStock,
			uploadBomCsv: uploadBomCsv,
			uploadModelPlanCsv: uploadModelPlanCsv,
			uploadAnnualPlan: uploadAnnualPlan,
			uploadReservationItemNo : uploadReservationItemNo,
			uploadItems:uploadItems,
			uploadSupplierComponents:uploadSupplierComponents,

		});		

		/**
		 * @author : ABS
		 * @Description : init controller
		 * @date : 19/06/2018
		 */
		var init = function () {

		}
		init();

		/**
		 * @author : Anurag
		 * @Description : Upload CSV File Purchase Order
		 * @date : 10/07/2019
		 */
		function uploadPOCsv() {
			var file = document.getElementById('fileAsset1').files[0];
			console.log('File is: ')
			console.dir(file);

			if (file == undefined) {
				toastr.error('Please Select a xlsx File');
				return;
			}

			var fileName = file.name;
			var extension = ".xlsx";

			if(!fileName.includes(extension)){
				toastr.error('Selected File is not a xlsx');
				return;
			}			

			$('.loading').show();
			var fd = new FormData();
			fd.append('file', file);
			var uploadUrl = purchaseOrder + "/uploadCsvPurchaseOrder";
			$http.post(uploadUrl, fd, {
				transformRequest: angular.identity,
				headers: {
					'Content-Type': undefined
				}
			})
			.then(function successCallback(response) {
				console.log("helooo");
				$('.loading').hide();
				window.alert("File uploaded successfully!");
				init();
				toastr.success('Uploaded....', 'Succesful !!',{ timeOut: 10000 });					
				// $window.location.reload();
			}, function errorCallback(response) {
		    	$('.loading').hide();
				window.alert("File upload - unsuccessfull!");
				init();
				toastr.error('Upload....', 'UnSuccesful !!');
				// $window.location.reload();
		    });

			angular.element("input[type='file']").val(null);
		}

		/**
		 * @author : Anurag
		 * @Description : Upload CSV File Storage Bins
		 * @date : 05/08/2019
		 */
		function uploadStorageCsv() {
			var file = document.getElementById("fileAsset2").files[0];
			console.log("File is: ");
			console.dir(file);

			if (file == undefined) {
				toastr.error("Please Select a CSV File");
				return;
			}

			var fileName = file.name;
			var extension = ".xlsx";

			if (!fileName.includes(extension)) {
				console.log(fileName)
				toastr.error("Selected File is not a CSV");
				return;
			}

			$(".loading").show();
			var fd = new FormData();
			fd.append("file", file);
			var uploadUrl = putAway + "/uploadCsvStorageBins";

			$http
				.post(uploadUrl, fd, {
					transformRequest: angular.identity,
					headers: {
						"Content-Type": undefined
					}
				})
				.then(
					function successCallback(response) {
						$(".loading").hide();
						window.alert("File uploaded successfully!");
						init();
						toastr.success("Uploaded....", "Succesful !!", {
							timeOut: 10000
						});
					},
					function errorCallback(response) {
						$(".loading").hide();
						window.alert("File upload - unsuccessfull!");
						init();
						toastr.error("Upload....", "UnSuccesful !!");
					}
				);

			angular.element("input[type='file']").val(null);
		}
		
		/**
		 * @author : Anurag
		 * @Description : Upload CSV File Old Stock
		 * @date : 04/12/2019
		 */
		function uploadOldStock() {
			var file = document.getElementById('fileAsset6').files[0];
			console.log('File is: ')
			console.dir(file);

			if (file == undefined) {
				toastr.error('Please Select an Excel File');
				return;
			}

			var fileName = file.name;
			var extension = ".xlsx";

			if(!fileName.includes(extension)){
				toastr.error('Selected File is not an Excel');
				return;
			}			

			$('.loading').show();
			var fd = new FormData();
			fd.append('file', file);
			var uploadUrl = putAway + "/uploadOldStock";
			$http.post(uploadUrl, fd, {
				transformRequest: angular.identity,
				headers: {
					'Content-Type': undefined
				}
			})
			.then(function successCallback(response) {
				console.log("helooo");
				$('.loading').hide();
				window.alert("File uploaded successfully!");
				init();
				toastr.success('Uploaded....', 'Succesful !!',{ timeOut: 10000 });		
			}, function errorCallback(response) {
		    	$('.loading').hide();
				window.alert("File upload - unsuccessfull!");
				init();
				toastr.error('Upload....', 'UnSuccesful !!');
		    });

			angular.element("input[type='file']").val(null);
		}
		function uploadItems() {
			var file = document.getElementById('fileAssetItem').files[0];
			console.log('File is: ')
			console.dir(file);

			if (file == undefined) {
				toastr.error('Please Select an Excel File');
				return;
			}

			var fileName = file.name;
			var extension = ".xlsx";

			if(!fileName.includes(extension)){
				toastr.error('Selected File is not an Excel');
				return;
			}			

			$('.loading').show();
			var fd = new FormData();
			fd.append('file', file);
			var uploadUrl = itemsUrl + "/uploadItems";
			$http.post(uploadUrl, fd, {
				transformRequest: angular.identity,
				headers: {
					'Content-Type': undefined
				}
			})
			.then(function successCallback(response) {
				console.log("helooo");
				$('.loading').hide();
				window.alert("File uploaded successfully!");
				init();
				toastr.success('Uploaded....', 'Succesful !!',{ timeOut: 10000 });		
			}, function errorCallback(response) {
		    	$('.loading').hide();
				window.alert("File upload - unsuccessfull!");
				init();
				toastr.error('Upload....', 'UnSuccesful !!');
		    });

			angular.element("input[type='file']").val(null);
		}
		/**
		 * @author : Anurag
		 * @Description : Upload CSV File BOM
		 * @date : 10/07/2019
		 */
		function uploadBomCsv() {
			var file = document.getElementById('fileAsset3').files[0];
			console.log('File is: ')
			console.dir(file);

			if (file == undefined) {
				toastr.error('Please Select an Excel File');
				return;
			}

			var fileName = file.name;
			var extension = ".xlsx";

			if(!fileName.includes(extension)){
				toastr.error('Selected File is not an Excel');
				return;
			}			

			$('.loading').show();
			var fd = new FormData();
			fd.append('file', file);
			var uploadUrl = bom + "/uploadBom";
			$http.post(uploadUrl, fd, {
				transformRequest: angular.identity,
				headers: {
					'Content-Type': undefined
				}
			})
			.then(function successCallback(response) {
				console.log("helooo");
				$('.loading').hide();
				window.alert("File uploaded successfully!");
				init();
				toastr.success('Uploaded....', 'Succesful !!',{ timeOut: 10000 });		
			}, function errorCallback(response) {
		    	$('.loading').hide();
				window.alert("File upload - unsuccessfull!");
				init();
				toastr.error('Upload....', 'UnSuccesful !!');
		    });

			angular.element("input[type='file']").val(null);
		}

		/**
		 * @author : Anurag
		 * @Description : Upload CSV File Model Plan
		 * @date : 10/07/2019
		 */
		function uploadModelPlanCsv() {
			var file = document.getElementById('fileAsset4').files[0];
			console.log('File is: ')
			console.dir(file);

			if (file == undefined) {
				toastr.error('Please an Excel File');
				return;
			}

			var fileName = file.name;
			var extension = ".xlsx";

			if(!fileName.includes(extension)){
				toastr.error('Selected File is not an Excel');
				return;
			}			

			$('.loading').show();
			var fd = new FormData();
			fd.append('file', file);
			var uploadUrl = modelPlan + "/uploadModelPlan";
			$http.post(uploadUrl, fd, {
				transformRequest: angular.identity,
				headers: {
					'Content-Type': undefined
				}
			})
			.then(function successCallback(response) {
				
				$('.loading').hide();
				window.alert("File uploaded successfully!");
				init();
				toastr.success('Uploaded....', 'Succesful !!',{ timeOut: 10000 });
			}, function errorCallback(response) {
		    	$('.loading').hide();
				window.alert("File upload - unsuccessfull!");
				init();
				toastr.error('Upload....', 'UnSuccesful !!');
		    });

			angular.element("input[type='file']").val(null);
		}


		/**
		 * @author : Anurag
		 * @Description : Upload CSV File Model Plan
		 * @date : 10/07/2019
		 */
		function uploadAnnualPlan() {
			var file = document.getElementById('fileAsset5').files[0];
			console.log('File is: ')
			console.dir(file);

			if (file == undefined) {
				toastr.error('Please an Excel File');
				return;
			}

			var fileName = file.name;
			var extension = ".xlsx";

			if(!fileName.includes(extension)){
				toastr.error('Selected File is not an Excel');
				return;
			}			

			$('.loading').show();
			var fd = new FormData();
			fd.append('file', file);
			var uploadUrl = proOrder + "/uploadProOrder";
			$http.post(uploadUrl, fd, {
				transformRequest: angular.identity,
				headers: {
					'Content-Type': undefined
				}
			})
			.then(function successCallback(response) {
				console.log("helooo");
				$('.loading').hide();
				window.alert("File uploaded successfully!");
				init();
				toastr.success('Uploaded....', 'Succesful !!',{ timeOut: 10000 });
			}, function errorCallback(response) {
		    	$('.loading').hide();
				window.alert("File upload - unsuccessfull!");
				init();
				toastr.error('Upload....', 'UnSuccesful !!');
		    });

			angular.element("input[type='file']").val(null);
		}
		
		/**
		 * @author : Praful Sable
		 * @Description : Upload Revervation and Item No
		 * @date : 13/03/2020
		 */
		function uploadReservationItemNo() {
			var file = document.getElementById('fileAsset7').files[0];
			console.log('File is: ')
			console.dir(file);

			if (file == undefined) {
				toastr.error('Please an Excel File');
				return;
			}

			var fileName = file.name;
			var extension = ".xlsx";

			if(!fileName.includes(extension)){
				toastr.error('Selected File is not an Excel');
				return;
			}			

			$('.loading').show();
			var fd = new FormData();
			fd.append('file', file);
			var uploadUrl = modelPlan + "/uploadReservationItemNo";
			$http.post(uploadUrl, fd, {
				transformRequest: angular.identity,
				headers: {
					'Content-Type': undefined
				}
			})
			.then(function successCallback(response) {
				console.log("helooo");
				$('.loading').hide();
				window.alert("File uploaded successfully!");
				init();
				toastr.success('Uploaded....', 'Succesful !!',{ timeOut: 10000 });
			}, function errorCallback(response) {
		    	$('.loading').hide();
				window.alert("File upload - unsuccessfull!");
				init();
				toastr.error('Upload....', 'UnSuccesful !!');
		    });

			angular.element("input[type='file']").val(null);
		}
		function uploadSupplierComponents(){
			
			var file = document.getElementById('fileAsset8').files[0];
			console.log('File is: ')
			console.dir(file);

			if (file == undefined) {
				toastr.error('Please an Excel File');
				return;
			}

			var fileName = file.name;
			var extension = ".xlsx";

			if(!fileName.includes(extension)){
				toastr.error('Selected File is not an Excel');
				return;
			}			

			$('.loading').show();
			var fd = new FormData();
			fd.append('file', file);
			var uploadUrl = suuplierUrl + "/uploadSupplierItems";
			$http.post(uploadUrl, fd, {
				transformRequest: angular.identity,
				headers: {
					'Content-Type': undefined
				}
			})
			.then(function successCallback(response) {
				console.log("helooo");
				$('.loading').hide();
				window.alert("File uploaded successfully!");
				init();
				toastr.success('Uploaded....', 'Succesful !!',{ timeOut: 10000 });
			}, function errorCallback(response) {
		    	$('.loading').hide();
				window.alert("File upload - unsuccessfull!");
				init();
				toastr.error('Upload....', 'UnSuccesful !!');
		    });

			angular.element("input[type='file']").val(null);
			
		}

	}
})();
