import React from "react";
import ReactDOM from 'react-dom';
import Board from '../board/Board';
import DragMove from "../DragMove";
import $ from 'jquery';
import Safe from "react-safe";
import 'jquery-ui-dist/jquery-ui';
import Draggable from 'react-draggable';
import './style.css';

class Test extends React.Component
{
  
    
    constructor(props) {
        super(props);

        this.state = {
            color: "#000000",
            size: "5"
            
           
        }
        
    }
    
 
    
    
    componentDidMount() {
        $(function(){  
            //Make every clone image unique.  
              var counts = [0];
               var resizeOpts = { 
                 handles: "all" ,autoHide:true
               };    
              $(".dragImg").draggable({
                                    helper: "clone",
                                    //Create counter
                                    start: function() { counts[0]++; }
                                   });
           
           $("#dropHere").droppable({
                  drop: function(e, ui){
                          if(ui.draggable.hasClass("dragImg")) {
                $(this).append($(ui.helper).clone());
              //Pointing to the dragImg class in dropHere and add new class.
                    $("#dropHere .dragImg").addClass("item-"+counts[0]);
                       $("#dropHere .img").addClass("imgSize-"+counts[0]);
                           
              //Remove the current class (ui-draggable and dragImg)
                    $("#dropHere .item-"+counts[0]).removeClass("dragImg ui-draggable ui-draggable-dragging");
           
           $(".item-"+counts[0]).dblclick(function() {
           $(this).remove();
           });     
               make_draggable($(".item-"+counts[0])); 
                 $(".imgSize-"+counts[0]).resizable(resizeOpts);     
                  }
           
                  }
                 });
           
           
           var zIndex = 0;
           function make_draggable(elements)
           {	
               elements.draggable({
                   containment:'parent',
                   start:function(e,ui){ ui.helper.css('z-index',++zIndex); },
                   stop:function(e,ui){
                   }
               });
           }    
           
           
               
              });
    }
    
    

    changeColor(params) {
        this.setState({
            color: params.target.value
        })
    }

    changeSize(params) {
        this.setState({
            size: params.target.value
        })
    }
    
    render() {
    
        return (
            
            <div class="container">
               <div class="dragImg"><img class="img" src="images/kitten.jpg"/></div>
               <div id="dropHere"></div>  
            </div>

                
            
           
        )
    }

    
}

export default Test