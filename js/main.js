"use strickt";

window.document.addEventListener("DOMContentLoaded", function()
{
    window.objBlocks = {};    
    
    var TBlock = function(sName, sTitle, objDOMParent, objAttributes)
    {
        this.sTitle = sTitle;
        this.objDOMParent = objDOMParent;
        
        this.fnRender = function()
        {
            var sBlocks = "<div id='"+sName+"' class='block'><div class='title'></div><div class='content'></div></div>";
            this.objDOMParent.insertAdjacentHTML('beforeEnd', sBlocks);
        }
        
        this.fnRender();
    }
    
    window.fnAddBlock = function(sName, sTitle, objDOMParent, objAttributes)
    {
        console.log(objDOMParent);
        if (window.objBlocks[sName] !== undefined)
            throw "Block "+sName+" already exists";
        window.objBlocks[sName] = new TBlock(sName, sTitle, objDOMParent, objAttributes);
    }
    
    window.fnAddBlock("test", "Test block", document.body);
});