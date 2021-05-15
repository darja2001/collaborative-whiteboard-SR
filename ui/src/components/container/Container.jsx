import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import Board from '../board/Board';
import DragMove from "../DragMove";
import $ from 'jquery';
import Safe from "react-safe";
import 'jquery-ui-dist/jquery-ui';
import Draggable from 'react-draggable';
import io from 'socket.io-client';
import { Text, View,FlatList} from 'react-native';
import './style.css';


class Container extends React.Component
{
  
    state ={
        data:[],
        images:[{image:'images/kitten.jpg'}, {image:'images/penguin.jpg'}],
        id: 0
      }
    
      timeout;
      socket = io.connect("http://localhost:5000");
  
      ctx;
      isDrawing = false;
      rect = true;
      image;

      constructor(props) {
        super(props);

        this.socket.on("canvas-data", function(data){

            var root = this;
            var interval = setInterval(function(){
                if(root.isDrawing) return;
                root.isDrawing = true;
                clearInterval(interval);
                var image = new Image()
                var canvas = document.querySelector('#board');
                var ctx = canvas.getContext('2d');
                image.onload = function() {
                    ctx.drawImage(image, 0, 0);
                    
                    root.isDrawing = false;
                };
                image.src = data;
            }, 200)
        })
    }
    
        fetchData= async()=>{
            const response = await fetch('http://localhost:5000/user');
            const users = await response.json();
            this.setState({data: users});
        
        }
    
 
    
    
    componentDidMount() {
        this.drawOnCanvas();
        this.fetchData();
        $(function(){  
            var canvas = document.querySelector('#board');
            this.ctx = canvas.getContext('2d');
            var ctx = this.ctx;
            var index;
            var img;
            var htmlElement;
            //Make every clone image unique.  
              var counts = [0];
               var resizeOpts = { 
                 handles: "all", autoHide:true
               };  

              $(".dragImg").draggable({
                                    helper: "clone",
                                    //Create counter
                                    start: function() { counts[0]++; 
                                        htmlElement = document.getElementsByClassName('img');
                                       
                                        //alert(htmlElement)
 
                                   }});
           
           $("#dropHere").droppable({
                  drop: function(e, ui){
                          if(ui.draggable.hasClass("dragImg")) {
                $(this).append($(ui.helper).clone());
              //Pointing to the dragImg class in dropHere and add new class.
              img = document.getElementById("gif1")
                            var image = new Image();
                            
                            //ctx.drawImage(img, 20, 20, 200, 200)
                    $("#dropHere .dragImg").addClass("item-"+counts[0]);
                       $("#dropHere .img").addClass("imgSize-"+counts[0]);
                           
              //Remove the current class (ui-draggable and dragImg)
                    $("#dropHere .item-"+counts[0]).removeClass("dragImg ui-draggable ui-draggable-dragging");
           
                    var root = this;
                    

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
    




    clickMe(){
        this.rect = true
        alert(this.rect)
    }
 

    componentWillReceiveProps(newProps) {
        this.ctx.strokeStyle = newProps.color;
        this.ctx.lineWidth = newProps.size;
    }

    drawOnCanvas() {
        var canvas = document.querySelector('#board');
        this.ctx = canvas.getContext('2d');
        var ctx = this.ctx;

        var sketch = document.querySelector('#dropHere');
        var sketch_style = getComputedStyle(sketch);
        canvas.width = parseInt(sketch_style.getPropertyValue('width'));
        canvas.height = parseInt(sketch_style.getPropertyValue('height'));

        var mouse = {x: 0, y: 0};
        var last_mouse = {x: 0, y: 0};

        /* Mouse Capturing Work */
        canvas.addEventListener('mousemove', function(e) {
            last_mouse.x = mouse.x;
            last_mouse.y = mouse.y;

            mouse.x = e.pageX - this.offsetLeft;
            mouse.y = e.pageY - this.offsetTop;
        }, false);


        /* Drawing on Paint App */
        ctx.lineWidth = this.props.size;
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
        ctx.strokeStyle = this.props.color;

        canvas.addEventListener('mousedown', function(e) {
            canvas.addEventListener('mousemove', onPaint, false);
        }, false);

        canvas.addEventListener('mouseup', function() {
            canvas.removeEventListener('mousemove', onPaint, false);
        }, false);

        var root = this;
        var onPaint = function() {
            ctx.beginPath();
            ctx.moveTo(last_mouse.x, last_mouse.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.closePath();
            ctx.stroke();

            if(root.timeout != undefined) clearTimeout(root.timeout);
            root.timeout = setTimeout(function(){
                var base64ImageData = canvas.toDataURL("image/png");
                root.socket.emit("canvas-data", base64ImageData);
            }, 1000)
        };
    }

    render() {
    
        return (
            
                    <div className="container">
                        <div className="tools-section">
                            <div className="color-picker-container">
                                Select Brush Color : &nbsp; 
                                <input type="color" value={this.state.color} onChange={this.changeColor.bind(this)}/>
                            </div>

                            <div className="brushsize-container">
                                Select Brush Size : &nbsp; 
                                <select value={this.state.size} onChange={this.changeSize.bind(this)}>
                                    <option> 5 </option>
                                    <option> 10 </option>
                                    <option> 15 </option>
                                    <option> 20 </option>
                                    <option> 25 </option>
                                    <option> 30 </option>
                                </select>
                            </div>

                        </div>
                
                        <div className="board-container">
                            
                            
                        
                            <h4>Select picture!</h4>
                        
                                
                                    {this.state.images.map(image => (
                                        <div className="dragImg"><img id={"gif"+this.state.id++} classnName="img" src={image.image} width='200px' height='100px'/></div>
                                        
                                    ))}
                        
                        
                            <div id="dropHere"><canvas className="board" id="board" color={this.state.color} size={this.state.size}></canvas></div>
                            
                            <button onClick={()=>this.clickMe()}>Click me</button>                            
                        
                    
                        </div>
                    </div>

                    
           
        );
    }

    
}



export default Container