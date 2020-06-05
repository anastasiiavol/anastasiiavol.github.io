let boxSizeArray = [7,7,7,3,3,3,3];	// Array indicating how many items there is rooom for in the right column ULs

let arrow_offsetX = -5;	// Offset X - position of small arrow
let arrow_offsetY = 0;	// Offset Y - position of small arrow

let arrow_offsetX_firefox = -6;	// Firefox - offset X small arrow
let arrow_offsetY_firefox = -13; // Firefox - offset Y small arrow

let verticalSpaceBetweenListItems = 3;	// Pixels space between one <li> and next
// Same value or higher as margin bottom in CSS for #dhtmlgoodies_dragDropContainer ul li,#dragContent li


let initShuffleItems = true;	// Shuffle items before staring

let indicateDestionationByUseOfArrow = true;	// Display arrow to indicate where object will be dropped(false = use rectangle)


let lockedAfterDrag = true;	/* Lock items after they have been dragged, i.e. the user get's only one shot for the correct answer */


/* END VARIABLES YOU COULD MODIFY */

let dragDropTopContainer = false;
let dragTimer = -1;
let dragContentObj = false;
let contentToBeDragged = false;	// Reference to dragged <li>
let contentToBeDragged_src = false;	// Reference to parent of <li> before drag started
let contentToBeDragged_next = false; 	// Reference to next sibling of <li> to be dragged
let destinationObj = false;	// Reference to <UL> or <LI> where element is dropped.
let dragDropIndicator = false;	// Reference to small arrow indicating where items will be dropped
let ulPositionArray = new Array();
let mouseoverObj = false;	// Reference to highlighted DIV

let MSIE = navigator.userAgent.indexOf('MSIE')>=0?true:false;
let navigatorVersion = navigator.appVersion.replace(/.*?MSIE (\d\.\d).*/g,'$1')/1;
let destinationBoxes = new Array();
let indicateDestinationBox = false;

function getTopPos(inputObj)
{
    let returnValue = inputObj.offsetTop;
    while((inputObj = inputObj.offsetParent) != null){
        if(inputObj.tagName!='HTML')returnValue += inputObj.offsetTop;
    }
    return returnValue;
}

function getLeftPos(inputObj)
{
    let returnValue = inputObj.offsetLeft;
    while((inputObj = inputObj.offsetParent) != null){
        if(inputObj.tagName!='HTML')returnValue += inputObj.offsetLeft;
    }
    return returnValue;
}

function cancelEvent()
{
    return false;
}
function initDrag(e)	// Mouse button is pressed down on a LI
{
    if(document.all)e = event;
    if(lockedAfterDrag && this.parentNode.id!='allItems')return;
    let st = Math.max(document.body.scrollTop,document.documentElement.scrollTop);
    let sl = Math.max(document.body.scrollLeft,document.documentElement.scrollLeft);



    dragTimer = 0;
    dragContentObj.style.left = e.clientX + sl + 'px';
    dragContentObj.style.top = e.clientY + st + 'px';
    contentToBeDragged = this;
    contentToBeDragged_src = this.parentNode;
    contentToBeDragged_next = false;
    if(this.nextSibling){
        contentToBeDragged_next = this.nextSibling;
        if(!this.tagName && contentToBeDragged_next.nextSibling)contentToBeDragged_next = contentToBeDragged_next.nextSibling;
    }
    timerDrag();
    return false;
}

function everythingIsCorrect()
{
    alert('Congratulations! Everything is correct');
}


function timerDrag()
{
    if(dragTimer>=0 && dragTimer<10){
        dragTimer++;
        setTimeout('timerDrag()',10);
        return;
    }
    if(dragTimer==10){
        dragContentObj.style.display='block';
        dragContentObj.appendChild(contentToBeDragged);
    }
}

