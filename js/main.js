"use strickt";

window.document.addEventListener("DOMContentLoaded", function()
{
    window.objBlocks = {};
    window.objDOMRootElement = {};
    
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
        return window.objBlocks[sName];
    };
    
    window.fnGetCenterCoordinates = function()
    {
        window.aCenterCoordinates = [
            window.objDOMRootElement.clientWidth/2-document.body.clientWidth/2,
            window.objDOMRootElement.clientHeight/2-document.body.clientHeight/2
        ];
        return window.aCenterCoordinates;
    };
    

    document.body.insertAdjacentHTML('beforeEnd', "<div id='root-block'></div>");
    window.objDOMRootElement = document.getElementById('root-block');
    window.objDOMRootElement.style.width = "5000px";
    window.objDOMRootElement.style.height = "5000px";
    
    fnGetCenterCoordinates();
    
    document.body.scrollLeft = window.aCenterCoordinates[0];
    document.body.scrollTop = window.aCenterCoordinates[1];

    console.log(document.body.scrollTop, window.aCenterCoordinates);
    //document.body.height/2);
    
    var objTestBlock = window.fnAddBlock(window.objDOMRootElement, "test", "Test block");
    objTestBlock.fnSetPosition(100, 100);
    //window.fnAddBlock(document.body, "test2", "Test block");
});