/**
 * @author : Anurag
 * @name : storageBinController
 * @description : controller for Storage Bin module
 * @date : 18/06/2019
 */

(function () {
	"use strict";

	angular
		.module("myApp.storageBin")
		.controller("storageBinController", storageBinController)
		.controller("PlantModalAddEditCtrl", PlantModalAddEditCtrl)
		.controller("PlantModalCtrl", PlantModalCtrl)
		.controller("StorageModalAddEditCtrl", StorageModalAddEditCtrl)
		.controller("StorageModalCtrl", StorageModalCtrl);

	storageBinController.$inject = [
		"$state",
		"$scope",
		"toastr",
		"DTColumnDefBuilder",
		"DTOptionsBuilder",
		"genericFactory",
		"localStorageService",
		"ApiEndpoint",
		"$filter",
		"$uibModal",
		"$window",
		"$http",
		"$anchorScroll",
		"$location",
		"$log"
	];

	PlantModalAddEditCtrl.$inject = [
		"$uibModalInstance",
		"plant",
		"$scope",
		"storageBinService",
		"localStorageService",
		"ApiEndpoint",
		"$filter"
	];

	PlantModalCtrl.$inject = [
		"$uibModalInstance",
		"items",
		"$scope",
		"ApiEndpoint",
		"genericFactory"
	];

	StorageModalAddEditCtrl.$inject = [
		"$uibModalInstance",
		"storage",
		"$scope",
		"storageBinService",
		"localStorageService",
		"ApiEndpoint",
		"$filter"
	];

	StorageModalCtrl.$inject = [
		"$uibModalInstance",
		"items",
		"$scope",
		"ApiEndpoint",
		"genericFactory"
	];

	/* @ngInject */
	function storageBinController(
		$state,
		$scope,
		toastr,
		DTColumnDefBuilder,
		DTOptionsBuilder,
		genericFactory,
		localStorageService,
		ApiEndpoint,
		$filter,
		$uibModal,
		$window,
		$http,
		$anchorScroll,
		$location,
		$log
	) {
		var vm = angular.extend(this, {
			getStockList: getStockList,
			stocks: [],
			plants: [],
			storages: [],
			addPlant: addPlant,
			addStorage: addStorage,
			deletPlantConfirm: deletPlantConfirm,
			deletStorageConfirm: deletStorageConfirm,
			getPlant: getPlant,
			getStorage: getStorage,
			perPage : 10,
			total_count:0,
			pageno:1,
			pageChanged:pageChanged,
		});

		(function activate() {
			$scope.selectPlantCode = "selectPlant";
			$scope.selectStorageCode = "selectStorage";
			$scope.isLoading = false;
			$scope.isFormOpen = false;
		//	loadTotalCount();
		})();

		var loginUser = localStorageService.get(ApiEndpoint.userKey);
		var putAway = staticUrl + "/putAway";
		var tempStorageBinId = 0;

		$scope.rackLetter = "";
		$scope.columnNo = "";
		$scope.rowLetter = "";
		$scope.paletteSide = "";

		$scope.storageBins = [];
		$scope.itemList = [];
		$scope.itemTypes = [];
		$scope.isBinSelected = true;
		$scope.isItemAdded = false;
		$scope.isStock = false;

		$scope.showTable = false;
		$scope.anyFormOpen = false;
		$scope.isItemAssigned = false;
		$scope.uploadCvs = true;

		
		
	
		
		// current page
		$scope.pagination = {
		        current: 1
		    };
		
		// page changed 
		function pageChanged (pageNo) {
			console.log("Page No ::"+pageNo)
			vm.pageno=pageNo;
			loadStorageList();
			
		}
		
		
		
		/**
		 * @author : Praful
		 * @description : get Stock by Click on Show Stock Button
		 * @date : 10/07/2018
		 */
		function getStockList(arr) {
			console.log(JSON.stringify(arr));
			var msg = "Stock Load....', 'Successful !!";
			var url = putAway + "/getStockList?storageBinCode=" + arr.storageBinCode;
			genericFactory.getAll(msg, url).then(function (response) {
				vm.stocks = response.data;
				$scope.isStock = true;
				console.log(JSON.stringify(vm.stocks));
				// $window.scrollTo(0, 0);
				$window.scrollTo({ top: 0, behavior: 'smooth' })
			});
		}
		function loadTotalCount(){
			var msg = "";

			var url=putAway+"/getTotalStorageLocationCount";;
		console.log("URL "+url)
			genericFactory.getAll(msg,url).then(function(response) {
				vm.total_count = response.data;
				console.log("count::  "+vm.total_count)
				
			});
		}
		
		$scope.close = function () {
			$scope.isStock = false;
		};

		/**
		 * @author : Praful
		 * @description : get Plant list on load
		 * @date : 12/07/2018
		 */
		function loadPlantList() {
			loadStotage()
			var msg = "";
			var url = putAway + "/listPlant";
			genericFactory.getAll(msg, url).then(function (response) {
				vm.plants = response.data;
			});
		}
		function loadStotage() {
			var msg = "";
			var url = putAway + "/listStorage";
			genericFactory.getAll(msg, url).then(function (response) {
				vm.storages = response.data;
			});
		}

		/**
		 * @author : Praful
		 * @description : get Plant list on load
		 * @date : 12/07/2018
		 */
		function loadStorageList() {
			loadTotalCount();
			var msg = "";
			var url = putAway + "/storageBinItemWiseListPagination/"+vm.pageno+"/"+vm.perPage;
			console.log("URL ::" +url)
			genericFactory.getAll(msg, url).then(function (response) {
				$scope.storageBins = response.data;
				console.log("storageBins" +JSON.stringify($scope.storageBins
						))
			});
		}

		/**
		 * @author : Praful
		 * @description : get Plant list on load
		 * @date : 12/07/2018
		 */
		function getPlant(selectPlantCode) {
			$scope.plant = JSON.parse(selectPlantCode);
		}

		function getStorage(selectStorageCode) {
			$scope.storage = JSON.parse(selectStorageCode);
		}

		/**
		 * @author : Anurag
		 * @description : fetch storagebins on load.
		 * @date : 21/06/2018
		 */
		/*$scope.fetchStorageBins = function () {
			//$(".loading").show();
			loadTotalCount();
			var msg = "Storage Bins Load....', 'Successful !!";
			var url = putAway + "/storageBinItemWiseListPagination"+vm.pageno+"/"+vm.perPage;
			genericFactory.getAll(msg, url).then(function (response) {
			//	$(".loading").hide();
				$scope.storageBins = response.data;
				//$scope.fetchItemLocMapList();

				
			});
		};*/

		/**
		 * @author : Anurag
		 * @description : fetch itemList on load.
		 * @date : 24/06/2018
		 */
		$scope.fetchItemList = function () {
			var msg = "Items List Load....', 'Successful !!";
			var url = putAway + "/itemList";
			genericFactory.getAll(msg, url).then(function (response) {
				$scope.itemList = response.data;
				//				 console.log(JSON.stringify($scope.itemList));
			});
		};

		/**
		 * @author : Anurag
		 * @description : fetch itemLocMap on load.
		 * @date : 24/06/2018
		 */
	/*	$scope.fetchItemLocMapList = function () {
			$scope.isLoading = true;
			var msg = "Item Loc Map List Load....', 'Successful !!";
			var url = putAway + "/itemLocMapList";
			genericFactory.getAll(msg, url).then(function (response) {
				$scope.itemLocMaps = response.data;
				$scope.isLoading = false;
				$scope.allDetails = [];
												 console.log(JSON.stringify($scope.storageBins));

				for (var i = 0; i < $scope.storageBins.length; i++) {
					var obj = {};
					obj.storageBinCode = $scope.storageBins[i].storageBinCode;
					obj.itemMaps = "";
					for (var j = 0; j < $scope.itemLocMaps.length; j++) {
						if (
							$scope.itemLocMaps[j].storageBinMst.storageBinCode ==
							$scope.storageBins[i].storageBinCode
						) {
							obj.itemMaps += $scope.itemLocMaps[j].itemMst.id + "; ";
						}
					}
					if (obj.itemMaps == "") {
						obj.itemMaps += "Not Assigned";
					}
					obj.itemMaps = obj.itemMaps.replace(/;\s*$/, "");
					$scope.allDetails.push(obj);
				}
				//								console.log(JSON.stringify($scope.allDetails));

				$scope.showTable = true;
				// console.log(JSON.stringify($scope.itemLocMaps));
			});
		};*/

		/**
		 * @author : Anurag
		 * @description : show Storage Bin Form
		 * @date : 21/06/2018
		 */
		$scope.showStorageBinForm = function () {
			$scope.isNewStorageBin = true;
			$scope.storageBinFormOpen = true;
			$scope.itemBinFormOpen = true;
			for (var i = 0; i < $scope.storageBins.length; i++)
				$scope.storageBins[i].flag = false;
			$scope.rackLetter = "";
			$scope.columnNo = "";
			$scope.rowLetter = "";
			$scope.paletteSide = "";
			$scope.showTable = false;
			$scope.anyFormOpen = true;
			$scope.isStock = false;
			$scope.uploadCvs = true;
			$scope.isFormOpen = true;
		};

		/**
		 * @author : Anurag
		 * @description : show "Item Assign to Bin" Form
		 * @date : 24/06/2018
		 */
		$scope.showItemBinForm = function () {
			$scope.isNewItemBin = true;
			$scope.itemBinFormOpen = true;
			$scope.storageBinFormOpen = true;
			for (var i = 0; i < $scope.storageBins.length; i++)
				$scope.storageBins[i].flag = false;
			$scope.rackLetter = "";
			$scope.columnNo = "";
			$scope.rowLetter = "";
			$scope.paletteSide = "";
			$scope.showTable = false;
			$scope.anyFormOpen = true;
			$scope.isStock = false;
			$scope.isItemAssigned = false;
			$scope.uploadCvs = true;
			$scope.isFormOpen = true;
		};

		/**
		 * @author : Anurag
		 * @description : Cancel Storage Bins Form
		 * @date : 19/06/2018
		 */
		$scope.cancelAdd = function () {
			$scope.isNewStorageBin = false;
			$scope.isNewItemBin = false;
			$scope.storageBinFormOpen = false;
			$scope.itemBinFormOpen = false;
			$scope.itemBinFormOpen = false;
			$scope.updBtn = false;
			$scope.isBinSelected = true;
			$scope.isItemAdded = false;
			$scope.itemTypes = [];
			$scope.storageBin = "";
			$scope.selectedItem = "";
			$scope.anyFormOpen = false;
			$scope.selectPlantCode = "selectPlant";
			$scope.selectStorageCode = "selectStorage";
			$scope.plant = "";
			$scope.storage = "";
		//	$scope.fetchStorageBins();
			$scope.uploadCvs = true;
			$scope.isFormOpen = false;
		};

		/**
		 * @author : Anurag
		 * @description : add a storage bin
		 * @date : 21/06/2018
		 */
		$scope.addStorageBin = function () {
			if ($scope.selectPlantCode == "selectPlant") {
				toastr.error("Please select Plant Code");
				document.getElementById("selectPlantCode").focus();
				return true;
			}
			if ($scope.selectStorageCode == "selectStorage") {
				toastr.error("Please select Storage Location");
				document.getElementById("selectStorageCode").focus();
				return true;
			}
			if (
				$scope.rackLetter == "" ||
				$scope.columnNo == "" ||
				$scope.rowLetter == "" ||
				$scope.paletteSide == ""
			) {
				toastr.error("Please fill all Fields!");
				return true;
			}
			var newArr = {};
			var storage = JSON.parse($scope.selectStorageCode);
			var plant = JSON.parse($scope.selectPlantCode);
			newArr.rackLetter = $scope.rackLetter.toUpperCase();
			newArr.columnNo = $scope.columnNo.toUpperCase();
			newArr.rowLetter = $scope.rowLetter.toUpperCase();
			newArr.paletteSide = $scope.paletteSide;
			newArr.plant = plant;
			newArr.storage = storage;
			newArr.storageBinCode =
				newArr.plant.plant_code +
				"-" +
				newArr.storage.storage_location +
				"-" +
				newArr.rackLetter +
				"" +
				newArr.columnNo +
				"" +
				newArr.rowLetter +
				"" +
				newArr.paletteSide;

			for (var i = 0; i < $scope.storageBins.length; i++) {
				if ($scope.storageBins[i].storageBinCode === newArr.storageBinCode) {
					toastr.error("Storage Bin Already Exists");
					return;
				}
			}

			newArr.updUserId = loginUser.id;
			newArr.updDateTime = $filter("date")(
				new Date(),
				"dd/MM/yyyy - h:mm:ss a"
			);
			newArr.active = 1;

			// console.log(JSON.stringify(newArr));

			var msg = "Saving New Storage Bin";
			var url = putAway + "/addStorageBin";
			genericFactory.add(msg, url, newArr).then(function (response) {
				$scope.isNewStorageBin = false;
				$scope.storageBinFormOpen = false;
				$scope.itemBinFormOpen = false;
				$scope.anyFormOpen = false;
				$scope.isFormOpen = false;
				$scope.selectPlantCode = "selectPlant";
				$scope.selectStorageCode = "selectStorage";
				$scope.plant = "";
				$scope.storage = "";
			//	$scope.fetchStorageBins();
			});
		};

		/**
		 * @author : Anurag
		 * @description : On Selecting Storage Bin from DropDown show if items
		 *              	are already assigned
		 * @date : 25/06/2018
		 */
		$scope.binSelected = function () {
			$scope.isBinSelected = false;
			var storageBinId;
			for (var i = 0; i < $scope.storageBins.length; i++) {
				if ($scope.storageBins[i].storageBinCode == $scope.storageBin) {
					storageBinId = $scope.storageBins[i].storageBinId;
				}
			}
			// console.log(storageBinId);
			var msg = "Checking Items assigned to selected bin";
			if (storageBinId) {
				var url = putAway + "/binItemCheck?storageBinId=" + storageBinId;
				genericFactory.getAll(msg, url).then(function (response) {
					$scope.assignedItems = response.data;
					if ($scope.assignedItems != "") {
						$scope.isItemAssigned = true;
					} else {
						$scope.isItemAssigned = false;
					}

					console.log(JSON.stringify($scope.assignedItems));
				});
			}
		};

		/**
		 * @author : Anurag
		 * @description : check and remove item types to selected bin
		 * @date : 25/06/2018
		 */
		$scope.checkRemoveItem = function (i, arr) {
			console.log(JSON.stringify(arr));
			var msg = "Checking if assigned Item has stock";
			var url =
				putAway +
				"/getStockListByItem?storageBinCode=" +
				arr.storageBinMst.storageBinCode +
				"&itemId=" +
				arr.itemMst.id;
			genericFactory.getAll(msg, url).then(function (response) {
				$scope.itemStock = response.data;
				console.log(JSON.stringify($scope.itemStock));
				if ($scope.itemStock.length != 0) {
					toastr.error(
						"Cannot remove as this bin has stock for this item. Please clear the bin and try again!"
					);
					return;
				} else {
					var msg = "Deleting assigned item to bin";
					var url = putAway + "/delItemLocMap?itemLocMapId=" + arr.itemLocMapId;
					genericFactory.getAll(msg, url).then(function (response) {
						$scope.binSelected();
					});
				}
			});
		};

		/**
		 * @author : Anurag
		 * @description : Add item types to the selected bin
		 * @date : 25/06/2018
		 */
		$scope.addItemType = function () {
			if ($scope.selectedItem == undefined) {
				toastr.error("Please enter item type");
				return;
			}

			if ($scope.selectedItem.itemDtl != null) {
				if ($scope.assignedItems != "") {
					for (var j = 0; j < $scope.assignedItems.length; j++)
						if (
							$scope.assignedItems[j].itemMst.itemDtl ==
							$scope.selectedItem.itemDtl
						) {
							toastr.error("Item type is already assigned to bin");
							$scope.selectedItem = "";
							return;
						}
				}
			}

			if ($scope.selectedItem.itemDtl != null) {
				if ($scope.itemTypes.length != 0) {
					for (var i = 0; i < $scope.itemTypes.length; i++) {
						if ($scope.itemTypes[i].itemDtl == $scope.selectedItem.itemDtl) {
							toastr.error("Same item type cannot be added again.");
							$scope.selectedItem = "";
							return;
						}
					}
					$scope.itemTypes.push($scope.selectedItem);
				} else $scope.itemTypes.push($scope.selectedItem);
			} else {
				toastr.error("Please enter item type");
				return;
			}

			$scope.isItemAdded = true;

			$scope.selectedItem = "";
		};

		/**
		 * @author : Anurag
		 * @description : Remove added item
		 * @date : 25/06/2018
		 */
		$scope.removeItem = function (index) {
			$scope.itemTypes.splice(index, 1);
			if ($scope.itemTypes.length != 0) {
				$scope.isItemAdded = true;
			} else {
				$scope.isItemAdded = false;
			}
		};

		/**
		 * @author : Anurag
		 * @description : Map Item Type to Storage Bin and send to Backend
		 * @date : 25/06/2018
		 */
		$scope.assignItemType = function () {
			var finalArr = [];
			for (var i = 0; i < $scope.itemTypes.length; i++) {
				var obj = {};
				obj.storageBinCode = $scope.storageBin;
				obj.itemMstId = $scope.itemTypes[i].itemMstId;
				finalArr.push(obj);
			}
			if (finalArr.length > 0) {
				var msg = "Saving ItemType Storage Bin Map";
				var url = putAway + "/addItemLocMap";
				// console.log(JSON.stringify(finalArr));
				genericFactory.add(msg, url, finalArr).then(function (response) {
					$scope.isNewItemBin = false;
					$scope.storageBinFormOpen = false;
					$scope.itemBinFormOpen = false;
					$scope.anyFormOpen = false;
					$scope.itemTypes = [];
					$scope.storageBin = "";
					$scope.selectedItem = "";
					$scope.isBinSelected = true;
					$scope.isItemAdded = false;
					$scope.isFormOpen = false;
					//$scope.fetchItemList();
					window.location.reload();
					
				});
			}
		};

		/**
		 * @author : ABS
		 * @description : to generate QR code
		 * @date : 07/09/2018
		 */
		var generateQRCode = function (divId, s) {
			var qrcode = new QRCode(document.getElementById(divId), {
				width: 100,
				height: 100
			});
			qrcode.makeCode(s);
		};

		/**
		 * @author : ABS
		 * @description : to print QR code
		 * @date : 07/09/2018
		 */
		$scope.printCode = function () {
			var qrflag = false;
			for (var i = 0; i < $scope.storageBins.length; i++) {
				if ($scope.storageBins[i].select) {
					qrflag = true;
					break;
				}
			}

			console.log(JSON.stringify($scope.allDetails));

			if (!qrflag) {
				toastr.error("Please select a Storage Bin's checkbox ");
				return;
			}

			for (var i in $scope.qrCodeArr) {
				var qrDiv1 = document.getElementById("qrPrint" + i);
				if (qrDiv1) {
					while (qrDiv1.firstChild) {
						qrDiv1.removeChild(qrDiv1.firstChild);
					}
				}
			}

			$scope.qrCodeArr = [];
			var arr = [];
			for (var i = 0; i < $scope.storageBins.length; i++) {
				if ($scope.storageBins[i].select) {
					// console.log("Select Packing
					// "+JSON.stringify($scope.storageBins[i]))
					var obj = {
						storageBinCode: $scope.storageBins[i].storageBinCode,
						divisions: $scope.storageBins[i].storageBinCode
					};
					$scope.qrCodeArr.push(obj);
					// console.log("Selected Array
					// "+JSON.stringify($scope.qrCodeArr))
				}
			}

			setTimeout(function () {
				// console.log($scope.qrCodeArr.length);
				for (var i = 0; i < $scope.qrCodeArr.length; i++) {
					generateQRCode("qrPrint" + i, $scope.qrCodeArr[i].storageBinCode);
					// console.log("hello");
				}
			}, 50);

			setTimeout(function () {
				var innerContents = "";

				for (var i = 0; i < $scope.qrCodeArr.length; i++) {
					innerContents =
						innerContents +
						document.getElementById("qrPrintParent" + i).innerHTML;
				}
				var popupWinindow = window.open(
					"",
					"_blank",
					"width=600,height=700,scrollbars=no,menubar=no,toolbar=no,location=no,status=no,titlebar=no"
				);
				popupWinindow.document.open();
				popupWinindow.document.write("<style> @page {  margin: 8;} </style>");
				popupWinindow.document.write(
					'<html><body onload="window.print()">' + innerContents + "</html>"
				);
				popupWinindow.document.close();
			}, 100);
		};

		/**
		 * @author : Anurag
		 * @Description : init controller
		 * @date : 18/06/2018
		 */
		var init = function () {
			//$scope.fetchStorageBins();
			$scope.fetchItemList();
			$scope.assignedItems=[];
			$scope.qrCodeArr = [];
			$scope.isNewStorageBin = false;

			$scope.dtOptions = DTOptionsBuilder.newOptions().withDOM(
				'C<"clear">lfrtip'
			);
			$scope.dtColumnDefs = [
				DTColumnDefBuilder.newColumnDef(3).notSortable(),
				DTColumnDefBuilder.newColumnDef(3).notSortable()
			];
			loadPlantList();
			loadStorageList();
		};

		init();

		/**
		 * @author : Praful
		 * @Description : Add Plant controller
		 * @date : 07/12/2019
		 */
		function addPlant(plant) {
			var usr = plant ? plant : {};
			// alert(JSON.stringify(usr));
			var modalInstance = $uibModal.open({
				animation: true,
				ariaLabelledBy: "modal-title",
				ariaDescribedBy: "modal-body",
				templateUrl: "templates/storageBin/plantModelAddEdit.html",
				controller: "PlantModalAddEditCtrl",
				backdrop: "static",
				controllerAs: "vm",
				size: "md",
				resolve: {
					plant: function () {
						return usr;
					}
				}
			});

			modalInstance.result.then(
				function () {
					loadPlantList();
				},
				function () {
					$log.info("Modal dismissed at: " + new Date());
				}
			);
		}

		/**
		 * @author : Praful
		 * @Description : Delete Plant controller
		 * @date : 12/07/2019
		 */
		function deletPlantConfirm(selectPlantCode) {
			console.log(JSON.stringify(selectPlantCode));
			var plant = JSON.parse(selectPlantCode);
			console.log(JSON.stringify(plant));
			var modalInstance = $uibModal.open({
				animation: true,
				ariaLabelledBy: "modal-title",
				ariaDescribedBy: "modal-body",
				templateUrl: "templates/storageBin/plantModelDelet.html",
				controller: "PlantModalCtrl",
				controllerAs: "vm",
				size: "md",
				resolve: {
					items: function () {
						return plant;
					}
				}
			});

			modalInstance.result.then(
				function () {
					loadPlantList();
				},
				function () {
					$log.info("Modal dismissed at: " + new Date());
				}
			);
		}

		/**
		 * @author : Praful
		 * @Description : Add Storage controller
		 * @date : 07/12/2019
		 */
		function addStorage(storage) {
			var usr = storage ? storage : {};
			// alert(JSON.stringify(usr));
			var modalInstance = $uibModal.open({
				animation: true,
				ariaLabelledBy: "modal-title",
				ariaDescribedBy: "modal-body",
				templateUrl: "templates/storageBin/storageModelAddEdit.html",
				controller: "StorageModalAddEditCtrl",
				backdrop: "static",
				controllerAs: "vm",
				size: "md",
				resolve: {
					storage: function () {
						return usr;
					}
				}
			});

			modalInstance.result.then(
				function () {
					loadStorageList();
				},
				function () {
					$log.info("Modal dismissed at: " + new Date());
				}
			);
		}

		/**
		 * @author : Praful
		 * @Description : Delete Storage controller
		 * @date : 12/07/2019
		 */
		function deletStorageConfirm(selectStorageCode) {
			console.log(JSON.stringify(selectStorageCode));
			var storage = JSON.parse(selectStorageCode);
			console.log(JSON.stringify(storage));
			var modalInstance = $uibModal.open({
				animation: true,
				ariaLabelledBy: "modal-title",
				ariaDescribedBy: "modal-body",
				templateUrl: "templates/storageBin/storageModelDelet.html",
				controller: "StorageModalCtrl",
				controllerAs: "vm",
				size: "md",
				resolve: {
					items: function () {
						return storage;
					}
				}
			});

			modalInstance.result.then(
				function () {
					loadStorageList();
				},
				function () {
					$log.info("Modal dismissed at: " + new Date());
				}
			);
		}
	}

	function PlantModalCtrl(
		$uibModalInstance,
		items,
		$scope,
		ApiEndpoint,
		genericFactory
	) {
		var putAway = staticUrl + "/putAway";
		var vm = angular.extend(this, {
			items: items,
			ok: ok,
			delet: delet,
			cancel: cancel
		});

		(function activate() {})();

		// ******************************************************

		function ok() {
			$uibModalInstance.close();
		}

		function delet(plant) {
			var msg = "Plant Deleted....', 'Successful !!";
			var url = putAway + "/deletePlant";
			genericFactory.delet(msg, url, plant).then(function (response) {
				$uibModalInstance.close(plant);
			});
		}

		function cancel() {
			$uibModalInstance.dismiss("cancel");
		}
	}

	function PlantModalAddEditCtrl(
		$uibModalInstance,
		plant,
		$scope,
		storageBinService,
		localStorageService,
		ApiEndpoint,
		$filter
	) {
		// var loginUser = localStorageService.get(ApiEndpoint.userKey);
		var putAway = staticUrl + "/putAway";
		var vm = angular.extend(this, {
			ok: ok,
			cancel: cancel
		});

		(function activate() {
			$scope.plant = plant;
		})();

		function ok(plant) {
			var msg = "Plant Added....', 'Successful !!";
			var url = putAway + "/addPlant";
			plant.deletes = 1;
			storageBinService.addPlant(url, plant).then(function (response) {
				$uibModalInstance.close(plant);
			});
		}

		function cancel() {
			$uibModalInstance.dismiss("cancel");
		}
	}

	function StorageModalCtrl(
		$uibModalInstance,
		items,
		$scope,
		ApiEndpoint,
		genericFactory
	) {
		var putAway = staticUrl + "/putAway";
		var vm = angular.extend(this, {
			items: items,
			ok: ok,
			delet: delet,
			cancel: cancel
		});

		(function activate() {})();

		// ******************************************************

		function ok() {
			$uibModalInstance.close();
		}

		function delet(storage) {
			var msg = "Store Deleted....', 'Successful !!";
			var url = putAway + "/deleteStorage";
			genericFactory.delet(msg, url, storage).then(function (response) {
				$uibModalInstance.close(storage);
			});
		}

		function cancel() {
			$uibModalInstance.dismiss("cancel");
		}
	}

	function StorageModalAddEditCtrl(
		$uibModalInstance,
		storage,
		$scope,
		storageBinService,
		localStorageService,
		ApiEndpoint,
		$filter
	) {
		// var loginUser = localStorageService.get(ApiEndpoint.userKey);
		var putAway = staticUrl + "/putAway";
		var vm = angular.extend(this, {
			ok: ok,
			cancel: cancel
		});

		(function activate() {
			$scope.storage = storage;
		})();

		function ok(storage) {
			var msg = "Store Added....', 'Successful !!";
			var errMsg = "Store Code Required Unique...!";
			var url = putAway + "/addStorage";
			storage.deletes = 1;
			storageBinService.addStorage(url, storage).then(function (response) {
				$uibModalInstance.close(storage);
			});
		}

		function cancel() {
			$uibModalInstance.dismiss("cancel");
		}
	}
})();