function moveDragContent(e)
{
    if(dragTimer<10){
        if(contentToBeDragged){
            if(contentToBeDragged_next){
                contentToBeDragged_src.insertBefore(contentToBeDragged,contentToBeDragged_next);
            }else{
                contentToBeDragged_src.appendChild(contentToBeDragged);
            }
        }
        return;
    }
    if(document.all)e = event;
    let st = Math.max(document.body.scrollTop,document.documentElement.scrollTop);
    let sl = Math.max(document.body.scrollLeft,document.documentElement.scrollLeft);


    dragContentObj.style.left = e.clientX + sl + 'px';
    dragContentObj.style.top = e.clientY + st + 'px';

    if(mouseoverObj)mouseoverObj.className='';
    destinationObj = false;
    dragDropIndicator.style.display='none';
    if(indicateDestinationBox)indicateDestinationBox.style.display='none';
    let x = e.clientX + sl;
    let y = e.clientY + st;
    let width = dragContentObj.offsetWidth;
    let height = dragContentObj.offsetHeight;

    let tmpOffsetX = arrow_offsetX;
    let tmpOffsetY = arrow_offsetY;
    if(!document.all){
        tmpOffsetX = arrow_offsetX_firefox;
        tmpOffsetY = arrow_offsetY_firefox;
    }

    for(let no=0;no<ulPositionArray.length;no++){
        let ul_leftPos = ulPositionArray[no]['left'];
        let ul_topPos = ulPositionArray[no]['top'];
        let ul_height = ulPositionArray[no]['height'];
        let ul_width = ulPositionArray[no]['width'];

        if((x+width) > ul_leftPos && x<(ul_leftPos + ul_width) && (y+height)> ul_topPos && y<(ul_topPos + ul_height)){
            let noExisting = ulPositionArray[no]['obj'].getElementsByTagName('LI').length;
            if(indicateDestinationBox && indicateDestinationBox.parentNode==ulPositionArray[no]['obj'])noExisting--;
            if(noExisting<boxSizeArray[no-1] || no==0){
                dragDropIndicator.style.left = ul_leftPos + tmpOffsetX + 'px';
                let subLi = ulPositionArray[no]['obj'].getElementsByTagName('LI');
                for(let liIndex=0;liIndex<subLi.length;liIndex++){
                    let tmpTop = getTopPos(subLi[liIndex]);
                    if(!indicateDestionationByUseOfArrow){
                        if(y<tmpTop){
                            destinationObj = subLi[liIndex];
                            indicateDestinationBox.style.display='block';
                            subLi[liIndex].parentNode.insertBefore(indicateDestinationBox,subLi[liIndex]);
                            break;
                        }
                    }else{
                        if(y<tmpTop){
                            destinationObj = subLi[liIndex];
                            dragDropIndicator.style.top = tmpTop + tmpOffsetY - Math.round(dragDropIndicator.clientHeight/2) + 'px';
                            dragDropIndicator.style.display='block';
                            break;
                        }
                    }
                }

                if(!indicateDestionationByUseOfArrow){
                    if(indicateDestinationBox.style.display=='none'){
                        indicateDestinationBox.style.display='block';
                        ulPositionArray[no]['obj'].appendChild(indicateDestinationBox);
                    }

                }else{
                    if(subLi.length>0 && dragDropIndicator.style.display=='none'){
                        dragDropIndicator.style.top = getTopPos(subLi[subLi.length-1]) + subLi[subLi.length-1].offsetHeight + tmpOffsetY + 'px';
                        dragDropIndicator.style.display='block';
                    }
                    if(subLi.length==0){
                        dragDropIndicator.style.top = ul_topPos + arrow_offsetY + 'px'
                        dragDropIndicator.style.display='block';
                    }
                }

                if(!destinationObj)destinationObj = ulPositionArray[no]['obj'];
                mouseoverObj = ulPositionArray[no]['obj'].parentNode;
                mouseoverObj.className='mouseover';
                return;
            }
        }
    }
}

function checkAnswers()
{

    for(let no=0;no<destinationBoxes.length;no++){
        let subLis = destinationBoxes[no].getElementsByTagName('LI');
        if(subLis.length<boxSizeArray[no])return;

        for(let no2=0;no2<subLis.length;no2++){
            if(subLis[no2].className=='wrongAnswer')return;
        }
    }

    everythingIsCorrect();


}


