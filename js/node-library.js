"use strickt";

class NodeLibrary {
  static fnInitialize() {
    NodeLibrary.objCanvas = new TCanvas();
  }
}

class TCanvas {
  constructor() {
    var self = this;

    this.iWidth = 5000;
    this.iHeight = 5000;

    this.iCenterX = 0;
    this.iCenterY = 0;

    this.fnUpdateCenterCoordinates();

    document.body.insertAdjacentHTML('beforeEnd', "<div id='root-block'></div>");
    this.objDOMRootElement = document.getElementById('root-block');
    this.objDOMRootElement.style.width = `${this.iWidth}px`;
    this.objDOMRootElement.style.height = `${this.iHeight}px`;

    this.objDOMRootElement.insertAdjacentHTML('beforeEnd', `
      <svg id='svg' xmlns="http://www.w3.org/2000/svg"
        width="${this.iWidth}"
        height="${this.iHeight}">
      </svg>`);
    this.objSVGElement = document.getElementById('svg');
    this.objSVGElement.addEventListener("mousedown", function(objEvent) {
      console.log(objEvent);
      self.objSVGElement.insertAdjacentHTML('beforeEnd', `
      <rect
        x="${objEvent.offsetX}"
        y="${objEvent.offsetY}"
        width="100"
        height="100"
        fill="#95B3D7">
      </rect>`);
    },
    false);

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

class TConnection {
  static fnConnect(objInBlock, sInPortName, objOutBlock, sOutPortName) {
    let objConnection = {InConnection: [], OutConnection: []};

  }
}

// {InConnection: [], OutConnection: []}
TConnection.aConnectionsCollection = [];

class TPort {
  constructor(sName, fnOnConnect) {
    this.sName = sName;
    this.fnOnConnect = fnOnConnect;
  }
}

class TBlock {
  constructor(sName) {
    if (!sName)
      throw "Block must have name";

    if (TBlock.fnGetBlockByName(sName))
      throw "Block must unique name";

    TBlock.aBlocksCollection.push(this);

    this.iPositionX = 0;
    this.iPositionY = 0;

    this.sName = sName;

    this.aOutputPortsCollection = [];
    this.aInputPortsCollection = [];
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
  constructor(sName) {
    super(sName);

    this.aOutputPortsCollection.push(new TPort("TextOutput"));
    this.sText = '';
  }
}

class TInputTextBlock extends TBlock {
  constructor(sName) {
    super(sName);

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
  NodeLibrary.fnInitialize();

  objOutputTextBlock = new TOutputTextBlock("Text output Block");
  objInputTextBlock = new TInputTextBlock("Text input Block");

  TConnection.fnConnect(objOutputTextBlock, "TextOutput", objInputTextBlock, "TextInput");

  console.log("NodeLibrary.objCanvas", NodeLibrary.objCanvas);

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
