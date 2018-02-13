"use strickt";

var objIPCRenderer = require('electron').ipcRenderer;

function fnGetRandomID() {
  let min = 0x11111111;
  let max = 0xFFFFFFFF;
  return Math.floor(Math.random() * (max - min)) + min;
}

function TDocumentBody() {
  var aChildren = [];
  var objElement = document.body;
  var sID = objRandom.getRandomID();

  function fnRemoveChild(in_objElement) {
    objElement.removeChild(in_objElement);
  }

  function fnAddChild(in_objElement) {
    objElement.appendChild(in_objElement)
  }

  function fnAddHTML(in_sHTML) {
    objElement.insertAdjacentHTML("beforeEnd", in_sHTML);
  }

  return {
    fnRemoveChild: fnRemoveChild,
    fnAddChild: fnAddChild,
    fnAddHTML: fnAddHTML
  }
}

function TTabView(in_objParent) {
  var aTabs = {};
  var objElement;
  var sSelectedTabID = '';
  var sID = objRandom.getRandomID();

  fnShow();
  fnUpdate();

  function fnShow() {
    fnHide();
    in_objParent.fnAddHTML(`
      <div id='${sID}'>
        <div class='ui-tabs'></div>
        <div class='ui-tabs-content'></div>
      </div>
    `);
    objElement = document.getElementById(sID);
  }

  function fnHide() {
    if (objElement)
      objElement.remove();
  }

  function fnUpdate() {
    for (let iKey in aTabs) {
      document.getElementById(iKey).className = "";
      document.getElementById(iKey+"-content").style.display = "none";
    }

    if (sSelectedTabID in aTabs) {
      document.getElementById(sSelectedTabID).className = "tab-active";
      document.getElementById(sSelectedTabID+"-content").style.display = "block";
    }
  }

  function fnSelectTabByID(in_sTabID) {
    if (in_sTabID in aTabs) {
      sSelectedTabID = in_sTabID;
      fnUpdate();
    }
  }

  function fnSelectTab(in_iTabID) {
    var iNumber = 0;

    for (let sKey in aTabs) {
      if (iNumber == in_iTabID) {
        sSelectedTabID = sKey;
        fnUpdate();
        break;
      }
    }
  }

  function fnAddTabWithHTML(in_sName, in_sHTML) {
    let objTab = {
      sName: in_sName,
      sID: objRandom.getRandomID()
    }
    aTabs[objTab.sID] = objTab;

    var objUITabsContent = objElement.getElementsByClassName('ui-tabs-content')[0];
    var objUITabs = objElement.getElementsByClassName('ui-tabs')[0];

    sSelectedTabID = objTab.sID;

    objUITabs.insertAdjacentHTML("beforeEnd", `
      <div id='${objTab.sID}'>${objTab.sName}</div>
    `);
    objUITabsContent.insertAdjacentHTML("beforeEnd", `
      <div id='${objTab.sID}-content'>${in_sHTML}</div>
    `);

    document.getElementById(objTab.sID).addEventListener(
      "click",
      function() {
        fnSelectTabByID(objTab.sID);
      }
    );

    fnUpdate();
  }

  function fnAddTabWithObject(in_sName, in_objDOMObject) {
    let objTab = {
      sName: in_sName,
      sID: objRandom.getRandomID()
    }
    aTabs[objTab.sID] = objTab;

    var objUITabsContent = objElement.getElementsByClassName('ui-tabs-content')[0];
    var objUITabs = objElement.getElementsByClassName('ui-tabs')[0];

    sSelectedTabID = objTab.sID;

    objUITabs.insertAdjacentHTML("beforeEnd", `
      <div id='${objTab.sID}'>${objTab.sName}</div>
    `);
    objUITabsContent.insertAdjacentHTML("beforeEnd", `
      <div id='${objTab.sID}-content'></div>
    `);

    var objUITabContent = document.getElementById(`${objTab.sID}-content`);

    objUITabContent.appendChild(in_objDOMObject);

    document.getElementById(objTab.sID).addEventListener(
      "click",
      function() {
        fnSelectTabByID(objTab.sID);
      }
    );

    fnUpdate();
  }

  function fnAddHTMLToTab(in_iTabID, in_sHTML) {
    aTabs[in_iTabID].insertAdjacentHTML("beforeEnd", in_sHTML);
  }

  function fnRemoveTab(in_iTabID) {
    var iNumber = 0;

    for (let sKey in aTabs) {
      if (iNumber == in_iTabID) {
        fnRemoveTabByID(sKey);

        break;
      }
    }
  }

  function fnRemoveTabByID(in_sTabID) {
    document.getElementById(in_sTabID).remove();
    document.getElementById(in_sTabID+"-content").remove();

    delete aTabs[in_sTabID];

    if (sSelectedTabID == in_sTabID)
      sSelectedTabID = Object.keys(aTabs)[0];

    fnUpdate();
  }

  return {
    fnAddTabWithHTML: fnAddTabWithHTML,
    fnAddTabWithObject: fnAddTabWithObject,
    fnRemoveTabByID: fnRemoveTabByID,
    fnRemoveTab: fnRemoveTab,
    fnSelectTabByID: fnSelectTabByID,
    fnSelectTab: fnSelectTab
  }
}