/* End dragging
Put <LI> into a destination or back to where it came from.
*/
function dragDropEnd(e)
{
    if(dragTimer==-1)return;
    if(dragTimer<10){
        dragTimer = -1;
        return;
    }
    dragTimer = -1;
    if(document.all)e = event;
    if(destinationObj){
        let groupId = contentToBeDragged.getAttribute('groupId');
        if(!groupId)groupId = contentToBeDragged.groupId;

        let destinationToCheckOn = destinationObj;
        if(destinationObj.tagName!='UL'){
            destinationToCheckOn = destinationObj.parentNode;
        }

        let answerCheck = false;
        if(groupId == destinationToCheckOn.id){
            contentToBeDragged.className = 'correctAnswer';
            answerCheck=true;
        }else{
            contentToBeDragged.className = 'wrongAnswer';
        }
        if(destinationObj.id=='allItems' || destinationObj.parentNode.id=='allItems')contentToBeDragged.className='';


        if(destinationObj.tagName=='UL'){
            destinationObj.appendChild(contentToBeDragged);
        }else{
            destinationObj.parentNode.insertBefore(contentToBeDragged,destinationObj);
        }
        mouseoverObj.className='';
        destinationObj = false;
        dragDropIndicator.style.display='none';
        if(indicateDestinationBox){
            indicateDestinationBox.style.display='none';
            document.body.appendChild(indicateDestinationBox);
        }

        contentToBeDragged = false;

        if(answerCheck)checkAnswers();

        return;
    }
    if(contentToBeDragged_next){
        contentToBeDragged_src.insertBefore(contentToBeDragged,contentToBeDragged_next);
    }else{
        contentToBeDragged_src.appendChild(contentToBeDragged);
    }
    contentToBeDragged = false;
    dragDropIndicator.style.display='none';
    if(indicateDestinationBox){
        indicateDestinationBox.style.display='none';
        document.body.appendChild(indicateDestinationBox);

    }
    mouseoverObj = false;

}

/*
Preparing data to be saved
*/
function saveDragDropNodes()
{
    let saveString = "";
    let uls = dragDropTopContainer.getElementsByTagName('UL');
    for(let no=0;no<uls.length;no++){	// LOoping through all <ul>
        let lis = uls[no].getElementsByTagName('LI');
        for(let no2=0;no2<lis.length;no2++){
            if(saveString.length>0)saveString = saveString + ";";
            saveString = saveString + uls[no].id + '|' + lis[no2].id;
        }
    }

    document.getElementById('saveContent').innerHTML = '<h1>Ready to save these nodes:</h1> ' + saveString.replace(/;/g,';<br>') + '<p>Format: ID of ul |(pipe) ID of li;(semicolon)</p><p>You can put these values into a hidden form fields, post it to the server and explode the submitted value there</p>';

}

function initDragDropScript()
{
    dragContentObj = document.getElementById('dragContent');
    dragDropIndicator = document.getElementById('dragDropIndicator');
    dragDropTopContainer = document.getElementById('dhtmlgoodies_dragDropContainer');
    document.documentElement.onselectstart = cancelEvent;;
    let listItems = dragDropTopContainer.getElementsByTagName('LI');	// Get array containing all <LI>
    let itemHeight = false;
    for(let no=0;no<listItems.length;no++){
        listItems[no].onmousedown = initDrag;
        listItems[no].onselectstart = cancelEvent;
        if(!itemHeight)itemHeight = listItems[no].offsetHeight;
        if(MSIE && navigatorVersion/1<6){
            listItems[no].style.cursor='hand';
        }
    }

    let mainContainer = document.getElementById('dhtmlgoodies_mainContainer');
    let uls = mainContainer.getElementsByTagName('UL');
    itemHeight = itemHeight + verticalSpaceBetweenListItems;
    for(let no=0;no<uls.length;no++){
        uls[no].style.height = itemHeight * boxSizeArray[no]  + 'px';
        destinationBoxes[destinationBoxes.length] = uls[no];
    }

    let leftContainer = document.getElementById('dhtmlgoodies_listOfItems');
    let itemBox = leftContainer.getElementsByTagName('UL')[0];

    document.documentElement.onmousemove = moveDragContent;	// Mouse move event - moving draggable div
    document.documentElement.onmouseup = dragDropEnd;	// Mouse move event - moving draggable div

    let ulArray = dragDropTopContainer.getElementsByTagName('UL');
    for(let no=0;no<ulArray.length;no++){
        ulPositionArray[no] = new Array();
        ulPositionArray[no]['left'] = getLeftPos(ulArray[no]);
        ulPositionArray[no]['top'] = getTopPos(ulArray[no]);
        ulPositionArray[no]['width'] = ulArray[no].offsetWidth;
        ulPositionArray[no]['height'] = ulArray[no].clientHeight;
        ulPositionArray[no]['obj'] = ulArray[no];
    }

    if(initShuffleItems){
        let allItemsObj = document.getElementById('allItems');
        let initItems = allItemsObj.getElementsByTagName('LI');

        for(let no=0;no<(initItems.length*10);no++){
            let itemIndex = Math.floor(Math.random()*initItems.length);
            allItemsObj.appendChild(initItems[itemIndex]);
        }
    }
    if(!indicateDestionationByUseOfArrow){
        indicateDestinationBox = document.createElement('LI');
        indicateDestinationBox.id = 'indicateDestination';
        indicateDestinationBox.style.display='none';
        document.body.appendChild(indicateDestinationBox);
    }

}

window.onload = initDragDropScript;