/*
function TCanvas() {
  var sID = objRandom.getRandomID();

  var objDOMObject = document.createElement("canvas");

  objDOMObject.width = 5000;
  objDOMObject.height = 5000;

  var objContext = objDOMObject.getContext("2d");

  //objDOMObject.style="border:1px solid black";
  objContext.fillStyle = "#fff";
  objContext.fillRect(0, 0, objDOMObject.width, objDOMObject.height);

  for (let x=0; x<objDOMObject.width/10; x++) {
    for (let y=0; y<objDOMObject.height/10; y++) {
      objContext.fillStyle = "#000";
      objContext.fillRect(x*10, y*10, 1, 1);
    }
  }

  function getDOMObject() {
    return objDOMObject;
  }

  return {
    getDOMObject: getDOMObject
  }
}

class TCanvasClass {
  constructor(objParent) {
    var self = this;

    this.sID = objRandom.getRandomID();
    this.objParent = objParent;

    TCanvas.aCanvasCollection.push(this);

    this.iWidth = 5000;
    this.iHeight = 5000;

    this.iCenterX = 0;
    this.iCenterY = 0;

    this.fnUpdateCenterCoordinates();

    //objParent.insertAdjacentHTML('beforeEnd', `<div id='${this.sID}'></div>`);
    objParent.fnAddHTML(`<div id='${this.sID}'></div>`);
    this.objDOMElement = document.getElementById(this.sID);
    this.objDOMElement.style.width = `${this.iWidth}px`;
    this.objDOMElement.style.height = `${this.iHeight}px`;

    this.objDOMElement.insertAdjacentHTML('beforeEnd', `
      <svg id='svg' xmlns="http://www.w3.org/2000/svg"
        width="${this.iWidth}"
        height="${this.iHeight}">
      </svg>`);
    this.objSVGElement = document.getElementById('svg');

    this.fnSetViewAtCenter();

    this.aBlocksCollection = [];
    this.aConnectionsCollection = [];
  }

  fnUpdateCenterCoordinates() {
    this.iCenterX = parseInt(this.iWidth/2-document.body.clientWidth/2);
    this.iCenterY = parseInt(this.iHeight/2-document.body.clientHeight/2);
  }

  fnSetViewAtCenter() {
    var self = this;
    setTimeout(function() {
        document.body.scrollLeft = self.iCenterX;
        document.body.scrollTop = self.iCenterY;
    }, 1);
  }
}

TCanvas.aCanvasCollection = [];

class TConnection {
  constructor(objInBlock, sInPortName, objOutBlock, sOutPortName) {
    this.sID = Date.now();
    this.aIn = [];
    this.aOut = [];

    TConnection.aConnectionsCollection.push(this);
  }

  static fnConnect(objInBlock, sInPortName, objOutBlock, sOutPortName) {
    let objConnection = new TConnection(objInBlock, sInPortName, objOutBlock, sOutPortName); //{InConnection: [], OutConnection: []};
  }
}

// {InConnection: [], OutConnection: []}
TConnection.aConnectionsCollection = [];
*/

function TBlockManager(in_objParent) {
    var objRoot;
    var objBlocks;
    var objPorts;
    var objConnections;

    objRoot = in_objParent;

    function fnCreateNode(in_sName, in_sType) {

    }

    return {
        fnCreateNode: fnCreateNode
      , fnCreateConnection: null
      , fnCreatePort: null
    }
}

class TPort {
  constructor(sName, fnOnConnect) {
    this.sName = sName;
    this.fnOnConnect = fnOnConnect;
  }
}

class TBlock {
  constructor(objParent, sName) {
    if (!sName)
      throw "Block must have name";

    this.sID = Date.now();
    this.objParent = objParent;

    TBlock.aBlocksCollection.push(this);

    this.iPositionX = 0;
    this.iPositionY = 0;

    this.sName = sName;

    this.aOutputPortsCollection = [];
    this.aInputPortsCollection = [];
  }

  fnShow() {

  }

  fnHide() {
    document.getElementById(this.sID).remove();
  }

  static fnGetBlockByName(sName) {
    let objResult;

    TBlock.aBlocksCollection.some(function(objItem, iKey) {
      if (objItem.sName == sName) {
        objResult = objItem;
        return true;
      } else
        return false;
    });

    return objResult;
  }

  fnGetPortByName(sName) {
    let objResult;

    this.aOutputPortsCollection.some(function(objItem, iKey) {
      if (objItem.sName == sName) {
        objResult = objItem;
        return true;
      } else
        return false;
    });

    if (!objResult)
      this.aInputPortsCollection.some(function() {
        if (objItem.sName == sName) {
          objResult = objItem;
          return true;
        } else
          return false;
      });

    return objResult;
  }
}

TBlock.aBlocksCollection = [];

class TOutputTextBlock extends TBlock {
  constructor(objParent, sName) {
    super(objParent, sName);

    this.aOutputPortsCollection.push(new TPort("TextOutput"));
    this.sText = '';
  }
}

class TInputTextBlock extends TBlock {
  constructor(objParent, sName) {
    super(objParent, sName);

    this.aInputPortsCollection.push(new TPort("TextInput"));
    this.sText = '';
  }
}

/*
var TConnection = function()
{
    this.aIn  = [];
    this.aOut = [];
};

window.fnCreateConnection = function(iInID, iOutID)
{
    var aConnections = fnSearchConnectionIn(iInID, iOutID);

    if (aConnections.length===0) {
        var objConnection = new TConnection();

        objConnection.aIn.push(iInID);
        objConnection.aOut.push(iOutID);

        window.aConnections.push(objConnection);

        return window.aConnections.length-1;
    }
}

window.fnSearchConnection = function(iInID, iOutID)
{
    var aResult = [];

    for (var iKey in window.aConnections) {
        for (var iInKey in window.aConnections[iKey].aIn) {
            if (window.aConnections[iKey].aIn[iInKey] == iInID) {
                for (var iOutKey in window.aConnections[iKey].aOut) {
                    if (window.aConnections[iKey].aOut[iOutKey] == iOutID) {
                        aResult.push(iKey);
                    }
                }
            }
        }
    }

    return aResult;
};

var TBlock = function(objDOMParent, sName, sTitle, objAttributes)
{
    this.sTitle = sTitle;
    this.objDOMParent = objDOMParent;
    this.objDOMBlock = {};
    this.sName = sName;

    this.fnRender = function()
    {
        var sBlocks = "<div id='"+sName+"' class='block'><div class='title'></div><div class='content'></div></div>";
        this.objDOMParent.insertAdjacentHTML('beforeEnd', sBlocks);
        this.objDOMBlock = document.getElementById(sName);
    };

    this.fnSetTitle = function(sTitle)
    {
        var objDOMTitle = this.objDOMBlock.querySelector('.title');
        objDOMTitle.innerText = sTitle;
    };

    this.fnSetPosition = function(iX, iY)
    {
        this.objDOMBlock.style.left = iX+"px";
        this.objDOMBlock.style.top = iY+"px";
    };

    this.fnGetPosition = function()
    {
        return [
            parseInt(this.objDOMBlock.style.left),
            parseInt(this.objDOMBlock.style.top)
        ];
    };

    this.fnRender();
    this.fnSetTitle(sTitle);
};

window.fnAddBlock = function(objDOMParent, sName, sTitle, objAttributes)
{
    if (window.objBlocks[sName] !== undefined)
        throw "Block "+sName+" already exists";
    window.objBlocks[sName] = new TBlock(objDOMParent, sName, sTitle, objAttributes);
    window.aBlocks.push(window.objBlocks[sName]);
    return window.aBlocks.length-1;
};

window.fnGetCenterCoordinates = function()
{
    window.aCenterCoordinates = [
        parseInt(window.objDOMRootElement.clientWidth/2-document.body.clientWidth/2),
        parseInt(window.objDOMRootElement.clientHeight/2-document.body.clientHeight/2)
    ];
    return window.aCenterCoordinates;
};
*/

window.document.addEventListener("DOMContentLoaded", function()
{
  objPath = require("path");
  objUtil = require(__dirname + "/js/util.js");

  var objDocumentBody = new TDocumentBody();

  //let objCanvas = new TCanvas();

  let objUITabsContent = new TTabView(objDocumentBody);
  objUITabsContent.fnAddTabWithHTML('tab 1', '<a>link 1</a>');
  //objUITabsContent.fnAddTabWithObject('tab 2', objCanvas.getDOMObject());

  var objBlockManager = new TBlockManager();

  //objUITabsContent.fnRemoveTab(0);
  //let firstCanvas = new TCanvas(objUITabsContent);

  objOutputTextBlock = new TOutputTextBlock(objUITabsContent, "Text output Block");
  objInputTextBlock = new TInputTextBlock(objUITabsContent, "Text input Block");

  TConnection.fnConnect(objOutputTextBlock, "TextOutput", objInputTextBlock, "TextInput");

  objIPCRenderer.send('save');
  return;
/*
  document.body.insertAdjacentHTML('beforeEnd', "<div id='root-block'></div>");
  window.objDOMRootElement = document.getElementById('root-block');
  objDOMRootElement.style.width = "5000px";
  objDOMRootElement.style.height = "5000px";

  fnGetCenterCoordinates();

  setTimeout(function() {
      document.body.scrollLeft = window.aCenterCoordinates[0];
      document.body.scrollTop = window.aCenterCoordinates[1];

      console.log(window.aCenterCoordinates[0]+"px", window.aCenterCoordinates[1]+"px", document.body.scrollLeft, document.body.scrollLeft);
  }, 1);
  //document.body.height/2);

  var objTestBlock = fnAddBlock(objDOMRootElement, "test", "Test block");
  //objTestBlock.fnSetPosition(100, 100);
  //window.fnAddBlock(document.body, "test2", "Test block");
*/
});
